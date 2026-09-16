const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Ushbu email bilan foydalanuvchi allaqachon mavjud"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role || 'STUDENT'
      }
    });

    // If role is STUDENT, automatically create Student record if needed
    if (user.role === 'STUDENT') {
      await prisma.student.create({
        data: {
          userId: user.id
        }
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email yoki parol noto'g'ri"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Email yoki parol noto'g'ri"
      });
    }

    // Rol tekshiruvi: Agar ma'lum bir rol tanlangan bo'lsa (masalan: O'quvchi)
    // lekin kiritilgan hisob boshqa rolga tegishli bo'lsa (masalan: Admin)
    if (role && user.role !== role) {
      const roleLabels = {
        ADMIN: 'Administrator',
        TEACHER: "O'qituvchi",
        STUDENT: "O'quvchi",
        PARENT: 'Ota-ona'
      };
      const requestedRoleLabel = roleLabels[role] || role;
      return res.status(403).json({
        success: false,
        error: `${requestedRoleLabel} uchun bunday hisob yoki parol mavjud emas!`
      });
    }

    const payload = {
      userId: user.id,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || 'eduflow_fallback_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      data: {
        token,
        role: user.role,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        studentProfile: {
          include: {
            group: {
              include: {
                course: true
              }
            }
          }
        },
        taughtGroups: {
          include: {
            course: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Foydalanuvchi topilmadi"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/switch-role - Faqat ADMIN boshqa rollarga o'ta oladi
router.post('/switch-role', authMiddleware, async (req, res, next) => {
  try {
    const targetRole = req.body.targetRole || req.body.role;
    const validRoles = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];

    if (!targetRole || !validRoles.includes(targetRole)) {
      return res.status(400).json({
        success: false,
        error: "Noto'g'ri rol ko'rsatildi. Ruxsat etilgan rollar: " + validRoles.join(', ')
      });
    }

    // Faqat ADMIN boshqa rollarga o'ta oladi, qolganlarga (STUDENT, TEACHER, PARENT) ruxsat yo'q
    const isOriginalAdmin = req.user.role === 'ADMIN' || req.user.originalRole === 'ADMIN';

    if (!isOriginalAdmin) {
      return res.status(403).json({
        success: false,
        error: "Sizga ruxsat yo'q"
      });
    }

    // Admin uchun yangi rol bo'yicha token yaratish
    const payload = {
      userId: req.user.userId,
      role: targetRole,
      originalRole: 'ADMIN'
    };

    const secret = process.env.JWT_SECRET || 'eduflow_fallback_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: `Rol muvaffaqiyatli ${targetRole} ga o'zgartirildi`,
      data: {
        token,
        role: targetRole,
        originalRole: 'ADMIN'
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/check-access/:role - Rolga kirish huquqini tekshirish
router.get('/check-access/:role', authMiddleware, async (req, res, next) => {
  try {
    const { role } = req.params;
    const validRoles = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Noto'g'ri rol ko'rsatildi"
      });
    }

    // Faqat ADMIN barcha bo'limlarga o'ta oladi
    if (req.user.role === 'ADMIN' || req.user.originalRole === 'ADMIN') {
      return res.status(200).json({
        success: true,
        allowed: true,
        message: "Admin uchun to'liq ruxsat berilgan"
      });
    }

    // O'quvchi yoki boshqalar faqat o'z roliga mos bo'limga kira oladi
    if (req.user.role === role) {
      return res.status(200).json({
        success: true,
        allowed: true,
        message: "Ruxsat mavjud"
      });
    }

    // Agar o'quvchi adminga yoki boshqa rolga kirmoqchi bo'lsa
    return res.status(403).json({
      success: false,
      allowed: false,
      error: "Sizga ruxsat yo'q"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
