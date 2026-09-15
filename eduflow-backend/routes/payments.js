const express = require('express');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createPaymentSchema, updatePaymentSchema } = require('../validators/payments');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/payments - ADMIN, TEACHER or Student's own
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { studentId, status } = req.query;
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

    if (status) where.status = status;

    const payments = await prisma.payment.findMany({
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
            group: {
              include: {
                course: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments - ADMIN only
router.post('/', authMiddleware, requireRole('ADMIN'), validate(createPaymentSchema), async (req, res, next) => {
  try {
    const { studentId, amount, status, paidAt } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Talaba topilmadi"
      });
    }

    const currentStatus = status || 'PENDING';
    const effectivePaidAt = currentStatus === 'PAID' ? (paidAt ? new Date(paidAt) : new Date()) : (paidAt ? new Date(paidAt) : null);

    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        status: currentStatus,
        paidAt: effectivePaidAt
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
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/payments/:id - ADMIN only
router.patch('/:id', authMiddleware, requireRole('ADMIN'), validate(updatePaymentSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, status, paidAt } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "To'lov topilmadi"
      });
    }

    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (status) {
      updateData.status = status;
      if (status === 'PAID' && !payment.paidAt && !paidAt) {
        updateData.paidAt = new Date();
      }
    }
    if (paidAt !== undefined) {
      updateData.paidAt = paidAt ? new Date(paidAt) : null;
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: updateData,
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
