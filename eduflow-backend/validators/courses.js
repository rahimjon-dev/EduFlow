const { z } = require('zod');

const createCourseSchema = z.object({
  name: z.string({ required_error: "Kurs nomi kiritilishi shart" }).min(2, "Kurs nomi kamida 2 belgidan iborat bo'lishi kerak"),
  price: z.number({ required_error: "Kurs narxi kiritilishi shart" }).min(0, "Kurs narxi musbat bo'lishi kerak")
});

const updateCourseSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().min(0).optional()
});

module.exports = {
  createCourseSchema,
  updateCourseSchema
};
