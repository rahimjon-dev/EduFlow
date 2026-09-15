const errorHandler = (err, req, res, next) => {
  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', err);
  }

  // Zod Validation Error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: "Validatsiya xatoligi",
      details: err.errors ? err.errors.map(e => ({ field: e.path.join('.'), message: e.message })) : []
    });
  }

  // Prisma Unique Constraint Error (P2002)
  if (err.code === 'P2002') {
    const target = err.meta && err.meta.target ? err.meta.target : 'Maydon';
    return res.status(409).json({
      success: false,
      error: `Bu ${Array.isArray(target) ? target.join(', ') : target} bilan allaqachon ma'lumot mavjud (takroriy qiymat)`
    });
  }

  // Prisma Record Not Found (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: "So'ralgan ma'lumot topilmadi"
    });
  }

  // Custom Application Error with status code
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  return res.status(statusCode).json({
    success: false,
    error: err.message || "Server ichki xatoligi yuz berdi"
  });
};

module.exports = errorHandler;
