const express = require('express');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createAttendanceSchema, updateAttendanceSchema } = require('../validators/attendance');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/attendance - TEACHER, ADMIN or Student's own
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { studentId, groupId, date } = req.query;
    const where = {};

    // If STUDENT, only allow seeing their own attendance
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
      if (groupId) {
        where.student = { groupId };
      }
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.date = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    const records = await prisma.attendance.findMany({
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
        }
      },
      orderBy: { date: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/attendance/stats/:studentId - Calculate percentage and counts
router.get('/stats/:studentId', authMiddleware, async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Talaba topilmadi"
      });
    }

    // Role check: Student can only view their own stats
    if (req.user.role === 'STUDENT' && student.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: "Sizga ruxsat yo'q"
      });
    }

    const records = await prisma.attendance.findMany({
      where: { studentId }
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'PRESENT').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const late = records.filter(r => r.status === 'LATE').length;

    // Standard attendance percentage: (present + 0.5 * late) / total * 100 or present / total
    const percentage = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

    return res.status(200).json({
      success: true,
      data: {
        total,
        present,
        absent,
        late,
        percentage
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/attendance - TEACHER & ADMIN
router.post('/', authMiddleware, requireRole('ADMIN', 'TEACHER'), validate(createAttendanceSchema), async (req, res, next) => {
  try {
    const { studentId, date, status } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Talaba topilmadi"
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        date: date ? new Date(date) : new Date(),
        status
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
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/attendance/:id - TEACHER & ADMIN
router.patch('/:id', authMiddleware, requireRole('ADMIN', 'TEACHER'), validate(updateAttendanceSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, date } = req.body;

    const existing = await prisma.attendance.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Davomat yozuvi topilmadi"
      });
    }

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(date && { date: new Date(date) })
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

module.exports = router;
