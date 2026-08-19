/**
 * Fills an empty database with demo data so a fresh clone has something to
 * show. Destructive: it clears every collection first.
 *
 *   npm run seed
 */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { COURSE_LEVELS, ENROLLMENT_STATUS, ROLES } from '../config/constants.js';
import { Book, Course, Enrollment, Student, Tutor, User } from '../models/index.js';
import { hashPassword } from '../utils/password.js';

const DEMO_PASSWORD = 'Password123';

const TUTORS = [
  {
    fullName: 'Dilnoza Rahimova',
    email: 'dilnoza@itcenter.uz',
    specialization: 'Frontend Development',
    experienceYears: 6,
    bio: 'Teaches React and modern JavaScript. Previously a product engineer at a fintech startup.',
  },
  {
    fullName: 'Javohir Karimov',
    email: 'javohir@itcenter.uz',
    specialization: 'Backend Development',
    experienceYears: 8,
    bio: 'Node.js and databases. Runs the backend track and mentors the graduation projects.',
  },
  {
    fullName: 'Nilufar Tosheva',
    email: 'nilufar@itcenter.uz',
    specialization: 'UI/UX Design',
    experienceYears: 5,
    bio: 'Design systems, prototyping and user research.',
  },
];

const STUDENTS = [
  { fullName: 'Aziz Yusupov', email: 'aziz@example.com', group: 'Frontend-24A' },
  { fullName: 'Malika Sobirova', email: 'malika@example.com', group: 'Frontend-24A' },
  { fullName: 'Bekzod Tursunov', email: 'bekzod@example.com', group: 'Backend-24B' },
  { fullName: 'Zilola Ergasheva', email: 'zilola@example.com', group: 'Design-24C' },
  { fullName: 'Sardor Nazarov', email: 'sardor@example.com', group: 'Backend-24B' },
];

const COURSES = [
  {
    title: 'React va Zamonaviy Frontend',
    description:
      'Komponentlar, hooklar, holat boshqaruvi va real loyihalar orqali React asoslaridan production darajasigacha.',
    category: 'Frontend',
    level: COURSE_LEVELS.INTERMEDIATE,
    price: 1_800_000,
    durationWeeks: 12,
    capacity: 25,
    tutorIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'JavaScript Asoslari',
    description:
      'Dasturlashni noldan boshlaydiganlar uchun: sintaksis, DOM, asinxron kod va birinchi loyihangiz.',
    category: 'Frontend',
    level: COURSE_LEVELS.BEGINNER,
    price: 1_200_000,
    durationWeeks: 8,
    capacity: 30,
    tutorIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Node.js va REST API',
    description:
      'Express, MongoDB va autentifikatsiya bilan ishonchli backend xizmatlarini loyihalash va yozish.',
    category: 'Backend',
    level: COURSE_LEVELS.INTERMEDIATE,
    price: 2_000_000,
    durationWeeks: 12,
    capacity: 20,
    tutorIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: "Ma'lumotlar Bazasi Dizayni",
    description:
      'Relyatsion va hujjatli bazalar, indekslar, normalizatsiya va so‘rovlarni optimallashtirish.',
    category: 'Backend',
    level: COURSE_LEVELS.ADVANCED,
    price: 2_200_000,
    durationWeeks: 10,
    capacity: 18,
    tutorIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'UI/UX Dizayn Amaliyoti',
    description:
      'Figma, dizayn tizimlari, prototiplash va foydalanuvchi tadqiqoti — portfolio bilan yakunlanadi.',
    category: 'Design',
    level: COURSE_LEVELS.BEGINNER,
    price: 1_500_000,
    durationWeeks: 10,
    capacity: 22,
    tutorIndex: 2,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
  },
];

