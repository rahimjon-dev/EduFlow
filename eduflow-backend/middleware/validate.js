const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const errorDetails = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return res.status(400).json({
          success: false,
          error: "Validatsiya xatoligi",
          details: errorDetails
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message || "Noto'g'ri so'rov ma'lumotlari"
      });
    }
  };
};

module.exports = validate;
