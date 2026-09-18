const prisma = require('./prisma');
const { seedDatabase } = require('../prisma/seed');

let isDbConnected = false;

async function autoInitDb() {
  try {
    // 1. Test database connection
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    console.log('✅ [Database] PostgreSQL ma\'lumotlar bazasiga muvaffaqiyatli ulandi.');

    // 2. Check if database has users
    try {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        console.log('🌱 [Database] Bo\'sh ma\'lumotlar bazasi aniqlandi. Dastlabki demo ma\'lumotlar yuklanmoqda...');
        await seedDatabase();
        console.log('🎉 [Database] Demo ma\'lumotlar muvaffaqiyatli to\'ldirildi.');
      } else {
        console.log(`ℹ️ [Database] Mavjud ma'lumotlar bazasi faol (${userCount} ta foydalanuvchi).`);
      }
    } catch (tblErr) {
      console.warn('⚠️ [Database] Jadvallar hali yaratilmagan bo\'lishi mumkin:', tblErr.message);
    }
  } catch (error) {
    isDbConnected = false;
    console.warn('⚠️ [Database] PostgreSQL bilan aloqa mavjud emas:', error.message);
    console.warn('ℹ️ [Database] Server API va Frontend rejimida ishlashda davom etadi. PostgreSQL ulanishini .env yoki Render muhitida sozlang.');
  }
}

function getDbStatus() {
  return isDbConnected;
}

module.exports = {
  autoInitDb,
  getDbStatus
};
