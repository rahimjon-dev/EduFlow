const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'EduFlow Modern REST API',
    version: '1.0.0',
    description: "EduFlow ta'lim boshqaruv tizimi backend API hujjati va interaktiv sinov paneli. Barcha 4 ta rol (ADMIN, TEACHER, STUDENT, PARENT) uchun to'liq RBAC (Role-Based Access Control) tizimi joriy etilgan.",
    contact: {
      name: 'EduFlow Team',
      email: 'admin@eduflow.uz'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Mahalliy ishlab chiqish serveri (Local Dev Server)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: "Tizimga kirgandan so'ng olingan JWT tokenni kiriting (masalan: eyJhbGciOi...)"
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Xatolik xabari' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string', example: 'Bosh Administrator' },
          email: { type: 'string', example: 'admin@eduflow.uz' },
          role: { type: 'string', enum: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], example: 'ADMIN' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin', description: "Admin uchun 'admin' yoki 'admin@eduflow.uz', boshqalar uchun email" },
          password: { type: 'string', example: '0603', description: "Admin uchun '0603', boshqalar uchun o'z paroli" }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
              role: { type: 'string', example: 'ADMIN' },
              user: { $ref: '#/components/schemas/User' }
            }
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['fullName', 'email', 'password'],
        properties: {
          fullName: { type: 'string', example: 'Ali Valiyev' },
          email: { type: 'string', example: 'ali@eduflow.uz' },
          password: { type: 'string', example: 'parol123' },
          role: { type: 'string', enum: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], default: 'STUDENT' }
        }
      }
    }
  },
  paths: {
    '/api/health': {
      get: {
        summary: "Server va Ma'lumotlar bazasi holatini tekshirish",
        tags: ['Tizim / Health'],
        responses: {
          200: {
            description: "Server va DB to'liq ishlamoqda"
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Tizimga kirish (Login - Barcha rollar uchun)',
        description: "Admin kirishi uchun: login: <b>admin</b> yoki <b>admin@eduflow.uz</b>, parol: <b>0603</b>.<br/>O'qituvchi: teacher1@eduflow.uz / teacher123<br/>Talaba: student1@eduflow.uz / student123<br/>Ota-ona: parent@eduflow.uz / parent123",
        tags: ['Autentifikatsiya'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Muvaffaqiyatli kirildi va individual JWT token qaytarildi',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          401: {
            description: "Email yoki parol noto'g'ri",
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        summary: "Yangi foydalanuvchi ro'yxatdan o'tkazish",
        tags: ['Autentifikatsiya'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: { description: "Foydalanuvchi yaratildi" }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: "Joriy foydalanuvchi profilini olish",
        tags: ['Autentifikatsiya'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Foydalanuvchi profili' },
          401: { description: 'Avtorizatsiyadan o‘tilmagan' }
        }
      }
    },
    '/api/students': {
      get: {
        summary: "Barcha talabalar ro'yxati (Faqat ADMIN va TEACHER)",
        tags: ['Talabalar (Students)'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'groupId', schema: { type: 'string' }, description: 'Guruh ID bo‘yicha filter' }
        ],
        responses: {
          200: { description: "Talabalar ro'yxati" },
          403: { description: "Taqiqlangan (Student va Parent kira olmaydi)" }
        }
      },
      post: {
        summary: "Yangi talaba qo'shish (Faqat ADMIN)",
        tags: ['Talabalar (Students)'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  userId: { type: 'string', format: 'uuid' },
                  groupId: { type: 'string', format: 'uuid' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Talaba yaratildi" },
          403: { description: "Faqat Admin yarata oladi" }
        }
      }
    },
    '/api/students/{id}': {
      get: {
        summary: "Talaba profili va uning davomati, baholari, to'lovlari (ADMIN, TEACHER yoki o'sha Talaba o'zi)",
        tags: ['Talabalar (Students)'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: "Talaba to'liq ma'lumotlari" },
          403: { description: "Boshqa talaba ko'ra olmaydi" }
        }
      },
      patch: {
        summary: "Talabani tahrirlash (guruhini o'zgartirish) (Faqat ADMIN)",
        tags: ['Talabalar (Students)'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  groupId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Yangilandi" }
        }
      },
      delete: {
        summary: "Talabani o'chirish (Faqat ADMIN)",
        tags: ['Talabalar (Students)'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: "O'chirildi" }
        }
      }
    },
    '/api/teachers': {
      get: {
        summary: "Barcha o'qituvchilar ro'yxati (Avtorizatsiyadan o'tganlar)",
        tags: ["O'qituvchilar (Teachers)"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "O'qituvchilar ro'yxati" }
        }
      },
      post: {
        summary: "Yangi o'qituvchi qo'shish (Faqat ADMIN)",
        tags: ["O'qituvchilar (Teachers)"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'password'],
                properties: {
                  fullName: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "O'qituvchi yaratildi" },
          403: { description: "Faqat Admin yarata oladi" }
        }
      }
    },
    '/api/courses': {
      get: {
        summary: "Barcha kurslar ro'yxati",
        tags: ['Kurslar (Courses)'],
        responses: { 200: { description: "Kurslar ro'yxati" } }
      },
      post: {
        summary: "Yangi kurs yaratish (Faqat ADMIN)",
        tags: ['Kurslar (Courses)'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                  name: { type: 'string', example: 'Frontend React' },
                  price: { type: 'number', example: 1200000 }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Kurs yaratildi" } }
      }
    },
    '/api/groups': {
      get: {
        summary: "Barcha guruhlar ro'yxati",
        tags: ['Guruhlar (Groups)'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Guruhlar ro'yxati" } }
      },
      post: {
        summary: "Yangi guruh ochish (Faqat ADMIN)",
        tags: ['Guruhlar (Groups)'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'courseId'],
                properties: {
                  name: { type: 'string', example: 'FE-2026-01' },
                  courseId: { type: 'string', format: 'uuid' },
                  teacherId: { type: 'string', format: 'uuid' }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Guruh yaratildi" } }
      }
    },
    '/api/attendance': {
      get: {
        summary: "Davomat yozuvlari (O'qituvchi va Admin barchasini, Talaba faqat o'zini)",
        tags: ['Davomat (Attendance)'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Davomat ro'yxati" } }
      },
      post: {
        summary: "Davomat belgilash (Faqat ADMIN va TEACHER)",
        tags: ['Davomat (Attendance)'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['studentId', 'status'],
                properties: {
                  studentId: { type: 'string', format: 'uuid' },
                  status: { type: 'string', enum: ['PRESENT', 'ABSENT', 'LATE'] },
                  date: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Davomat saqlandi" } }
      }
    },
    '/api/payments': {
      get: {
        summary: "To'lovlar ro'yxati (Admin va O'qituvchi barchasini, Talaba/Ota-ona faqat o'zini)",
        tags: ["To'lovlar (Payments)"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "To'lovlar ro'yxati" } }
      },
      post: {
        summary: "To'lov kiritish (Faqat ADMIN)",
        tags: ["To'lovlar (Payments)"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['studentId', 'amount'],
                properties: {
                  studentId: { type: 'string', format: 'uuid' },
                  amount: { type: 'number', example: 1200000 },
                  status: { type: 'string', enum: ['PENDING', 'PAID', 'CANCELLED'] },
                  paidAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: { 201: { description: "To'lov yaratildi" } }
      }
    },
    '/api/grades': {
      get: {
        summary: "Baholar ro'yxati (Student faqat o'zinikini ko'radi)",
        tags: ['Baholar (Grades)'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Baholar" } }
      },
      post: {
        summary: "Baho qo'yish (Faqat ADMIN va TEACHER)",
        tags: ['Baholar (Grades)'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['studentId', 'score'],
                properties: {
                  studentId: { type: 'string', format: 'uuid' },
                  courseId: { type: 'string', format: 'uuid' },
                  subject: { type: 'string', example: 'JavaScript imtihoni' },
                  score: { type: 'number', example: 95 }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Baho qo'yildi" } }
      }
    },
    '/api/homework': {
      get: {
        summary: "Uy vazifalari ro'yxati",
        tags: ['Uy vazifalari (Homework)'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Uy vazifalari" } }
      },
      post: {
        summary: "Vazifa yuklash (Faqat ADMIN va TEACHER)",
        tags: ['Uy vazifalari (Homework)'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'groupId', 'dueDate'],
                properties: {
                  title: { type: 'string', example: 'TypeScript amaliyoti' },
                  description: { type: 'string', example: 'Interfeyslar va Genericlar yaratish' },
                  groupId: { type: 'string', format: 'uuid' },
                  dueDate: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Vazifa yaratildi" } }
      }
    }
  }
};

const setupSwagger = (app) => {
  const options = {
    customCss: '.swagger-ui .topbar { background-color: #4f46e5; } .swagger-ui .topbar .topbar-wrapper a span { color: #fff; font-weight: bold; font-size: 1.2rem; }',
    customSiteTitle: 'EduFlow API Hujjatlari (Swagger)'
  };
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
};

module.exports = { setupSwagger, swaggerDocument };
