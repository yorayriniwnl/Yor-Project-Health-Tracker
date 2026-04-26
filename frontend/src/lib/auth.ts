'use client';

import { api } from './api';
import type { User, UserRole } from '@/types/user';

export type LoginResponse = { user: User; accessToken: string; refreshToken: string };

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  localStorage.setItem('gph_access_token', data.accessToken);
  localStorage.setItem('gph_refresh_token', data.refreshToken);
  localStorage.setItem('gph_user', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem('gph_access_token');
  localStorage.removeItem('gph_refresh_token');
  localStorage.removeItem('gph_user');
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('gph_user');
  return raw ? JSON.parse(raw) as User : null;
}

export function dashboardPathForRole(role: UserRole) {
  if (role === 'PUBLIC_VIEWER') return '/public-portal';
  if (role === 'CONTRACTOR') return '/projects';
  return '/dashboard';
}
