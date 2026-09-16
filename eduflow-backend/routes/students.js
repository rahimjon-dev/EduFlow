const express = require('express');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createStudentSchema, updateStudentSchema } = require('../validators/students');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/students - ADMIN & TEACHER
router.get('/', authMiddleware, requireRole('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const where = {};
    if (groupId) {
      where.groupId = groupId;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        group: {
          include: {
            course: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/students - ADMIN only
router.post('/', authMiddleware, requireRole('ADMIN'), validate(createStudentSchema), async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Bunday foydalanuvchi topilmadi"
      });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { userId }
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        error: "Ushbu foydalanuvchi allaqachon talaba sifatida ro'yxatdan o'tgan"
      });
    }

    if (groupId) {
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      if (!group) {
        return res.status(404).json({
          success: false,
          error: "Bunday guruh topilmadi"
        });
      }
    }

    const student = await prisma.student.create({
      data: {
        userId,
        groupId: groupId || null
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        group: true
      }
    });

    return res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/students/:id - ADMIN, TEACHER or the student themselves
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        group: {
          include: {
            course: true,
            teacher: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          }
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 50
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        },
        grades: {
          include: {
            course: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Talaba topilmadi"
      });
    }

    // Role check: Admin, Teacher or the student themselves
    if (req.user.role === 'STUDENT' && student.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: "Sizga ruxsat yo'q"
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/students/:id - ADMIN only
router.patch('/:id', authMiddleware, requireRole('ADMIN'), validate(updateStudentSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { groupId } = req.body;

    const student = await prisma.student.findUnique({
      where: { id }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Talaba topilmadi"
      });
    }

    if (groupId) {
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      if (!group) {
        return res.status(404).json({
          success: false,
          error: "Bunday guruh topilmadi"
        });
      }
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        groupId: groupId !== undefined ? groupId : student.groupId
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        group: true
      }
    });

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/students/:id - ADMIN only
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Talaba topilmadi"
      });
    }

    await prisma.student.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      data: { message: "Talaba muvaffaqiyatli o'chirildi" }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
