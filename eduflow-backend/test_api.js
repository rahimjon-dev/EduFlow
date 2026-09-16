const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING EDUFLOW API TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. GET /
    const rRoot = await fetch(`${BASE_URL}/`);
    const jRoot = await rRoot.json();
    assert(rRoot.status === 200 && jRoot.message === 'EduFlow API ishlayapti', 'GET / Health Check');

    // 2. POST /api/auth/login (Admin)
    const rAdminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@eduflow.uz', password: 'admin123' })
    });
    const jAdminLogin = await rAdminLogin.json();
    assert(rAdminLogin.status === 200 && jAdminLogin.data.role === 'ADMIN', 'POST /api/auth/login as Admin');
    const adminToken = jAdminLogin.data.token;

    // 3. POST /api/auth/login (Teacher)
    const rTeacherLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teacher1@eduflow.uz', password: 'teacher123' })
    });
    const jTeacherLogin = await rTeacherLogin.json();
    assert(rTeacherLogin.status === 200 && jTeacherLogin.data.role === 'TEACHER', 'POST /api/auth/login as Teacher');
    const teacherToken = jTeacherLogin.data.token;

    // 4. POST /api/auth/login (Student)
    const rStudentLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student1@eduflow.uz', password: 'student123' })
    });
    const jStudentLogin = await rStudentLogin.json();
    assert(rStudentLogin.status === 200 && jStudentLogin.data.role === 'STUDENT', 'POST /api/auth/login as Student');
    const studentToken = jStudentLogin.data.token;

    // 5. POST /api/auth/register (New user)
    const testEmail = `testuser_${Date.now()}@eduflow.uz`;
    const rReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Yangi Foydalanuvchi', email: testEmail, password: 'password123' })
    });
    const jReg = await rReg.json();
    assert(rReg.status === 201 && jReg.data.email === testEmail && !jReg.data.password, 'POST /api/auth/register (no password returned)');

    // 6. GET /api/auth/me
    const rMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jMe = await rMe.json();
    assert(rMe.status === 200 && jMe.data.email === 'admin@eduflow.uz' && !jMe.data.password, 'GET /api/auth/me (authenticated user profile)');

    // 7. GET /api/courses
    const rCourses = await fetch(`${BASE_URL}/api/courses`);
    const jCourses = await rCourses.json();
    assert(rCourses.status === 200 && Array.isArray(jCourses.data) && jCourses.data.length >= 2, 'GET /api/courses');
    const courseId = jCourses.data[0].id;

    // 8. POST /api/courses (Admin)
    const rNewCourse = await fetch(`${BASE_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'Cybersecurity Foundations', price: 1600000 })
    });
    const jNewCourse = await rNewCourse.json();
    assert(rNewCourse.status === 201 && jNewCourse.data.name === 'Cybersecurity Foundations', 'POST /api/courses by Admin');

    // 9. GET /api/groups
    const rGroups = await fetch(`${BASE_URL}/api/groups`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jGroups = await rGroups.json();
    assert(rGroups.status === 200 && Array.isArray(jGroups.data) && jGroups.data.length >= 2, 'GET /api/groups');
    const groupId = jGroups.data[0].id;

    // 10. GET /api/students
    const rStudents = await fetch(`${BASE_URL}/api/students`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jStudents = await rStudents.json();
    assert(rStudents.status === 200 && Array.isArray(jStudents.data) && jStudents.data.length >= 5, 'GET /api/students');
    const studentId = jStudents.data[0].id;

    // 11. GET /api/students/:id
    const rStudentDetail = await fetch(`${BASE_URL}/api/students/${studentId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jStudentDetail = await rStudentDetail.json();
    assert(rStudentDetail.status === 200 && jStudentDetail.data.id === studentId && !jStudentDetail.data.user.password, 'GET /api/students/:id (safe without password)');

    // 12. GET /api/teachers
    const rTeachers = await fetch(`${BASE_URL}/api/teachers`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jTeachers = await rTeachers.json();
    assert(rTeachers.status === 200 && Array.isArray(jTeachers.data) && jTeachers.data.length >= 2, 'GET /api/teachers');

    // 13. GET /api/attendance
    const rAtt = await fetch(`${BASE_URL}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const jAtt = await rAtt.json();
    assert(rAtt.status === 200 && Array.isArray(jAtt.data), 'GET /api/attendance');

    // 14. GET /api/attendance/stats/:studentId
    const rStats = await fetch(`${BASE_URL}/api/attendance/stats/${studentId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jStats = await rStats.json();
    assert(rStats.status === 200 && typeof jStats.data.percentage === 'number', 'GET /api/attendance/stats/:studentId');

    // 15. POST /api/attendance (Teacher)
    const rNewAtt = await fetch(`${BASE_URL}/api/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
      body: JSON.stringify({ studentId, status: 'PRESENT' })
    });
    const jNewAtt = await rNewAtt.json();
    assert(rNewAtt.status === 201 && jNewAtt.data.status === 'PRESENT', 'POST /api/attendance by Teacher');

    // 16. GET /api/payments
    const rPay = await fetch(`${BASE_URL}/api/payments`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jPay = await rPay.json();
    assert(rPay.status === 200 && Array.isArray(jPay.data) && jPay.data.length >= 1, 'GET /api/payments');

    // 17. POST /api/payments (Admin)
    const rNewPay = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ studentId, amount: 800000, status: 'PENDING' })
    });
    const jNewPay = await rNewPay.json();
    assert(rNewPay.status === 201 && jNewPay.data.amount === 800000, 'POST /api/payments by Admin');
    const paymentId = jNewPay.data.id;

    // 18. PATCH /api/payments/:id
    const rPatchPay = await fetch(`${BASE_URL}/api/payments/${paymentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'PAID' })
    });
    const jPatchPay = await rPatchPay.json();
    assert(rPatchPay.status === 200 && jPatchPay.data.status === 'PAID' && jPatchPay.data.paidAt, 'PATCH /api/payments/:id to PAID');

    // 19. GET /api/grades
    const rGrades = await fetch(`${BASE_URL}/api/grades`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jGrades = await rGrades.json();
    assert(rGrades.status === 200 && Array.isArray(jGrades.data), 'GET /api/grades');

    // 20. POST /api/grades (Teacher)
    const rNewGrade = await fetch(`${BASE_URL}/api/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
      body: JSON.stringify({ studentId, score: 95, subject: 'Yakuniy Imtihon', courseId })
    });
    const jNewGrade = await rNewGrade.json();
    assert(rNewGrade.status === 201 && jNewGrade.data.score === 95, 'POST /api/grades by Teacher');

    // 21. GET /api/homework
    const rHw = await fetch(`${BASE_URL}/api/homework`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const jHw = await rHw.json();
    assert(rHw.status === 200 && Array.isArray(jHw.data), 'GET /api/homework');

    // 22. POST /api/homework (Teacher)
    const rNewHw = await fetch(`${BASE_URL}/api/homework`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
      body: JSON.stringify({
        title: 'Algoritmlar va Ma\'lumotlar tuzilmasi',
        description: 'Binary search va Sorting algoritmlari',
        groupId,
        dueDate: new Date(Date.now() + 10 * 86400000).toISOString()
      })
    });
    const jNewHw = await rNewHw.json();
    assert(rNewHw.status === 201 && jNewHw.data.title.includes('Algoritmlar'), 'POST /api/homework by Teacher');

    // 23. RBAC Forbidden check (Student cannot create Course)
    const rForbidden = await fetch(`${BASE_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ name: 'Hacking 101', price: 1000 })
    });
    const jForbidden = await rForbidden.json();
    assert(rForbidden.status === 403 && jForbidden.error === "Sizga ruxsat yo'q", 'RBAC check: Student blocked from Admin route with "Sizga ruxsat yo\'q" (403 Forbidden)');

    // 24. Auth 401 check (No token)
    const rUnauth = await fetch(`${BASE_URL}/api/auth/me`);
    assert(rUnauth.status === 401, 'Auth check: No token request blocked (401 Unauthorized)');

    // 25. Zod 400 Validation check (Invalid grade score > 100)
    const rInvalidGrade = await fetch(`${BASE_URL}/api/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${teacherToken}` },
      body: JSON.stringify({ studentId, score: 150 })
    });
    const jInvalidGrade = await rInvalidGrade.json();
    assert(rInvalidGrade.status === 400 && jInvalidGrade.success === false, 'Zod check: Invalid score > 100 rejected (400 Bad Request)');

    // 26. Student attempting to switch role to ADMIN
    const rStudentSwitchAdmin = await fetch(`${BASE_URL}/api/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ role: 'ADMIN' })
    });
    const jStudentSwitchAdmin = await rStudentSwitchAdmin.json();
    assert(rStudentSwitchAdmin.status === 403 && jStudentSwitchAdmin.error === "Sizga ruxsat yo'q", 'RBAC check: Student cannot switch to ADMIN ("Sizga ruxsat yo\'q")');

    // 27. Student checking access to ADMIN
    const rStudentCheckAdmin = await fetch(`${BASE_URL}/api/auth/check-access/ADMIN`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const jStudentCheckAdmin = await rStudentCheckAdmin.json();
    assert(rStudentCheckAdmin.status === 403 && jStudentCheckAdmin.error === "Sizga ruxsat yo'q", 'RBAC check: Student blocked from check-access/ADMIN ("Sizga ruxsat yo\'q")');

    // 28. Admin can switch role
    const rAdminSwitch = await fetch(`${BASE_URL}/api/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ role: 'STUDENT' })
    });
    const jAdminSwitch = await rAdminSwitch.json();
    assert(rAdminSwitch.status === 200 && jAdminSwitch.success === true && jAdminSwitch.data.role === 'STUDENT', 'RBAC check: Admin can switch roles');

    // 29. Student blocked from viewing teachers list
    const rStudentTeachers = await fetch(`${BASE_URL}/api/teachers`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const jStudentTeachers = await rStudentTeachers.json();
    assert(rStudentTeachers.status === 403 && jStudentTeachers.error === "Sizga ruxsat yo'q", 'RBAC check: Student blocked from GET /api/teachers ("Sizga ruxsat yo\'q")');

    console.log(`\n--- TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test Execution Error:', err);
    process.exit(1);
  }
}

runTests();
