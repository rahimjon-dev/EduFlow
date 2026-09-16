const { z } = require('zod');

const validateRoleEmail = (email, role = 'STUDENT') => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  const atParts = normalized.split('@');
  if (atParts.length !== 2) return false;
  const domain = atParts[1];

  switch (role) {
    case 'ADMIN':
      return domain === 'admin.edu' || domain.endsWith('.admin.edu') || domain === 'admin.eduflow.uz';
    case 'TEACHER':
      return domain === 'oqituvchi.edu' || domain === 'teacher.edu' || domain.endsWith('.teacher.edu') || domain === 'teacher.eduflow.uz';
    case 'STUDENT':
      return domain === 'oquvchi.edu' || domain === 'student.edu' || domain.endsWith('.student.edu') || domain === 'student.eduflow.uz';
    case 'PARENT':
      return domain === 'otaona.edu' || domain === 'parent.edu' || domain.endsWith('.parent.edu') || domain === 'parent.eduflow.uz';
    default:
      return false;
  }
};

const getRoleEmailErrorMessage = (role) => {
  switch (role) {
    case 'ADMIN':
      return "Admin sifatida ro'yxatdan o'tish uchun email @admin.edu domenida bo'lishi shart! (Masalan: admin@admin.edu)";
    case 'TEACHER':
      return "O'qituvchi sifatida ro'yxatdan o'tish uchun email @oqituvchi.edu yoki @teacher.edu domenida bo'lishi shart!";
    case 'STUDENT':
      return "O'quvchi sifatida ro'yxatdan o'tish uchun email @oquvchi.edu yoki @student.edu domenida bo'lishi shart!";
    case 'PARENT':
      return "Ota-ona sifatida ro'yxatdan o'tish uchun email @otaona.edu yoki @parent.edu domenida bo'lishi shart!";
    default:
      return "Kiritilgan email ushbu rol uchun to'g'ri kelmadi";
  }
};

const registerSchema = z.object({
  fullName: z.string({ required_error: "To'liq ism kiritilishi shart" }).min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak"),
  email: z.string({ required_error: "Email kiritilishi shart" }).email("To'g'ri email formatini kiriting"),
  password: z.string({ required_error: "Parol kiritilishi shart" }).min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).default('STUDENT')
}).refine((data) => validateRoleEmail(data.email, data.role), (data) => ({
  message: getRoleEmailErrorMessage(data.role),
  path: ['email']
}));

const loginSchema = z.object({
  email: z.string({ required_error: "Email kiritilishi shart" }).email("To'g'ri email formatini kiriting"),
  password: z.string({ required_error: "Parol kiritilishi shart" }).min(1, "Parol kiritilishi shart"),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  validateRoleEmail,
  getRoleEmailErrorMessage
};

