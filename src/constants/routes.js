import { ROLES } from './roles.js';

/** Single source of truth for paths, so links and redirects cannot drift. */
export const PATHS = Object.freeze({
  home: '/',
  courses: '/courses',
  courseDetail: (id = ':id') => `/courses/${id}`,
  library: '/library',
  login: '/login',
  signup: '/signup',

  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    courses: '/admin/courses',
    books: '/admin/books',
    tutors: '/admin/tutors',
    students: '/admin/students',
    enrollments: '/admin/enrollments',
  },
  tutor: {
    root: '/tutor',
    dashboard: '/tutor/dashboard',
    courses: '/tutor/courses',
    students: '/tutor/students',
  },
  student: {
    root: '/student',
    dashboard: '/student/dashboard',
    courses: '/student/courses',
    library: '/student/library',
  },
});

/** Where a user lands right after signing in. */
export function dashboardPathFor(role) {
  if (role === ROLES.ADMIN) return PATHS.admin.dashboard;
  if (role === ROLES.TUTOR) return PATHS.tutor.dashboard;
  return PATHS.student.dashboard;
}
