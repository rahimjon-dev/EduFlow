const { z } = require('zod');

const createGradeSchema = z.object({
  studentId: z.string({ required_error: "studentId kiritilishi shart" }),
  score: z.number({ required_error: "Baho (score) kiritilishi shart" }).min(0, "Baho 0 dan kam bo'lmasligi kerak").max(100, "Baho 100 dan oshmasligi kerak"),
  subject: z.string().optional().nullable(),
  courseId: z.string().optional().nullable()
});

const updateGradeSchema = z.object({
  score: z.number().min(0, "Baho 0 dan kam bo'lmasligi kerak").max(100, "Baho 100 dan oshmasligi kerak").optional(),
  subject: z.string().optional().nullable(),
  courseId: z.string().optional().nullable()
});

module.exports = {
  createGradeSchema,
  updateGradeSchema
};
