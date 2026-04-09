import en from './en.json';
import id from './id.json';
import { STORAGE_LANG } from '../lib/constants';

export type Locale = 'en' | 'id';

export const translations = { en, id } as const;

export type Messages = typeof en;

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const v = localStorage.getItem(STORAGE_LANG);
    if (v === 'id' || v === 'en') return v;
  } catch {
    /* ignore */
  }
  return 'en';
}

export function setStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_LANG, locale);
  } catch {
    /* ignore */
  }
}

function getByPath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

/** Interpolate {{key}} placeholders */
export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const table = translations[locale] as unknown as Record<string, unknown>;
  let text = getByPath(table, key);
  if (text === undefined && locale !== 'en') {
    text = getByPath(translations.en as unknown as Record<string, unknown>, key);
  }
  if (text === undefined) return key;
  if (vars) {
    for (const [k, val] of Object.entries(vars)) {
      text = text.replaceAll(`{{${k}}}`, String(val));
    }
  }
  return text;
}

export function messagesForClient(): typeof translations {
  return translations;
}
