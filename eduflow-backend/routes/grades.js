const express = require('express');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createGradeSchema, updateGradeSchema } = require('../validators/grades');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/grades - ADMIN, TEACHER or Student's own
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { studentId, courseId } = req.query;
    const where = {};

    if (req.user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.userId }
      });
      if (!student) {
        return res.status(404).json({ success: false, error: "Talaba profili topilmadi" });
      }
      where.studentId = student.id;
    } else {
      if (studentId) where.studentId = studentId;
    }

    if (courseId) where.courseId = courseId;

    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            },
            group: true
          }
        },
        course: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: grades
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/grades - TEACHER & ADMIN
router.post('/', authMiddleware, requireRole('ADMIN', 'TEACHER'), validate(createGradeSchema), async (req, res, next) => {
  try {
    const { studentId, score, subject, courseId } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Talaba topilmadi"
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

    const grade = await prisma.grade.create({
      data: {
        studentId,
        score,
        subject: subject || null,
        courseId: courseId || null
      },
      include: {
        student: {
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
        course: true
      }
    });

    return res.status(201).json({
      success: true,
      data: grade
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/grades/:id - ADMIN, TEACHER or Student's own
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student: {
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
        course: true
      }
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: "Baho topilmadi"
      });
    }

    if (req.user.role === 'STUDENT' && grade.student.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: "Sizga ruxsat yo'q"
      });
    }

    return res.status(200).json({
      success: true,
      data: grade
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/grades/:id - TEACHER & ADMIN
router.patch('/:id', authMiddleware, requireRole('ADMIN', 'TEACHER'), validate(updateGradeSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score, subject, courseId } = req.body;

    const grade = await prisma.grade.findUnique({
      where: { id }
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: "Baho topilmadi"
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

    const updated = await prisma.grade.update({
      where: { id },
      data: {
        ...(score !== undefined && { score }),
        ...(subject !== undefined && { subject: subject || null }),
        ...(courseId !== undefined && { courseId: courseId || null })
      },
      include: {
        student: {
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
        course: true
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

// DELETE /api/grades/:id - ADMIN & TEACHER
router.delete('/:id', authMiddleware, requireRole('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const grade = await prisma.grade.findUnique({
      where: { id }
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: "Baho topilmadi"
      });
    }

    await prisma.grade.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      data: { message: "Baho muvaffaqiyatli o'chirildi" }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
