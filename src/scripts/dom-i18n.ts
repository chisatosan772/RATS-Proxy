import type { Locale } from '../i18n';
import { translations } from '../i18n';

function pick(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function applyDomI18n(lang: Locale): void {
  const table = translations[lang];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const text = pick(table, key);
    if (text !== undefined) {
      el.textContent = text;
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    const raw = el.dataset.i18nAttr;
    if (!raw) return;
    const [attr, key] = raw.split(':');
    if (!attr || !key) return;
    const text = pick(table, key);
    if (text !== undefined) {
      el.setAttribute(attr, text);
    }
  });
}
