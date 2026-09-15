# EduFlow Backend — Production-Ready REST API

EduFlow — Ta'lim muassasalarini boshqarish platformasi uchun ishlab chiqilgan, xavfsiz va to'liq relational PostgreSQL ma'lumotlar bazasiga ulangan REST API backend tizimi.

---

## 🛠 Texnologiyalar Staki

- **Platforma**: Node.js
- **Freymvork**: Express.js
- **Ma'lumotlar bazasi**: PostgreSQL
- **ORM**: Prisma ORM
- **Autentifikatsiya**: JWT (JSON Web Tokens) & bcryptjs
- **Validatsiya**: Zod
- **Xavfsizlik**: CORS, role-based authorization (RBAC), dotenv

---

## 📁 Loyiha Strukturasi

```text
eduflow-backend/
│
├── prisma/
│   ├── schema.prisma       # To'liq Prisma ma'lumotlar modeli
│   └── seed.js             # Real demo ma'lumotlar
│
├── routes/
│   ├── auth.js             # Autentifikatsiya (Register, Login, Me)
│   ├── students.js         # Talabalar boshqaruvi
│   ├── teachers.js         # O'qituvchilar boshqaruvi
│   ├── groups.js           # Guruhlar boshqaruvi
│   ├── courses.js          # Kurslar boshqaruvi
│   ├── attendance.js       # Davomat va foizlar
│   ├── payments.js         # To'lovlar boshqaruvi
│   ├── grades.js           # Baholash tizimi (0-100)
│   └── homework.js         # Uy vazifalari
│
├── middleware/
│   ├── auth.js             # JWT va Role tekshiruvi (requireRole)
│   ├── errorHandler.js     # Markazlashtirilgan xatoliklar tutuvchisi
│   └── validate.js         # Zod validatsiya middleware'i
│
├── validators/
│   ├── auth.js             # Auth Zod sxemalari
│   ├── students.js         # Talaba Zod sxemalari
│   ├── teachers.js         # O'qituvchi Zod sxemalari
│   ├── groups.js           # Guruh Zod sxemalari
│   ├── courses.js          # Kurs Zod sxemalari
│   ├── attendance.js       # Davomat Zod sxemalari
│   ├── payments.js         # To'lov Zod sxemalari
│   ├── grades.js           # Baho Zod sxemalari
│   └── homework.js         # Vazifa Zod sxemalari
│
├── lib/
│   └── prisma.js           # PrismaClient yagona instansi
│
├── server.js               # Express asosiy server
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 O'rnatish va Ishga Tushirish

### 1. Dependencies o'rnatish
```bash
cd eduflow-backend
npm install
```

### 2. Muhit o'zgaruvchilari (.env)
`.env` faylida PostgreSQL ulanishi va maxfiy kalitlarni sozlang:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eduflow?schema=public"
JWT_SECRET="eduflow_super_secret_jwt_key_2026_change_in_production_min_32_chars!"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

> **Eslatma:** `JWT_SECRET` har doim xavfsiz va tasodifiy uzun matn bo'lishi lozim.

### 3. Ma'lumotlar bazasi migratsiyasi va Seed
```bash
# Prisma klientini generatsiya qilish
npx prisma generate

# Migratsiyani amalga oshirish
npx prisma migrate dev --name init

# Demo ma'lumotlarni bazaga yozish
npm run prisma:seed
```

### 4. Serverni ishga tushirish
```bash
# Rivojlanish rejimida (nodemon bilan avtomatik qayta yuklanish)
npm run dev

# Oddiy ishga tushirish
npm start
```
Server `http://localhost:5000` manzilida ishga tushadi.

---

## 👥 Demo Hisoblar (Development)

| Rol | Email | Parol | Ruxsatlar |
|---|---|---|---|
| **ADMIN** | `admin@eduflow.uz` | `admin123` | Barcha resurslarni to'liq boshqarish |
| **TEACHER** | `teacher1@eduflow.uz` | `teacher123` | Darslar, guruhlar, davomat, baholar, vazifalar |
| **TEACHER** | `teacher2@eduflow.uz` | `teacher123` | Darslar, guruhlar, davomat, baholar, vazifalar |
| **STUDENT** | `student1@eduflow.uz` | `student123` | O'z guruhi, dars jadvali, baholari, to'lovlari |
| **PARENT** | `parent@eduflow.uz` | `parent123` | Farzandining statistikasi va to'lovlari |

---

## 📡 API Endpoints

