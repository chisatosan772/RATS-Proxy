import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ApiError, loginRequest } from '../lib/api';
import { getAccessToken, saveTokens } from '../lib/auth';
import { getStoredLocale, t, type Locale } from '../i18n';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  /** Fixed initial locale so SSR HTML matches first client render (avoids hydration mismatch). */
  const [locale, setLocale] = useState<Locale>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(0);

  useLayoutEffect(() => {
    setLocale(getStoredLocale());
    if (getAccessToken()) {
      window.location.replace('/gw/dashboard');
    }
  }, []);

  useEffect(() => {
    const onLang = () => setLocale(getStoredLocale());
    window.addEventListener('langchange', onLang);
    return () => window.removeEventListener('langchange', onLang);
  }, []);

  useEffect(() => {
    if (!blockedUntil || blockedUntil <= Date.now()) return;
    setNowTick(Date.now());
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [blockedUntil]);

  const emailInvalid = touched && (!email.trim() || !EMAIL_RE.test(email.trim()));
  const passwordInvalid = touched && !password;

  const countdown = useMemo(() => {
    if (!blockedUntil || !nowTick || blockedUntil <= nowTick) return null;
    const ms = blockedUntil - nowTick;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return { minutes, seconds };
  }, [blockedUntil, nowTick]);

  const resolveRedirect = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next && next.startsWith('/') && !next.startsWith('//')) {
      window.location.href = next;
      return;
    }
    try {
      const ref = sessionStorage.getItem('loginReturn');
      if (ref && ref.startsWith(window.location.origin)) {
        const path = new URL(ref).pathname.replace(/\/$/, '') || '/';
        if (path !== '/gw/login' && !path.endsWith('/gw/login')) {
          sessionStorage.removeItem('loginReturn');
          window.location.href = ref;
          return;
        }
      }
    } catch {
      /* ignore */
    }
    window.location.href = '/gw/dashboard';
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setErrorMsg(null);
    setBlockedUntil(null);

    if (!email.trim() || !EMAIL_RE.test(email.trim()) || !password) {
      setErrorMsg(t(locale, 'login.error.invalid'));
      return;
    }

    setLoading(true);
    try {
      const tokens = await loginRequest(email.trim(), password);
      saveTokens(tokens.access_token, tokens.refresh_token, tokens.user);
      resolveRedirect();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.kind === 'network') {
          setErrorMsg(t(locale, 'login.error.network'));
        } else if (err.kind === 'rate_limit') {
          setErrorMsg(t(locale, 'login.error.ratelimit'));
        } else if (err.kind === 'blocked' && err.blockedUntil) {
          setBlockedUntil(err.blockedUntil);
          setErrorMsg(t(locale, 'login.error.blocked'));
        } else if (err.kind === 'invalid_credentials') {
          setErrorMsg(t(locale, 'login.error.credentials'));
        } else {
          setErrorMsg(t(locale, 'login.error.credentials'));
        }
      } else {
        setErrorMsg(t(locale, 'login.error.network'));
      }
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || (blockedUntil !== null && blockedUntil > Date.now());

  return (
    <div className="flex flex-col gap-6" suppressHydrationWarning>
      <div className="text-center" suppressHydrationWarning>
        <h1 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">{t(locale, 'login.title')}</h1>
        <p className="mt-2 text-sm text-fg-muted md:text-base">{t(locale, 'login.subtitle')}</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate suppressHydrationWarning>
        <div className="flex flex-col gap-2" suppressHydrationWarning>
          <label className="text-sm font-medium text-fg-muted" htmlFor="login-email">
            {t(locale, 'login.email')}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            className="min-h-touch w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-2 text-fg shadow-inner backdrop-blur-md transition-all placeholder:text-fg-muted/60 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent disabled:opacity-60"
            placeholder={t(locale, 'login.email')}
          />
          {emailInvalid ? (
            <p className="text-sm text-[var(--color-error)]" role="alert">
              {t(locale, 'login.error.invalid')}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2" suppressHydrationWarning>
          <label className="text-sm font-medium text-fg-muted" htmlFor="login-password">
            {t(locale, 'login.password')}
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={disabled}
            className="min-h-touch w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-2 text-fg shadow-inner backdrop-blur-md transition-all placeholder:text-fg-muted/60 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent disabled:opacity-60"
            placeholder={t(locale, 'login.password')}
          />
          {passwordInvalid ? (
            <p className="text-sm text-[var(--color-error)]" role="alert">
              {t(locale, 'login.error.invalid')}
            </p>
          ) : null}
        </div>

        {countdown ? (
          <p
            className="rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-3 text-center text-sm text-[var(--color-error)]"
            role="alert"
          >
            {t(locale, 'login.error.blocked')}{' '}
            {t(locale, 'login.error.blockedCountdown', {
              minutes: countdown.minutes,
              seconds: countdown.seconds,
            })}
          </p>
        ) : null}

        {errorMsg && !countdown ? (
          <p
            className="rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-3 text-center text-sm text-[var(--color-error)]"
            role="alert"
          >
            {errorMsg}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={disabled}
          className="min-h-touch w-full rounded-xl bg-gradient-to-r from-accent via-accent-2 to-accent px-5 py-3 font-semibold text-white shadow-glow transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
              {t(locale, 'login.loading')}
            </span>
          ) : (
            t(locale, 'login.button')
          )}
        </button>
      </form>
    </div>
  );
}
