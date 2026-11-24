import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { AuthContext } from './authContext';

const STORAGE_KEY = 'chennai-craft-auth';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStored);

  const save = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ token: null, user: null });
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    save({ token: data.token, user: data.user });
  };

  const register = async (name, email, password) => {
    await apiFetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    await login(email, password);
  };

  const refreshUser = useCallback(async () => {
    if (!auth.token) return;
    try {
      const user = await apiFetch('/api/me', { token: auth.token });
      save({ token: auth.token, user });
    } catch (err) {
      if (err.status === 401) logout();
    }
  }, [auth.token, save, logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = {
    token: auth.token,
    user: auth.user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}