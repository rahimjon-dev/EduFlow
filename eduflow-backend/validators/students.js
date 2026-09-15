const { z } = require('zod');

const createStudentSchema = z.object({
  userId: z.string({ required_error: "userId kiritilishi shart" }).min(1, "userId bo'sh bo'lishi mumkin emas"),
  groupId: z.string().optional().nullable()
});

const updateStudentSchema = z.object({
  groupId: z.string().optional().nullable()
});

module.exports = {
  createStudentSchema,
  updateStudentSchema
};
