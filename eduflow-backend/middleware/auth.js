const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: "Avtorizatsiya talab qilinadi. Token topilmadi"
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token noto'g'ri ko'rinishda"
      });
    }

    const secret = process.env.JWT_SECRET || 'eduflow_fallback_secret';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: "Token yaroqsiz yoki muddati o'tgan"
      });
    }

    // Attach decoded user
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Avtorizatsiya tekshirishda xatolik yuz berdi"
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: "Foydalanuvchi ma'lumotlari aniqlanmadi"
      });
    }

    // Faqat ADMIN barcha bo'lim va amallarga to'liq o'ta oladi
    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Sizga ruxsat yo'q"
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole
};
