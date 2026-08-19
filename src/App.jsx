import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './app/context/AuthContext';
import Dashboard from './app/components/adminPanel/Dashboard';
import Students from './app/components/adminPanel/Students';
import Tutors from './app/components/adminPanel/Tutors';
import Signup from './app/components/Signup';
import UserDashboard from './app/components/userPanel/UserDashboard';
import Tutor from './app/components/userPanel/Tutor';
import Books from './app/components/userPanel/Books';
import UserLayout from './app/components/userPanel/Layout';
import Navbar from './app/components/Navbar';
import Login from './app/components/Login';
import LandingPage from './app/LandingPage';
import ProtectedRoute from './app/components/mainComponents/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <Routes>
          {/* Protected User Routes */}
          <Route
            path="/user/"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="tutor" element={<Tutor />} />
            <Route path="library" element={<Books />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin/"
            element={
              <ProtectedRoute requireAdmin>
                <Navbar />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tutors" element={<Tutors />} />
            <Route path="library" element={<Students />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export { App };
