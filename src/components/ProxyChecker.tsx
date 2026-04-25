import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ApiError, checkProxyRequest, createProxyRequest, getProxyRegionRequest, type ProxyRegion } from '../lib/api';
import { getStoredLocale, t, type Locale } from '../i18n';

const UUID_RE = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

type Phase = 'invalid_uuid' | 'loading_quota' | 'quota' | 'creating' | 'result' | 'error';

function formatTraffic(value: number): string {
  // Round to 2 decimal places
  return String(Math.round(value * 100) / 100);
}

function messageForProxyApiError(locale: Locale, err: ApiError): string {
  if (err.serverError) {
    const se = err.serverError.toLowerCase();
    if (se.includes('invalid') && se.includes('uuid')) return t(locale, 'proxy.error.invaliduuid');
    if (se.includes('token') && (se.includes('expired') || se.includes('invalid'))) {
      return t(locale, 'proxy.error.expired');
    }
  }
  switch (err.kind) {
    case 'network':
      return t(locale, 'proxy.error.network');
    case 'not_found':
      return t(locale, 'proxy.error.notfound');
    case 'expired':
      return t(locale, 'proxy.error.expired');
    case 'bad_request':
      return t(locale, 'proxy.error.invaliduuid');
    case 'rate_limit':
      return err.retryAfterSeconds != null && err.retryAfterSeconds > 0
        ? `${t(locale, 'proxy.error.ratelimit')} ${t(locale, 'proxy.error.ratelimitRetry', { seconds: err.retryAfterSeconds })}`
        : t(locale, 'proxy.error.ratelimit');
    default:
      return t(locale, 'proxy.error.network');
  }
}

interface Props {
  uuid: string;
}

