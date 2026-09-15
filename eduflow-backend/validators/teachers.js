const { z } = require('zod');

const createTeacherSchema = z.object({
  fullName: z.string({ required_error: "To'liq ism kiritilishi shart" }).min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak"),
  email: z.string({ required_error: "Email kiritilishi shart" }).email("To'g'ri email formatini kiriting"),
  password: z.string({ required_error: "Parol kiritilishi shart" }).min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
});

const updateTeacherSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
});

module.exports = {
  createTeacherSchema,
  updateTeacherSchema
};
