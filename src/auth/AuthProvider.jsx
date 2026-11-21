import { useState } from 'react';
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

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const next = { token: data.token, user: data.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  };

  const register = async (name, email, password) => {
    await apiFetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ token: null, user: null });
  };

  const value = { token: auth.token, user: auth.user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}