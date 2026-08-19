import { useCallback, useEffect, useMemo, useState } from 'react';

import { authApi } from '@/api/auth.api.js';
import { ROLES } from '@/constants/roles.js';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // `true` until the initial session check settles, so guards do not redirect
  // a signed-in user to the login page on first paint.
  const [initializing, setInitializing] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const response = await authApi.me();
      setUser(response.data.user);
      setProfile(response.data.profile);
    } catch {
      setUser(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    loadSession().finally(() => setInitializing(false));
  }, [loadSession]);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    setUser(response.data.user);
    await authApi.me().then((session) => setProfile(session.data.profile));
    return response.data.user;
  }, []);

  const signup = useCallback(async (payload) => {
    const response = await authApi.signup(payload);
    setUser(response.data.user);
    await authApi.me().then((session) => setProfile(session.data.profile));
    return response.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      // Clear locally even if the network call failed — the cookie may already
      // be gone and the user expects to be signed out either way.
      setUser(null);
      setProfile(null);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((current) => (current ? { ...current, ...updates } : current));
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      initializing,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === ROLES.ADMIN,
      isTutor: user?.role === ROLES.TUTOR,
      isStudent: user?.role === ROLES.STUDENT,
      login,
      signup,
      logout,
      updateUser,
      refreshSession: loadSession,
    }),
    [user, profile, initializing, login, signup, logout, updateUser, loadSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
