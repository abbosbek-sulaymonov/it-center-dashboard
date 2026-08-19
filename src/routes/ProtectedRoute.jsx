import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PATHS, dashboardPathFor } from '@/constants/routes.js';
import { useAuth } from '@/hooks/useAuth.js';

/**
 * Gate for authenticated areas. `allowedRoles` empty means "any signed-in user";
 * a signed-in user with the wrong role is sent to their own dashboard rather
 * than to the login page.
 */
export function ProtectedRoute({ allowedRoles = [] }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <LoadingScreen minHeight="100vh" />;

  if (!user) return <Navigate to={PATHS.login} state={{ from: location }} replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardPathFor(user.role)} replace />;
  }

  return <Outlet />;
}
