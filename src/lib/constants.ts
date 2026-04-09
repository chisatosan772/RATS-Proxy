/**
 * In dev, use same-origin paths so Vite proxies to the API (avoids CORS).
 * Set PUBLIC_API_URL in .env when the API is on another origin in production.
 */
const fromEnv = import.meta.env.PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export const API_BASE_URL =
  fromEnv || (import.meta.env.DEV ? '' : '');

export const STORAGE_THEME = 'theme';
export const STORAGE_LANG = 'lang';

export const AUTH_ACCESS_KEY = 'access_token';
export const AUTH_REFRESH_KEY = 'refresh_token';
