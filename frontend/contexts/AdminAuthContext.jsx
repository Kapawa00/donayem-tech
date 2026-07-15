'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi, { getToken, isAuthenticated as hasToken, removeToken, setToken } from '@/lib/adminAuth';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!hasToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await adminApi.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function login(email, password) {
    const { data } = await adminApi.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function logout() {
    try {
      await adminApi.post('/auth/logout');
    } catch (error) {
      // Le token est de toute façon supprimé localement ci-dessous.
    } finally {
      removeToken();
      setUser(null);
      router.push('/admin/login');
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
    getToken,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth doit être utilisé à l’intérieur de AdminAuthProvider.');
  }

  return context;
}
