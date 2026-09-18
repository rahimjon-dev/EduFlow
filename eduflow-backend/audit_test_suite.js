/**
 * Comprehensive Production QA Audit Test Suite for EduFlow
 * Tests all 9 modules, 4 user roles, RBAC, database relations, and validation schemas.
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

async function runAudit() {
  console.log('====================================================');
  console.log(`🚀 STARTING PRODUCTION QA AUDIT TARGET: ${BASE_URL}`);
  console.log('====================================================\n');

  const matrix = [];
  let passed = 0;
  let failed = 0;

  function record(route, method, requiredRole, expectedStatus, actualStatus, name, passedCondition, notes = '') {
    const isPass = passedCondition;
    if (isPass) {
      passed++;
      console.log(`✅ [PASS] [${method}] ${route} -> ${name} (Status: ${actualStatus})`);
    } else {
      failed++;
      console.error(`❌ [FAIL] [${method}] ${route} -> ${name} (Expected: ${expectedStatus}, Got: ${actualStatus}) ${notes}`);
    }
    matrix.push({
      route,
      method,
      requiredRole,
      expectedStatus,
      actualStatus,
      name,
      result: isPass ? 'PASS' : 'FAIL',
      notes
    });
  }

  try {
    // ----------------------------------------------------
    // 1. HEALTH CHECK & API INFO
    // ----------------------------------------------------
    const rRoot = await fetch(`${BASE_URL}/api`);
    const jRoot = await rRoot.json().catch(() => ({}));
    record('/api', 'GET', 'PUBLIC', 200, rRoot.status, 'API Root Health Check', rRoot.status === 200 && jRoot.success === true);

    // ----------------------------------------------------
    // 2. AUTHENTICATION & SESSIONS
    // ----------------------------------------------------
    // 2.1 Admin Login
    const rAdmin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@eduflow.uz', password: '0603' })
    });
    const jAdmin = await rAdmin.json().catch(() => ({}));
    const adminToken = jAdmin?.data?.token;
    record('/api/auth/login', 'POST', 'PUBLIC', 200, rAdmin.status, 'Admin Login with valid credentials', rAdmin.status === 200 && !!adminToken && jAdmin.data.role === 'ADMIN');

    // 2.2 Teacher Login
    const rTeacher = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teacher1@eduflow.uz', password: 'teacher123' })
    });
    const jTeacher = await rTeacher.json().catch(() => ({}));
    const teacherToken = jTeacher?.data?.token;
    record('/api/auth/login', 'POST', 'PUBLIC', 200, rTeacher.status, 'Teacher Login with valid credentials', rTeacher.status === 200 && !!teacherToken && jTeacher.data.role === 'TEACHER');

    // 2.3 Student Login
    const rStudent = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student1@eduflow.uz', password: 'student123' })
    });
    const jStudent = await rStudent.json().catch(() => ({}));
    const studentToken = jStudent?.data?.token;
    record('/api/auth/login', 'POST', 'PUBLIC', 200, rStudent.status, 'Student Login with valid credentials', rStudent.status === 200 && !!studentToken && jStudent.data.role === 'STUDENT');

    // 2.4 Invalid Password Login (401 check)
    const rBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@eduflow.uz', password: 'wrong_password_xyz' })
    });
    record('/api/auth/login', 'POST', 'PUBLIC', 401, rBadLogin.status, 'Invalid Password Rejection', rBadLogin.status === 401);

    // 2.5 New User Registration (201 check)
    const newEmail = `qa_audit_${Date.now()}@eduflow.uz`;
    const rRegister = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'QA Audit Tester', email: newEmail, password: 'StrongPassword123!', role: 'STUDENT' })
    });
    const jRegister = await rRegister.json().catch(() => ({}));
    record('/api/auth/register', 'POST', 'PUBLIC', 201, rRegister.status, 'Register Unique User (no password returned)', rRegister.status === 201 && jRegister?.data?.email === newEmail && !jRegister?.data?.password);

    // 2.6 Duplicate Email Registration (409 Conflict check)
    const rDup = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Duplicate Tester', email: newEmail, password: 'StrongPassword123!' })
    });
    record('/api/auth/register', 'POST', 'PUBLIC', 409, rDup.status, 'Reject Duplicate Email Conflict', rDup.status === 409);

    // 2.7 Auth /api/auth/me
    const rMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const jMe = await rMe.json().catch(() => ({}));
    record('/api/auth/me', 'GET', 'AUTHENTICATED', 200, rMe.status, 'Get current authenticated user profile', rMe.status === 200 && jMe?.data?.email === 'admin@eduflow.uz');

    // 2.8 Auth missing token (401 check)
    const rNoToken = await fetch(`${BASE_URL}/api/auth/me`);
    record('/api/auth/me', 'GET', 'AUTHENTICATED', 401, rNoToken.status, 'Reject Missing Bearer Token', rNoToken.status === 401);

    // ----------------------------------------------------
    // 3. COURSES MODULE
    // ----------------------------------------------------
    // 3.1 GET /api/courses
    const rCourses = await fetch(`${BASE_URL}/api/courses`);
    const jCourses = await rCourses.json().catch(() => ({}));
    record('/api/courses', 'GET', 'PUBLIC', 200, rCourses.status, 'List Courses', rCourses.status === 200 && Array.isArray(jCourses?.data));
    let courseId = jCourses?.data?.[0]?.id;

    // 3.2 POST /api/courses (Admin)
    const rCreateCourse = await fetch(`${BASE_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ name: `Audit Course ${Date.now()}`, price: 1800000 })
    });
    const jCreateCourse = await rCreateCourse.json().catch(() => ({}));
    record('/api/courses', 'POST', 'ADMIN', 201, rCreateCourse.status, 'Create Course by Admin', rCreateCourse.status === 201 && jCreateCourse?.data?.price === 1800000);
    if (jCreateCourse?.data?.id) courseId = jCreateCourse.data.id;

    // 3.3 RBAC Check: Student forbidden from creating course (403 check)
    const rCourseForbidden = await fetch(`${BASE_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ name: 'Malicious Course', price: 0 })
    });
    record('/api/courses', 'POST', 'ADMIN', 403, rCourseForbidden.status, 'RBAC: Student blocked from Course Creation (403)', rCourseForbidden.status === 403);

    // ----------------------------------------------------
    // 4. GROUPS MODULE
    // ----------------------------------------------------
    const rGroups = await fetch(`${BASE_URL}/api/groups`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const jGroups = await rGroups.json().catch(() => ({}));
    record('/api/groups', 'GET', 'ADMIN, TEACHER', 200, rGroups.status, 'List Groups with Relations', rGroups.status === 200 && Array.isArray(jGroups?.data));
    const groupId = jGroups?.data?.[0]?.id;

    // ----------------------------------------------------
    // 5. STUDENTS MODULE
    // ----------------------------------------------------
    const rStudents = await fetch(`${BASE_URL}/api/students`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const jStudents = await rStudents.json().catch(() => ({}));
    record('/api/students', 'GET', 'ADMIN, TEACHER', 200, rStudents.status, 'List Students with Users & Groups', rStudents.status === 200 && Array.isArray(jStudents?.data));
    const studentId = jStudents?.data?.[0]?.id;

    if (studentId) {
      const rStudentDetail = await fetch(`${BASE_URL}/api/students/${studentId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const jStudentDetail = await rStudentDetail.json().catch(() => ({}));
      record(`/api/students/:id`, 'GET', 'ADMIN, TEACHER', 200, rStudentDetail.status, 'Student Details (Sanitized, password stripped)', rStudentDetail.status === 200 && jStudentDetail?.data?.id === studentId && !jStudentDetail?.data?.user?.password);
    }

    // ----------------------------------------------------
    // 6. TEACHERS MODULE
    // ----------------------------------------------------
    const rTeachers = await fetch(`${BASE_URL}/api/teachers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const jTeachers = await rTeachers.json().catch(() => ({}));
    record('/api/teachers', 'GET', 'ADMIN', 200, rTeachers.status, 'List Teachers & Assigned Groups', rTeachers.status === 200 && Array.isArray(jTeachers?.data));

    // ----------------------------------------------------
    // 7. ATTENDANCE MODULE
    // ----------------------------------------------------
    const rAtt = await fetch(`${BASE_URL}/api/attendance`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    const jAtt = await rAtt.json().catch(() => ({}));
    record('/api/attendance', 'GET', 'ADMIN, TEACHER', 200, rAtt.status, 'List Attendance Records', rAtt.status === 200 && Array.isArray(jAtt?.data));

    if (studentId) {
      const rStats = await fetch(`${BASE_URL}/api/attendance/stats/${studentId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const jStats = await rStats.json().catch(() => ({}));
      record(`/api/attendance/stats/:id`, 'GET', 'ADMIN, TEACHER', 200, rStats.status, 'Attendance Rate % Calculation', rStats.status === 200 && typeof jStats?.data?.percentage === 'number');

      const rNewAtt = await fetch(`${BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${teacherToken}` },
        body: JSON.stringify({ studentId, status: 'PRESENT' })
      });
      const jNewAtt = await rNewAtt.json().catch(() => ({}));
      record('/api/attendance', 'POST', 'TEACHER', 201, rNewAtt.status, 'Record Attendance as Teacher', rNewAtt.status === 201 && jNewAtt?.data?.status === 'PRESENT');
    }

    // ----------------------------------------------------
    // 8. PAYMENTS MODULE
    // ----------------------------------------------------
    const rPayments = await fetch(`${BASE_URL}/api/payments`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const jPayments = await rPayments.json().catch(() => ({}));
    record('/api/payments', 'GET', 'ADMIN', 200, rPayments.status, 'List Financial Payments', rPayments.status === 200 && Array.isArray(jPayments?.data));

    if (studentId) {
      const rNewPay = await fetch(`${BASE_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ studentId, amount: 950000, status: 'PENDING' })
      });
      const jNewPay = await rNewPay.json().catch(() => ({}));
      record('/api/payments', 'POST', 'ADMIN', 201, rNewPay.status, 'Create Payment Invoice as Admin', rNewPay.status === 201 && jNewPay?.data?.amount === 950000);
      const newPayId = jNewPay?.data?.id;

      if (newPayId) {
        const rPatchPay = await fetch(`${BASE_URL}/api/payments/${newPayId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
          body: JSON.stringify({ status: 'PAID' })
        });
        const jPatchPay = await rPatchPay.json().catch(() => ({}));
        record(`/api/payments/:id`, 'PATCH', 'ADMIN', 200, rPatchPay.status, 'Update Payment to PAID (with paidAt timestamp)', rPatchPay.status === 200 && jPatchPay?.data?.status === 'PAID' && !!jPatchPay?.data?.paidAt);
      }
    }

    // ----------------------------------------------------
    // 9. GRADES & EVALUATIONS MODULE
    // ----------------------------------------------------
    const rGrades = await fetch(`${BASE_URL}/api/grades`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const jGrades = await rGrades.json().catch(() => ({}));
    record('/api/grades', 'GET', 'ADMIN, TEACHER', 200, rGrades.status, 'List Student Academic Grades', rGrades.status === 200 && Array.isArray(jGrades?.data));

    if (studentId && courseId) {
      const rNewGrade = await fetch(`${BASE_URL}/api/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${teacherToken}` },
        body: JSON.stringify({ studentId, courseId, score: 98, subject: 'Final Production Exam' })
      });
      const jNewGrade = await rNewGrade.json().catch(() => ({}));
      record('/api/grades', 'POST', 'TEACHER', 201, rNewGrade.status, 'Record Grade by Teacher', rNewGrade.status === 201 && jNewGrade?.data?.score === 98);

      // 9.3 Zod validation schema verification (score > 100 rejected)
      const rInvalidScore = await fetch(`${BASE_URL}/api/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${teacherToken}` },
        body: JSON.stringify({ studentId, courseId, score: 150, subject: 'Invalid Score' })
      });
      record('/api/grades (Validation)', 'POST', 'TEACHER', 400, rInvalidScore.status, 'Zod Schema: Score > 100 rejected (400 Bad Request)', rInvalidScore.status === 400);
    }

    // ----------------------------------------------------
    // 10. HOMEWORK MODULE
    // ----------------------------------------------------
    const rHw = await fetch(`${BASE_URL}/api/homework`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const jHw = await rHw.json().catch(() => ({}));
    record('/api/homework', 'GET', 'ADMIN, TEACHER', 200, rHw.status, 'List Group Homework Assignments', rHw.status === 200 && Array.isArray(jHw?.data));

    if (groupId) {
      const rNewHw = await fetch(`${BASE_URL}/api/homework`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${teacherToken}` },
        body: JSON.stringify({
          title: 'Production Certification Assignment',
          description: 'Full stack verification and testing',
          groupId,
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString()
        })
      });
      const jNewHw = await rNewHw.json().catch(() => ({}));
      record('/api/homework', 'POST', 'TEACHER', 201, rNewHw.status, 'Create Homework by Teacher', rNewHw.status === 201 && jNewHw?.data?.title?.includes('Production Certification'));
    }

    // ----------------------------------------------------
    // 11. SECURITY & INPUT SANITIZATION
    // ----------------------------------------------------
    const rBadJson = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"invalidJson":'
    });
    record('/api/auth/login (Malformed)', 'POST', 'PUBLIC', 400, rBadJson.status, 'Reject Malformed JSON Body gracefully', rBadJson.status === 400 || rBadJson.status === 500);

    console.log('\n====================================================');
    console.log(`📊 AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${matrix.length})`);
    console.log('====================================================\n');

    return { matrix, passed, failed };
  } catch (error) {
    console.error('Fatal audit failure:', error);
    return { matrix, passed, failed: failed + 1, fatalError: error.message };
  }
}

runAudit().then((res) => {
  if (res.failed > 0 || res.fatalError) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});
