const { z } = require('zod');

const createHomeworkSchema = z.object({
  title: z.string({ required_error: "Vazifa sarlavhasi kiritilishi shart" }).min(2, "Sarlavha kamida 2 belgidan iborat bo'lishi kerak"),
  description: z.string().optional().nullable(),
  groupId: z.string({ required_error: "groupId kiritilishi shart" }),
  dueDate: z.string().or(z.date(), { required_error: "Muddat (dueDate) kiritilishi shart" })
});

const updateHomeworkSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  dueDate: z.string().or(z.date()).optional()
});

module.exports = {
  createHomeworkSchema,
  updateHomeworkSchema
};
