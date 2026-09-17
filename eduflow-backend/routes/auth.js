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
    const { email, password } = req.body;

    const searchEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: searchEmail },
          ...(searchEmail === 'admin' || searchEmail === 'admin@eduflow.edu' || searchEmail === 'admin@eduflow.uz' ? [{ email: 'admin@eduflow.uz' }] : [])
        ]
      }
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

module.exports = router;
