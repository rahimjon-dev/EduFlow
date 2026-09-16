const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createTeacherSchema, updateTeacherSchema } = require('../validators/teachers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/teachers - ADMIN & TEACHER
router.get('/', authMiddleware, requireRole('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        taughtGroups: {
          include: {
            course: true,
            _count: {
              select: { students: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: teachers
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/teachers - ADMIN only
router.post('/', authMiddleware, requireRole('ADMIN'), validate(createTeacherSchema), async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

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

    const teacher = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'TEACHER'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/teachers/:id - ADMIN & TEACHER
router.get('/:id', authMiddleware, requireRole('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        taughtGroups: {
          include: {
            course: true,
            students: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "O'qituvchi topilmadi"
      });
    }

    return res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/teachers/:id - ADMIN only
router.patch('/:id', authMiddleware, requireRole('ADMIN'), validate(updateTeacherSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, password } = req.body;

    const teacher = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "O'qituvchi topilmadi"
      });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email, NOT: { id } }
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: "Ushbu email boshqa foydalanuvchida mavjud"
        });
      }
      updateData.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedTeacher = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedTeacher
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/teachers/:id - ADMIN only
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "O'qituvchi topilmadi"
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      data: { message: "O'qituvchi muvaffaqiyatli o'chirildi" }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
