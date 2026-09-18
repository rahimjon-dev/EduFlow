# EduFlow Mobile — React Native (Expo + TypeScript)

EduFlow — Zamonaviy Taʼlim Boshqaruv Tizimining rasmiy kross-platformali (iOS, Android, Web) mobil ilovasi.

---

## 📱 Asosiy Imkoniyatlar

1. **4 ta Rolga Moslashuvchan Interfeys**:
   - **Bosh Administrator (Admin)**: Talabalar va o'qituvchilar hisobi, faol guruhlar, umumiy davomat va moliyaviy tushumlar nazorati.
   - **O'qituvchi (Teacher)**: Bugungi darslar grafigi, interaktiv talabalar davomati (Bor, Yo'q, Kechikdi, Sababli), yangi vazifalar ochish va topshiriqlarni tekshirish.
   - **Talaba (Student)**: Shaxsiy dars jadvali, baholar daftari (GPA), davomat foizi, uy vazifalari va topshirish.
   - **Ota-ona (Parent)**: Farzandining kunlik davomati, yangi baholari va o'qituvchi izohlari, o'quv shartnoma to'lovlari kvitansiyalari.

2. **Gibrid Arxitektura (Online + Offline Demo)**:
   - `eduflow-backend` (REST API: PostgreSQL + Prisma + JWT) ga to'g'ridan-to'g'ri bog'lanish imkoniyati.
   - Backend o'chiq bo'lgan holatda ham barcha 4 ta rolni to'liq sinovdan o'tkazish uchun 1 bosishda demo tizimga kirish (1-Tap Quick Demo).

3. **Ko'p tilli qo'llab-quvvatlash (i18n)**:
   - O'zbekcha 🇺🇿, Ruscha 🇷🇺, Inglizcha 🇬🇧.

---

## 🚀 Ishga tushirish (Getting Started)

### 1. Paketlarni o'rnatish
```bash
cd mobile
npm install
```

### 2. Mobil ilovani ishga tushirish
- **Barcha platformalar uchun (Expo Dev Server):**
  ```bash
  npm start
  ```
  *Ekranda paydo bo'lgan QR kodni telefoningizdagi **Expo Go** ilovasi orqali skanerlang.*

- **Brauzerda (Web) sinab ko'rish:**
  ```bash
  npm run web
  ```

- **Android emulyatorda:**
  ```bash
  npm run android
  ```

- **iOS simulyatorda:**
  ```bash
  npm run ios
  ```

---

## 🌐 Backend bilan ulash

Mobil telefon kompyuteringizdagi backend bilan bog'lanishi uchun profilingizdagi **"Backend API Serveri"** maydoniga kompyuteringizning mahalliy IP manzilini kiriting:
Masalan:
`http://192.168.1.100:5000/api`

Android emulyator uchun standart manzil:
`http://10.0.2.2:5000/api`
