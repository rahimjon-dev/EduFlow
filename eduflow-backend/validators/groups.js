const { z } = require('zod');

const createGroupSchema = z.object({
  name: z.string({ required_error: "Guruh nomi kiritilishi shart" }).min(2, "Guruh nomi kamida 2 belgidan iborat bo'lishi kerak"),
  courseId: z.string({ required_error: "courseId kiritilishi shart" }),
  teacherId: z.string().optional().nullable()
});

const updateGroupSchema = z.object({
  name: z.string().min(2).optional(),
  courseId: z.string().optional(),
  teacherId: z.string().optional().nullable()
});

module.exports = {
  createGroupSchema,
  updateGroupSchema
};
