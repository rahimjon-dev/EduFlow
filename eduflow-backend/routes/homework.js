const express = require('express');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createHomeworkSchema, updateHomeworkSchema } = require('../validators/homework');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/homework - Authenticated
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const where = {};

    if (req.user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.userId }
      });
      if (!student || !student.groupId) {
        return res.status(200).json({ success: true, data: [] });
      }
      where.groupId = student.groupId;
    } else {
      if (groupId) where.groupId = groupId;
    }

    const homeworks = await prisma.homework.findMany({
      where,
      include: {
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
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    return res.status(200).json({
      success: true,
      data: homeworks
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/homework - TEACHER & ADMIN
router.post('/', authMiddleware, requireRole('ADMIN', 'TEACHER'), validate(createHomeworkSchema), async (req, res, next) => {
  try {
    const { title, description, groupId, dueDate } = req.body;

    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Guruh topilmadi"
      });
    }

    const homework = await prisma.homework.create({
      data: {
        title,
        description: description || null,
        groupId,
        dueDate: new Date(dueDate)
      },
      include: {
        group: {
          include: {
            course: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: homework
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/homework/:id - Authenticated
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const homework = await prisma.homework.findUnique({
      where: { id },
      include: {
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
        }
      }
    });

    if (!homework) {
      return res.status(404).json({
        success: false,
        error: "Uy vazifasi topilmadi"
      });
    }

    if (req.user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.userId }
      });
      if (!student || student.groupId !== homework.groupId) {
        return res.status(403).json({
          success: false,
          error: "Faqat o'z guruhingiz vazifasini ko'rishingiz mumkin"
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: homework
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/homework/:id - TEACHER & ADMIN
router.patch('/:id', authMiddleware, requireRole('ADMIN', 'TEACHER'), validate(updateHomeworkSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    const homework = await prisma.homework.findUnique({
      where: { id }
    });

    if (!homework) {
      return res.status(404).json({
        success: false,
        error: "Uy vazifasi topilmadi"
      });
    }

    const updated = await prisma.homework.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(dueDate && { dueDate: new Date(dueDate) })
      },
      include: {
        group: {
          include: {
            course: true
          }
        }
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

// DELETE /api/homework/:id - TEACHER & ADMIN
router.delete('/:id', authMiddleware, requireRole('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const homework = await prisma.homework.findUnique({
      where: { id }
    });

    if (!homework) {
      return res.status(404).json({
        success: false,
        error: "Uy vazifasi topilmadi"
      });
    }

    await prisma.homework.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      data: { message: "Uy vazifasi muvaffaqiyatli o'chirildi" }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
