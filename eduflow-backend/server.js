const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
const groupsRoutes = require('./routes/groups');
const coursesRoutes = require('./routes/courses');
const attendanceRoutes = require('./routes/attendance');
const paymentsRoutes = require('./routes/payments');
const gradesRoutes = require('./routes/grades');
const homeworkRoutes = require('./routes/homework');

// Import middlewares
const errorHandler = require('./middleware/errorHandler');
const { setupSwagger } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger Documentation at /api/docs and /docs
setupSwagger(app);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: "SUCCESS",
    message: "EduFlow API ishlayapti",
    timestamp: new Date().toISOString()
  });
});

// API health endpoint with database check
app.get('/api/health', async (req, res) => {
  try {
    const prisma = require('./lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      success: true,
      status: "SUCCESS",
      message: "EduFlow Backend va PostgreSQL ma'lumotlar bazasi to'liq ulangan va ishlayapti",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      status: "UNSUCCESS",
      message: "Ma'lumotlar bazasiga ulanishda xatolik",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/homework', homeworkRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Marshrut topilmadi: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`EduFlow Backend server ishga tushdi: http://localhost:${PORT}`);
  });
}

module.exports = app;
