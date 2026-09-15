const express = require('express');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createGroupSchema, updateGroupSchema } = require('../validators/groups');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/groups - Authenticated
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { courseId, teacherId } = req.query;
    const where = {};
    if (courseId) where.courseId = courseId;
    if (teacherId) where.teacherId = teacherId;

    const groups = await prisma.group.findMany({
      where,
      include: {
        course: true,
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        _count: {
          select: { students: true, homeworks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: groups
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/groups - ADMIN only
router.post('/', authMiddleware, requireRole('ADMIN'), validate(createGroupSchema), async (req, res, next) => {
  try {
    const { name, courseId, teacherId } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Kurs topilmadi"
      });
    }

    if (teacherId) {
      const teacher = await prisma.user.findFirst({
        where: { id: teacherId, role: 'TEACHER' }
      });
      if (!teacher) {
        return res.status(404).json({
          success: false,
          error: "Bunday o'qituvchi topilmadi"
        });
      }
    }

    const group = await prisma.group.create({
      data: {
        name,
        courseId,
        teacherId: teacherId || null
      },
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
    });

    return res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/groups/:id - Authenticated
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        course: true,
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
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
        },
        homeworks: {
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Guruh topilmadi"
      });
    }

    return res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/groups/:id - ADMIN only
router.patch('/:id', authMiddleware, requireRole('ADMIN'), validate(updateGroupSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, courseId, teacherId } = req.body;

    const group = await prisma.group.findUnique({
      where: { id }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Guruh topilmadi"
      });
    }

    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });
      if (!course) {
        return res.status(404).json({
          success: false,
          error: "Kurs topilmadi"
        });
      }
    }

    if (teacherId) {
      const teacher = await prisma.user.findFirst({
        where: { id: teacherId, role: 'TEACHER' }
      });
      if (!teacher) {
        return res.status(404).json({
          success: false,
          error: "O'qituvchi topilmadi"
        });
      }
    }

    const updated = await prisma.group.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(courseId && { courseId }),
        ...(teacherId !== undefined && { teacherId: teacherId || null })
      },
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
    });

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/groups/:id - ADMIN only
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const group = await prisma.group.findUnique({
      where: { id }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Guruh topilmadi"
      });
    }

    await prisma.group.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      data: { message: "Guruh muvaffaqiyatli o'chirildi" }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
