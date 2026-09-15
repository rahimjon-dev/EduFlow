const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EduFlow database...');

  // Hash passwords (admin default: login: admin, password: 0603)
  const adminPassword = await bcrypt.hash('0603', 10);
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);
  const parentPassword = await bcrypt.hash('parent123', 10);

  // 1. Create Admin (Login: admin / admin@eduflow.uz, Parol: 0603)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eduflow.uz' },
    update: {
      password: adminPassword,
      role: 'ADMIN'
    },
    create: {
      fullName: 'Bosh Administrator',
      email: 'admin@eduflow.uz',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // 2. Create Teachers
  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@eduflow.uz' },
    update: {},
    create: {
      fullName: 'Anvar Narzullayev',
      email: 'teacher1@eduflow.uz',
      password: teacherPassword,
      role: 'TEACHER'
    }
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@eduflow.uz' },
    update: {},
    create: {
      fullName: 'Sardorbek Boboyev',
      email: 'teacher2@eduflow.uz',
      password: teacherPassword,
      role: 'TEACHER'
    }
  });

  // 3. Create Parent
  const parent = await prisma.user.upsert({
    where: { email: 'parent@eduflow.uz' },
    update: {},
    create: {
      fullName: 'Ziyoda Karimova (Ota-ona)',
      email: 'parent@eduflow.uz',
      password: parentPassword,
      role: 'PARENT'
    }
  });

  // 4. Create Courses
  let course1 = await prisma.course.findFirst({
    where: { name: 'Frontend React & TypeScript' }
  });
  if (!course1) {
    course1 = await prisma.course.create({
      data: {
        name: 'Frontend React & TypeScript',
        price: 1200000
      }
    });
  }

  let course2 = await prisma.course.findFirst({
    where: { name: 'Backend Node.js & PostgreSQL' }
  });
  if (!course2) {
    course2 = await prisma.course.create({
      data: {
        name: 'Backend Node.js & PostgreSQL',
        price: 1400000
      }
    });
  }

  // 5. Create Groups
  let group1 = await prisma.group.findFirst({
    where: { name: 'FE-2026-01' }
  });
  if (!group1) {
    group1 = await prisma.group.create({
      data: {
        name: 'FE-2026-01',
        courseId: course1.id,
        teacherId: teacher1.id
      }
    });
  }

  let group2 = await prisma.group.findFirst({
    where: { name: 'BE-2026-01' }
  });
  if (!group2) {
    group2 = await prisma.group.create({
      data: {
        name: 'BE-2026-01',
        courseId: course2.id,
        teacherId: teacher2.id
      }
    });
  }

  // 6. Create Students
  const studentData = [
    { name: 'Ali Valiyev', email: 'student1@eduflow.uz', group: group1 },
    { name: 'Malika Tosheva', email: 'student2@eduflow.uz', group: group1 },
    { name: 'Jasur Rahimov', email: 'student3@eduflow.uz', group: group2 },
    { name: 'Madina Umarova', email: 'student4@eduflow.uz', group: group2 },
    { name: 'Bobur Rustamov', email: 'student5@eduflow.uz', group: group1 }
  ];

  const createdStudents = [];
  for (const s of studentData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        fullName: s.name,
        email: s.email,
        password: studentPassword,
        role: 'STUDENT'
      }
    });

    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: { groupId: s.group.id },
      create: {
        userId: user.id,
        groupId: s.group.id
      }
    });

    createdStudents.push(student);
  }

  // 7. Create Attendance
  for (const student of createdStudents) {
    const count = await prisma.attendance.count({ where: { studentId: student.id } });
    if (count === 0) {
      await prisma.attendance.createMany({
        data: [
          { studentId: student.id, date: new Date(Date.now() - 3 * 86400000), status: 'PRESENT' },
          { studentId: student.id, date: new Date(Date.now() - 2 * 86400000), status: 'PRESENT' },
          { studentId: student.id, date: new Date(Date.now() - 1 * 86400000), status: 'LATE' },
          { studentId: student.id, date: new Date(), status: 'PRESENT' }
        ]
      });
    }
  }

  // 8. Create Payments
  for (let i = 0; i < createdStudents.length; i++) {
    const student = createdStudents[i];
    const count = await prisma.payment.count({ where: { studentId: student.id } });
    if (count === 0) {
      await prisma.payment.createMany({
        data: [
          {
            studentId: student.id,
            amount: 1200000,
            status: i % 2 === 0 ? 'PAID' : 'PENDING',
            paidAt: i % 2 === 0 ? new Date(Date.now() - 7 * 86400000) : null
          }
        ]
      });
    }
  }

  // 9. Create Grades
  for (let i = 0; i < createdStudents.length; i++) {
    const student = createdStudents[i];
    const count = await prisma.grade.count({ where: { studentId: student.id } });
    if (count === 0) {
      await prisma.grade.createMany({
        data: [
          {
            studentId: student.id,
            courseId: i < 3 ? course1.id : course2.id,
            subject: i < 3 ? 'React asoslari' : 'Node.js & Express',
            score: 80 + (i * 4)
          },
          {
            studentId: student.id,
            courseId: i < 3 ? course1.id : course2.id,
            subject: i < 3 ? 'TypeScript & Tailwind' : 'PostgreSQL & Prisma',
            score: 75 + (i * 5)
          }
        ]
      });
    }
  }

  // 10. Create Homework
  const hwCount1 = await prisma.homework.count({ where: { groupId: group1.id } });
  if (hwCount1 === 0) {
    await prisma.homework.create({
      data: {
        title: 'React Custom Hooks va Context API yaratish',
        description: 'Mavzu bo\'yicha 3 ta custom hook yozing va Context orqali state ulashing.',
        groupId: group1.id,
        dueDate: new Date(Date.now() + 5 * 86400000)
      }
    });
  }

  const hwCount2 = await prisma.homework.count({ where: { groupId: group2.id } });
  if (hwCount2 === 0) {
    await prisma.homework.create({
      data: {
        title: 'Prisma bilan REST API CRUD yaratish',
        description: 'PostgreSQL bazasi bilan to\'liq ishlaydigan CRUD endpointlar tayyorlang.',
        groupId: group2.id,
        dueDate: new Date(Date.now() + 7 * 86400000)
      }
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