export default function ProxyChecker({ uuid }: Props) {
  const [locale, setLocale] = useState<Locale>('en');
  const [phase, setPhase] = useState<Phase>('loading_quota');
  const [remaining, setRemaining] = useState(0);
  const [used, setUsed] = useState(0);
  const [unit, setUnit] = useState<'MB' | 'GB'>('MB');
  const [errorMsg, setErrorMsg] = useState('');
  const [regions, setRegions] = useState<ProxyRegion[]>([]);
  const [regionsError, setRegionsError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [proxyLine, setProxyLine] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);

  useLayoutEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  useEffect(() => {
    const onLang = () => setLocale(getStoredLocale());
    window.addEventListener('langchange', onLang);
    return () => window.removeEventListener('langchange', onLang);
  }, []);

  const selectedRegionCode = regions[selectedIndex]?.region ?? regions[selectedIndex]?.name ?? '';

  const loadQuota = useCallback(async () => {
    if (!UUID_RE.test(uuid)) {
      setPhase('invalid_uuid');
      return;
    }
    setPhase('loading_quota');
    setErrorMsg('');
    setProxyLine(null);
    setRegionsError(null);
    setRegions([]);
    setSelectedIndex(0);
    try {
      const r = await checkProxyRequest(uuid);
      setRemaining(r.remaining);
      setUsed(r.used);
      setUnit(r.unit);
      // proxyType is detected but not displayed

      try {
        const list = await getProxyRegionRequest(uuid);
        setRegions(list);
        setSelectedIndex(0);
        setRegionsError(null);
      } catch (re) {
        const loc = getStoredLocale();
        if (re instanceof ApiError) {
          setRegionsError(messageForProxyApiError(loc, re));
        } else {
          setRegionsError(t(loc, 'proxy.error.regionsFailed'));
        }
        setRegions([]);
      }

      setPhase('quota');
    } catch (e) {
      const loc = getStoredLocale();
      if (e instanceof ApiError) {
        setErrorMsg(messageForProxyApiError(loc, e));
      } else {
        setErrorMsg(t(loc, 'proxy.error.network'));
      }
      setPhase('error');
    }
  }, [uuid]);

  useEffect(() => {
    void loadQuota();
  }, [loadQuota]);

  const reloadRegionsOnly = async () => {
    if (!UUID_RE.test(uuid)) return;
    setRegionsError(null);
    try {
      const list = await getProxyRegionRequest(uuid);
      setRegions(list);
      setSelectedIndex(0);
    } catch (re) {
      if (re instanceof ApiError) {
        setRegionsError(messageForProxyApiError(locale, re));
      } else {
        setRegionsError(t(locale, 'proxy.error.regionsFailed'));
      }
      setRegions([]);
    }
  };

  const onCreate = async () => {
    if (!UUID_RE.test(uuid) || !selectedRegionCode) return;
    setProxyLine(null);
    setPhase('creating');
    setErrorMsg('');
    try {
      // Send country/region as-is from the region data (don't uppercase)
      const line = await createProxyRequest(uuid, selectedRegionCode.trim());
      setProxyLine(line);
      setPhase('result');
      setSuccessPulse(true);
      setTimeout(() => setSuccessPulse(false), 700);
    } catch (e) {
      const loc = getStoredLocale();
      if (e instanceof ApiError) {
        setErrorMsg(messageForProxyApiError(loc, e));
      } else {
        setErrorMsg(t(loc, 'proxy.error.network'));
      }
      setPhase('error');
    }
  };

  const onCopy = async () => {
    if (!proxyLine) return;
    try {
      await navigator.clipboard.writeText(proxyLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const totalTraffic = Math.max(remaining + used, 1);
  const pctRemaining = Math.min(100, Math.round((remaining / totalTraffic) * 100));

  const canCreate = regions.length > 0 && selectedRegionCode.length > 0;

  if (phase === 'invalid_uuid') {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 text-center">
        <h1 className="text-xl font-semibold text-fg md:text-2xl">{t(locale, 'proxy.title')}</h1>
        <p className="rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-4 text-sm text-[var(--color-error)]">
          {t(locale, 'proxy.error.invaliduuid')}
        </p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
        <h1 className="text-xl font-semibold text-fg md:text-2xl">{t(locale, 'proxy.title')}</h1>
        <p className="w-full rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-4 text-sm text-[var(--color-error)]">
          {errorMsg}
        </p>
        <button
          type="button"
          onClick={() => void loadQuota()}
          className="min-h-touch min-w-touch rounded-xl bg-gradient-to-r from-accent via-accent-2 to-accent px-6 py-3 font-semibold text-white shadow-glow transition-all hover:scale-[1.02] hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {t(locale, 'common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-fg md:text-3xl">{t(locale, 'proxy.title')}</h1>
        <p className="mt-2 text-sm text-fg-muted/80">{t(locale, 'proxy.supportInfo')}</p>
      </div>

      {phase === 'loading_quota' ? (
        <div className="flex flex-col gap-4 animate-pulse" aria-busy="true" role="status">
          <span className="sr-only">{t(locale, 'proxy.loading')}</span>
          <div className="h-10 w-2/3 self-center rounded-xl bg-fg-muted/20" />
          <div className="h-4 w-full rounded-lg bg-fg-muted/15" />
          <div className="h-24 w-full rounded-2xl bg-fg-muted/15" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-sm font-medium text-fg-muted">{t(locale, 'proxy.remaining')}</p>
              <p className="mt-2 text-2xl font-bold text-fg">{formatTraffic(remaining)} <span className="text-base font-medium text-fg-muted">{unit}</span></p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-fg-muted/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                  style={{ width: `${pctRemaining}%` }}
                />
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-sm font-medium text-fg-muted">{t(locale, 'proxy.used')}</p>
              <p className="mt-2 text-2xl font-bold text-fg">{formatTraffic(used)} <span className="text-base font-medium text-fg-muted">{unit}</span></p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-fg-muted/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                  style={{ width: `${100 - pctRemaining}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-medium text-fg-muted">{t(locale, 'proxy.selectRegion')}</label>
              {regionsError ? (
                <button
                  type="button"
                  onClick={() => void reloadRegionsOnly()}
                  className="text-sm font-semibold text-accent underline-offset-2 hover:underline"
                >
                  {t(locale, 'common.retry')}
                </button>
              ) : null}
            </div>

            {regionsError ? (
              <p className="rounded-xl border border-[var(--color-error)]/35 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
                {regionsError}
              </p>
            ) : null}

            {regions.length === 0 && !regionsError ? (
              <p className="rounded-xl border border-dashed border-glass-border px-4 py-6 text-center text-sm text-fg-muted">
                {t(locale, 'proxy.regionsEmpty')}
              </p>
            ) : (
              <div className="relative">
                <select
                  value={selectedIndex}
                  onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  disabled={phase === 'creating'}
                  className="w-full appearance-none rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 pr-10 text-sm text-fg transition-all hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 min-h-touch cursor-pointer"
                >
                  {(() => {
                    const seen = new Set<string>();
                    return regions.map((reg, i) => {
                      // For FusionProxy: use name
                      // For OwlProxy: use countryName or region
                      const displayName = reg.name || reg.countryName || reg.region || '';
                      if (!displayName || seen.has(displayName)) return null;
                      seen.add(displayName);
                      return (
                        <option key={`${reg.region || reg.name}-${reg.city || ''}-${reg.state || ''}-${i}`} value={i}>
                          {displayName}
                        </option>
                      );
                    });
                  })()}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-fg-muted">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => void onCreate()}
              disabled={phase === 'creating' || !canCreate}
              className="min-h-touch w-full rounded-xl bg-gradient-to-r from-accent via-accent-2 to-accent px-5 py-3 font-semibold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50"
            >
              {phase === 'creating' ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span
                    className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden
                  />
                  {t(locale, 'proxy.creating')}
                </span>
              ) : (
                t(locale, 'proxy.create')
              )}
            </button>
          </div>

          {phase === 'result' && proxyLine ? (
            <div
              className={`glass-panel rounded-2xl p-6 transition-transform duration-300 ${
                successPulse ? 'scale-[1.02] shadow-glow' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Protocol Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-fg-muted">Protocol</label>
                  <div className="relative">
                    <input
                      type="text"
                      value="HTTP"
                      readOnly
                      className="w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 text-sm text-fg cursor-not-allowed appearance-none pr-10"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-fg-muted">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Proxy Address and Port Row */}
                <div className="grid gap-4 md:grid-cols-[1fr_120px]">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-fg-muted">Proxy Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={proxyLine.split(':')[0] || ''}
                        readOnly
                        className="w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 text-sm text-fg cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(proxyLine.split(':')[0] || '');
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-fg-muted hover:text-accent transition-colors"
                        title="Copy proxy address"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-fg-muted">Port</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={proxyLine.split(':')[1] || ''}
                        readOnly
                        className="w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 text-sm text-fg cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(proxyLine.split(':')[1] || '');
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-fg-muted hover:text-accent transition-colors"
                        title="Copy port"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Full Proxy Line */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-fg-muted">Full Proxy Line</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={proxyLine}
                      readOnly
                      className="w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 text-sm text-fg cursor-not-allowed font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => void onCopy()}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-fg-muted hover:text-accent transition-colors"
                      title={copied ? 'Copied!' : 'Copy full proxy line'}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* cURL Example */}
                <div className="mt-6 pt-6 border-t border-glass-border">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 19V7H4v12zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-7 14v-2h5v2zm-3.42-4L5.57 9H8.4l3.3 3.3c.39.39.39 1.03 0 1.42L8.42 17H5.59z" />
                    </svg>
                    <span className="text-sm font-semibold text-fg">cURL Example</span>
                  </div>
                  <div className="relative">
                    <code className="block w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 text-xs text-fg font-mono break-all overflow-x-auto">
                      curl -x {proxyLine} -U "username:password" ipinfo.io
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`curl -x ${proxyLine} -U "username:password" ipinfo.io`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-xs font-medium"
                      title="Copy cURL command"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                </div>

                {/* Main Copy Button */}
                <button
                  type="button"
                  onClick={() => void onCopy()}
                  className="min-h-touch w-full mt-4 rounded-xl bg-gradient-to-r from-accent via-accent-2 to-accent px-5 py-3 font-semibold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {copied ? '✓ ' + t(locale, 'proxy.copied') : t(locale, 'proxy.copy')}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
