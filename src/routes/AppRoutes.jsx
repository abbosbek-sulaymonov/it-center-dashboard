import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { ROLES } from '@/constants/roles.js';
import { PATHS } from '@/constants/routes.js';
import { DashboardLayout } from '@/layouts/DashboardLayout.jsx';
import { PublicLayout } from '@/layouts/PublicLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

// Each role's screens land in their own chunk, so a student never downloads
// the admin tables.
const LandingPage = lazy(() => import('@/pages/public/LandingPage.jsx'));
const CourseCatalogPage = lazy(() => import('@/pages/public/CourseCatalogPage.jsx'));
const CourseDetailPage = lazy(() => import('@/pages/public/CourseDetailPage.jsx'));
const BookCatalogPage = lazy(() => import('@/pages/public/BookCatalogPage.jsx'));
const LoginPage = lazy(() => import('@/pages/public/LoginPage.jsx'));
const SignupPage = lazy(() => import('@/pages/public/SignupPage.jsx'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage.jsx'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage.jsx'));
const AdminCoursesPage = lazy(() => import('@/pages/admin/AdminCoursesPage.jsx'));
const AdminBooksPage = lazy(() => import('@/pages/admin/AdminBooksPage.jsx'));
const AdminTutorsPage = lazy(() => import('@/pages/admin/AdminTutorsPage.jsx'));
const AdminStudentsPage = lazy(() => import('@/pages/admin/AdminStudentsPage.jsx'));
const AdminEnrollmentsPage = lazy(() => import('@/pages/admin/AdminEnrollmentsPage.jsx'));

const TutorDashboardPage = lazy(() => import('@/pages/tutor/TutorDashboardPage.jsx'));
const TutorCoursesPage = lazy(() => import('@/pages/tutor/TutorCoursesPage.jsx'));
const TutorStudentsPage = lazy(() => import('@/pages/tutor/TutorStudentsPage.jsx'));

const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage.jsx'));
const StudentCoursesPage = lazy(() => import('@/pages/student/StudentCoursesPage.jsx'));
const StudentLibraryPage = lazy(() => import('@/pages/student/StudentLibraryPage.jsx'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen minHeight="100vh" />}>
      <Routes>
        {/* Auth screens carry their own full-page layout. */}
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.signup} element={<SignupPage />} />

        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path={PATHS.courses} element={<CourseCatalogPage />} />
          <Route path={PATHS.courseDetail()} element={<CourseDetailPage />} />
          <Route path={PATHS.library} element={<BookCatalogPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path={PATHS.admin.root} element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.admin.dashboard} replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="books" element={<AdminBooksPage />} />
            <Route path="tutors" element={<AdminTutorsPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="enrollments" element={<AdminEnrollmentsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.TUTOR]} />}>
          <Route path={PATHS.tutor.root} element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.tutor.dashboard} replace />} />
            <Route path="dashboard" element={<TutorDashboardPage />} />
            <Route path="courses" element={<TutorCoursesPage />} />
            <Route path="students" element={<TutorStudentsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path={PATHS.student.root} element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.student.dashboard} replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="courses" element={<StudentCoursesPage />} />
            <Route path="library" element={<StudentLibraryPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
