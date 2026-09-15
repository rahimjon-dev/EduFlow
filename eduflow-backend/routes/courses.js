const express = require('express');
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const { createCourseSchema, updateCourseSchema } = require('../validators/courses');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses - Public or Authenticated
router.get('/', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        groups: {
          include: {
            teacher: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            },
            _count: {
              select: { students: true }
            }
          }
        },
        _count: {
          select: { groups: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/courses - ADMIN only
router.post('/', authMiddleware, requireRole('ADMIN'), validate(createCourseSchema), async (req, res, next) => {
  try {
    const { name, price } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        price
      }
    });

    return res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
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
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Kurs topilmadi"
      });
    }

    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/courses/:id - ADMIN only
router.patch('/:id', authMiddleware, requireRole('ADMIN'), validate(updateCourseSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Kurs topilmadi"
      });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price })
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

// DELETE /api/courses/:id - ADMIN only
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Kurs topilmadi"
      });
    }

    await prisma.course.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      data: { message: "Kurs muvaffaqiyatli o'chirildi" }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