### 🔐 AUTH
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `POST` | `/api/auth/register` | Yangi foydalanuvchi ro'yxatdan o'tkazish | Ochiq |
| `POST` | `/api/auth/login` | Tizimga kirish va JWT token olish | Ochiq |
| `GET` | `/api/auth/me` | Joriy profil ma'lumotlarini olish | Auth |

### 👨‍🎓 STUDENTS
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/students` | Barcha talabalar ro'yxati | ADMIN, TEACHER |
| `POST` | `/api/students` | Yangi talaba yaratish | ADMIN |
| `GET` | `/api/students/:id` | Bitta talaba profili va statistikasi | ADMIN, TEACHER, O'zi |
| `PATCH` | `/api/students/:id` | Talaba ma'lumotlarini tahrirlash | ADMIN |
| `DELETE` | `/api/students/:id` | Talabani o'chirish | ADMIN |

### 👨‍🏫 TEACHERS
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/teachers` | Barcha o'qituvchilar ro'yxati | Auth |
| `POST` | `/api/teachers` | Yangi o'qituvchi qo'shish | ADMIN |
| `GET` | `/api/teachers/:id` | O'qituvchi profili va dars guruhlari | Auth |
| `PATCH` | `/api/teachers/:id` | O'qituvchini tahrirlash | ADMIN |
| `DELETE` | `/api/teachers/:id` | O'qituvchini o'chirish | ADMIN |

### 📚 COURSES
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/courses` | Barcha kurslar ro'yxati | Ochiq / Auth |
| `POST` | `/api/courses` | Yangi kurs yaratish | ADMIN |
| `GET` | `/api/courses/:id` | Kurs ma'lumotlari | Ochiq / Auth |
| `PATCH` | `/api/courses/:id` | Kursni tahrirlash | ADMIN |
| `DELETE` | `/api/courses/:id` | Kursni o'chirish | ADMIN |

### 👥 GROUPS
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/groups` | Barcha guruhlar ro'yxati | Auth |
| `POST` | `/api/groups` | Yangi guruh ochish | ADMIN |
| `GET` | `/api/groups/:id` | Guruh ma'lumotlari va talabalar | Auth |
| `PATCH` | `/api/groups/:id` | Guruhni tahrirlash | ADMIN |
| `DELETE` | `/api/groups/:id` | Guruhni o'chirish | ADMIN |

### 📅 ATTENDANCE
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/attendance` | Davomat ro'yxati | Auth |
| `POST` | `/api/attendance` | Davomat belgilash | ADMIN, TEACHER |
| `PATCH` | `/api/attendance/:id` | Davomatni yangilash | ADMIN, TEACHER |
| `GET` | `/api/attendance/stats/:studentId` | Talabaning davomat foizi va statistikasi | ADMIN, TEACHER, O'zi |

### 💳 PAYMENTS
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/payments` | Barcha to'lovlar | Auth |
| `POST` | `/api/payments` | Yangi to'lov yozuvi kiritish | ADMIN |
| `PATCH` | `/api/payments/:id` | To'lov statusini o'zgartirish (PAID, etc) | ADMIN |

### 📊 GRADES
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/grades` | Baholar ro'yxati | Auth |
| `POST` | `/api/grades` | Baho qo'yish (0-100) | ADMIN, TEACHER |
| `GET` | `/api/grades/:id` | Bitta baho ma'lumoti | Auth |
| `PATCH` | `/api/grades/:id` | Bahoni tahrirlash | ADMIN, TEACHER |
| `DELETE` | `/api/grades/:id` | Bahoni o'chirish | ADMIN, TEACHER |

### 📝 HOMEWORK
| Metod | Endpoint | Tavsif | Ruxsat |
|---|---|---|---|
| `GET` | `/api/homework` | Uy vazifalari | Auth |
| `POST` | `/api/homework` | Yangi vazifa yuklash | ADMIN, TEACHER |
| `GET` | `/api/homework/:id` | Vazifa tafsilotlari | Auth |
| `PATCH` | `/api/homework/:id` | Vazifani yangilash | ADMIN, TEACHER |
| `DELETE` | `/api/homework/:id` | Vazifani o'chirish | ADMIN, TEACHER |

---

## 💻 Frontend Integratsiyasi

Frontenddan so'rov yuborishda bazaviy URL:
```text
http://localhost:5000/api
```

### Autentifikatsiyalangan so'rov namunasi:
```javascript
const response = await fetch('http://localhost:5000/api/courses', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
const result = await response.json();
console.log(result.data);
```

### Standart Response Formati:
Muvaffaqiyatli so'rov:
```json
{
  "success": true,
  "data": { ... }
}
```

Xatolik holatida:
```json
{
  "success": false,
  "error": "Xatolik tavsifi",
  "details": []
}
```
