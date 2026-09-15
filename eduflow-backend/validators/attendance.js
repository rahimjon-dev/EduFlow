const { z } = require('zod');

const createAttendanceSchema = z.object({
  studentId: z.string({ required_error: "studentId kiritilishi shart" }),
  date: z.string().or(z.date()).optional(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE'], {
    errorMap: () => ({ message: "Status PRESENT, ABSENT yoki LATE bo'lishi kerak" })
  })
});

const updateAttendanceSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']).optional(),
  date: z.string().or(z.date()).optional()
});

module.exports = {
  createAttendanceSchema,
  updateAttendanceSchema
};
