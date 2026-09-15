const { z } = require('zod');

const createPaymentSchema = z.object({
  studentId: z.string({ required_error: "studentId kiritilishi shart" }),
  amount: z.number({ required_error: "To'lov summasi kiritilishi shart" }).positive("To'lov summasi musbat bo'lishi kerak"),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
  paidAt: z.string().or(z.date()).optional().nullable()
});

const updatePaymentSchema = z.object({
  amount: z.number().positive("To'lov summasi musbat bo'lishi kerak").optional(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
  paidAt: z.string().or(z.date()).optional().nullable()
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema
};