const BOOKS = [
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    category: 'Frontend',
    publishedYear: 2018,
    description: 'JavaScript tilining chuqur va amaliy qo‘llanmasi, mashqlar va loyihalar bilan.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'You Do not Know JS Yet',
    author: 'Kyle Simpson',
    category: 'Frontend',
    publishedYear: 2020,
    description: 'Tilning ichki mexanizmlari: scope, closure, prototiplar va turlar tizimi.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Backend',
    publishedYear: 2017,
    description: 'Katta hajmdagi maʼlumotlar bilan ishlaydigan tizimlarni loyihalash bo‘yicha asosiy manba.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    category: 'Engineering',
    publishedYear: 2018,
    description: 'Mavjud kodni xatti-harakatini o‘zgartirmasdan yaxshilash usullari katalogi.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Refactoring UI',
    author: 'Adam Wathan & Steve Schoger',
    category: 'Design',
    publishedYear: 2018,
    description: 'Dasturchilar uchun amaliy interfeys dizayni maslahatlari.',
    imageUrl: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=800&q=80',
  },
];

async function seed() {
  await connectDatabase();
  console.info('[seed] Connected. Clearing existing data…');

  await Promise.all([
    Enrollment.deleteMany({}),
    Course.deleteMany({}),
    Book.deleteMany({}),
    Tutor.deleteMany({}),
    Student.deleteMany({}),
    User.deleteMany({}),
  ]);

  const password = await hashPassword(DEMO_PASSWORD);

  const admin = await User.create({
    fullName: 'Abbosbek Sulaymonov',
    email: 'admin@itcenter.uz',
    password,
    role: ROLES.ADMIN,
  });

  const tutorDocs = [];
  for (const tutor of TUTORS) {
    const user = await User.create({
      fullName: tutor.fullName,
      email: tutor.email,
      password,
      role: ROLES.TUTOR,
    });
    tutorDocs.push(
      await Tutor.create({
        user: user._id,
        specialization: tutor.specialization,
        experienceYears: tutor.experienceYears,
        bio: tutor.bio,
      }),
    );
  }

  const studentDocs = [];
  for (const student of STUDENTS) {
    const user = await User.create({
      fullName: student.fullName,
      email: student.email,
      password,
      role: ROLES.STUDENT,
    });
    studentDocs.push(await Student.create({ user: user._id, group: student.group }));
  }

  const courseDocs = await Course.create(
    COURSES.map(({ tutorIndex, ...course }) => ({ ...course, tutor: tutorDocs[tutorIndex]._id })),
  );

  await Book.create(BOOKS);

  // Give each student a couple of places so the dashboards are not empty.
  const statuses = [ENROLLMENT_STATUS.ACTIVE, ENROLLMENT_STATUS.PENDING, ENROLLMENT_STATUS.COMPLETED];
  const enrollments = [];
  studentDocs.forEach((student, studentIndex) => {
    for (let offset = 0; offset < 2; offset += 1) {
      const course = courseDocs[(studentIndex + offset) % courseDocs.length];
      const status = statuses[(studentIndex + offset) % statuses.length];
      enrollments.push({
        student: student._id,
        course: course._id,
        status,
        progress: status === ENROLLMENT_STATUS.COMPLETED ? 100 : (studentIndex + offset) * 15,
        completedAt: status === ENROLLMENT_STATUS.COMPLETED ? new Date() : null,
      });
    }
  });
  await Enrollment.create(enrollments);

  console.info('[seed] Done.');
  console.info(`[seed]   ${tutorDocs.length} tutors, ${studentDocs.length} students`);
  console.info(
    `[seed]   ${courseDocs.length} courses, ${BOOKS.length} books, ${enrollments.length} enrollments`,
  );
  console.info('[seed] Demo accounts — all use the password %s', DEMO_PASSWORD);
  console.info(`[seed]   admin    ${admin.email}`);
  console.info(`[seed]   tutor    ${TUTORS[0].email}`);
  console.info(`[seed]   student  ${STUDENTS[0].email}`);
}

seed()
  .catch((error) => {
    console.error('[seed] Failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
