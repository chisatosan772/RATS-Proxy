import { AUTH_ACCESS_KEY, AUTH_REFRESH_KEY } from './constants';
import type { LoginUser } from './api';

export const USER_PROFILE_KEY = 'user_profile';

export function saveTokens(access: string, refresh: string, user?: LoginUser): void {
  try {
    localStorage.setItem(AUTH_ACCESS_KEY, access);
    localStorage.setItem(AUTH_REFRESH_KEY, refresh);
    if (user) {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_PROFILE_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(AUTH_ACCESS_KEY);
    localStorage.removeItem(AUTH_REFRESH_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(AUTH_ACCESS_KEY);
  } catch {
    return null;
  }
}
