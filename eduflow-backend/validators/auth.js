const { z } = require('zod');

const registerSchema = z.object({
  fullName: z.string({ required_error: "To'liq ism kiritilishi shart" }).min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak"),
  email: z.string({ required_error: "Email kiritilishi shart" }).email("To'g'ri email formatini kiriting"),
  password: z.string({ required_error: "Parol kiritilishi shart" }).min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional()
});

const loginSchema = z.object({
  email: z.string({ required_error: "Email yoki login kiritilishi shart" }).min(1, "Email yoki login kiritilishi shart"),
  password: z.string({ required_error: "Parol kiritilishi shart" }).min(1, "Parol kiritilishi shart")
});

module.exports = {
  registerSchema,
  loginSchema
};
