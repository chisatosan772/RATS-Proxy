import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  adminCreateProxy,
  adminBulkCreateProxy,
  adminDeleteProxy,
  adminListProxies,
  adminUpdateProxy,
  ApiError,
  type AdminProxyRow,
} from '../lib/api';
import { USER_PROFILE_KEY } from '../lib/auth';
import { getStoredLocale, t, type Locale } from '../i18n';

function readIsAdmin(): boolean {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return false;
    const u = JSON.parse(raw) as { role?: string };
    return String(u.role ?? '').toLowerCase() === 'admin';
  } catch {
    return false;
  }
}

function formatWhen(iso: string | undefined, locale: Locale): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(locale === 'id' ? 'id-ID' : 'en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export default function AdminProxyPanel() {
  const [locale, setLocale] = useState<Locale>('en');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<AdminProxyRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isBulkMode, setIsBulkMode] = useState(false);

  const [accounts, setAccounts] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [copyFlashId, setCopyFlashId] = useState<string | null>(null);
  const [lastBulkCreatedIds, setLastBulkCreatedIds] = useState<string[]>([]);
  const [bulkCopyFlash, setBulkCopyFlash] = useState(false);

  useLayoutEffect(() => {
    setLocale(getStoredLocale());
    setIsAdmin(readIsAdmin());
  }, []);

  useEffect(() => {
    const onLang = () => setLocale(getStoredLocale());
    window.addEventListener('langchange', onLang);
    return () => window.removeEventListener('langchange', onLang);
  }, []);

  const load = useCallback(async (cPage = page, cSearch = search) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const result = await adminListProxies(cPage, limit, cSearch);
      setRows(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.total);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.kind === 'expired') {
          window.location.replace('/gw/login');
          return;
        }
        if (e.kind === 'network') {
          setErrorMsg(t(getStoredLocale(), 'dashboard.proxyAdmin.errorNetwork'));
        } else if (e.kind === 'rate_limit') {
          setErrorMsg(t(getStoredLocale(), 'proxy.error.ratelimit'));
        } else {
          setErrorMsg(t(getStoredLocale(), 'dashboard.proxyAdmin.errorLoad'));
        }
      } else {
        setErrorMsg(t(getStoredLocale(), 'dashboard.proxyAdmin.errorLoad'));
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (isAdmin) void load(page, search);
  }, [isAdmin, load, page]);

  const handleApiError = (err: unknown, msgKey: string) => {
    if (err instanceof ApiError) {
      if (err.kind === 'expired') {
        window.location.replace('/gw/login');
        return;
      }
      if (err.kind === 'network') {
        setErrorMsg(t(locale, 'dashboard.proxyAdmin.errorNetwork'));
        return;
      }
      if (err.kind === 'not_found') {
        setErrorMsg(t(locale, 'dashboard.proxyAdmin.errorNotFound'));
        void load(page, search);
        return;
      }
    }
    setErrorMsg(t(locale, msgKey));
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accounts.trim()) return;
    setCreating(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (isBulkMode) {
        const emails = accounts.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
        if (!emails.length) {
          setCreating(false);
          return;
        }
        const res = await adminBulkCreateProxy(emails);
        
        const successIds = res.results.filter(r => r.success && r.id).map(r => r.id as string);
        setLastBulkCreatedIds(successIds);

        if (res.failed > 0) {
          setErrorMsg(`Bulk create finished. ${res.success} success, ${res.failed} failed.`);
        } else {
          setSuccessMsg(`Successfully created ${res.success} proxies.`);
        }
      } else {
        await adminCreateProxy(accounts.trim());
        setLastBulkCreatedIds([]);
        setSuccessMsg(t(locale, 'dashboard.proxyAdmin.successCreate') ?? 'Proxy created successfully.');
      }
      setAccounts('');
      setPage(1);
      await load(1, search);
    } catch (err) {
      handleApiError(err, 'dashboard.proxyAdmin.errorCreate');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (r: AdminProxyRow) => {
    setDeleteConfirmId(null);
    setEditingId(r.id);
    setEditValue(r.accounts);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingId || !editValue.trim()) return;
    setUpdatingId(editingId);
    setErrorMsg(null);
    try {
      await adminUpdateProxy(editingId, editValue.trim());
      cancelEdit();
      await load();
    } catch (err) {
      handleApiError(err, 'dashboard.proxyAdmin.errorUpdate');
    } finally {
      setUpdatingId(null);
    }
  };

  const onDelete = async (id: string) => {
    setDeletingId(id);
    setErrorMsg(null);
    try {
      await adminDeleteProxy(id);
      setDeleteConfirmId(null);
      await load();
    } catch (err) {
      handleApiError(err, 'dashboard.proxyAdmin.errorDelete');
    } finally {
      setDeletingId(null);
    }
  };

  const copyLink = async (id: string) => {
    try {
      const link = `${window.location.host}/${id}`;
      await navigator.clipboard.writeText(link);
      setCopyFlashId(id);
      setTimeout(() => setCopyFlashId((cur) => (cur === id ? null : cur)), 1600);
    } catch {
      /* ignore */
    }
  };

  const copyAllLinks = async () => {
    if (!lastBulkCreatedIds.length) return;
    try {
      const links = lastBulkCreatedIds.map(id => `${window.location.host}/${id}`).join('\n');
      await navigator.clipboard.writeText(links);
      setBulkCopyFlash(true);
      setTimeout(() => setBulkCopyFlash(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!isAdmin) return null;

  const btnBase =
    'min-h-touch min-w-touch inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
  const btnGhost = `${btnBase} border border-glass-border bg-[var(--color-input-bg)]/80 text-fg hover:border-accent/60 hover:shadow-glow-sm`;
  const btnDanger = `${btnBase} border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)]/20`;
  const btnPrimary = `${btnBase} bg-gradient-to-r from-accent to-accent-2 text-white shadow-glow-sm hover:scale-[1.02] hover:shadow-glow disabled:opacity-50`;

  return (
    <section className="relative w-full max-w-4xl animate-fade-in">
      <div className="absolute inset-x-8 -top-px mx-auto h-px max-w-lg bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" aria-hidden />

      <div className="relative overflow-hidden rounded-3xl border border-glass-border bg-[var(--color-glass-bg)] p-6 shadow-glow-sm backdrop-blur-xl md:p-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-accent-2/10 blur-3xl"
          aria-hidden
        />

        <header className="relative text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/40 to-accent-2/30 text-2xl shadow-glow-sm ring-1 ring-accent/30">
            ◈
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">
            {t(locale, 'dashboard.proxyAdmin.title')}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted md:text-base">
            {t(locale, 'dashboard.proxyAdmin.subtitle')}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent md:text-sm">
              {t(locale, 'dashboard.proxyAdmin.totalProxies', { count: totalItems })}
            </span>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mt-8 mb-6">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); void load(1, search); }} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search proxies..."
              className="min-h-touch w-full flex-1 rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-2 text-sm text-fg shadow-inner transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
            <button type="submit" className={`${btnGhost} px-4 py-2`}>Search</button>
          </form>
        </div>

        <div className="relative mt-4 rounded-2xl border border-glass-border/80 bg-[var(--color-input-bg)]/35 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">
              {t(locale, 'dashboard.proxyAdmin.sectionAdd')}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsBulkMode(false)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${!isBulkMode ? 'bg-accent/20 text-accent font-semibold' : 'text-fg-muted hover:bg-white/5'}`}
              >
                Single
              </button>
              <button
                type="button"
                onClick={() => setIsBulkMode(true)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${isBulkMode ? 'bg-accent/20 text-accent font-semibold' : 'text-fg-muted hover:bg-white/5'}`}
              >
                Bulk
              </button>
            </div>
          </div>
          <form className={`flex ${isBulkMode ? 'flex-col' : 'flex-col sm:flex-row sm:items-end'} gap-4`} onSubmit={onCreate}>
            <div className="min-w-0 flex-1">
              <label className="mb-2 block text-left text-sm font-medium text-fg-muted" htmlFor="admin-proxy-accounts">
                {t(locale, 'dashboard.proxyAdmin.accountsLabel')} {isBulkMode ? '(Comma or newline separated)' : ''}
              </label>
              {isBulkMode ? (
                <textarea
                  id="admin-proxy-accounts"
                  value={accounts}
                  onChange={(e) => setAccounts(e.target.value)}
                  disabled={creating}
                  rows={4}
                  placeholder="user1@example.com, user2@example.com"
                  className="w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 text-sm text-fg shadow-inner transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
                />
              ) : (
                <input
                  id="admin-proxy-accounts"
                  type="email"
                  autoComplete="off"
                  value={accounts}
                  onChange={(e) => setAccounts(e.target.value)}
                  disabled={creating}
                  placeholder={t(locale, 'dashboard.proxyAdmin.accountsPlaceholder')}
                  className="min-h-touch w-full rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 text-sm text-fg shadow-inner transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
                />
              )}
            </div>
            <button type="submit" disabled={creating || !accounts.trim()} className={`${btnPrimary} w-full sm:w-auto sm:px-8`}>
              {creating ? t(locale, 'dashboard.proxyAdmin.creating') : t(locale, 'dashboard.proxyAdmin.add')}
            </button>
          </form>
        </div>

        {errorMsg ? (
          <p
            className="relative mt-6 rounded-2xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-3 text-center text-sm text-[var(--color-error)]"
            role="alert"
          >
            {errorMsg}
          </p>
        ) : null}
        {successMsg ? (
          <div className="relative mt-6 rounded-2xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-4 py-3 flex flex-col items-center gap-3">
            <p className="text-sm text-[#34d399]" role="alert">
              {successMsg}
            </p>
            {isBulkMode && lastBulkCreatedIds.length > 0 && (
              <button type="button" onClick={copyAllLinks} className={`${btnGhost} !min-h-0 text-xs px-3 py-2`}>
                {bulkCopyFlash ? 'Copied All!' : 'Copy All Success Links'}
              </button>
            )}
          </div>
        ) : null}

        <div className="relative mt-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            {t(locale, 'dashboard.proxyAdmin.sectionList')}
          </h3>

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <span
                className="h-12 w-12 animate-spin rounded-full border-2 border-accent/20 border-t-accent"
                aria-hidden
              />
              <p className="text-sm text-fg-muted">{t(locale, 'dashboard.proxyAdmin.loading')}</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-glass-border py-16 text-center">
              <p className="text-fg-muted">{t(locale, 'dashboard.proxyAdmin.empty')}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {rows.map((r) => {
                const isEditing = editingId === r.id;
                const confirmDel = deleteConfirmId === r.id;
                const busy = updatingId === r.id || deletingId === r.id;

                return (
                  <li
                    key={r.id}
                    className="group relative overflow-hidden rounded-2xl border border-glass-border/90 bg-gradient-to-br from-[var(--color-input-bg)]/95 to-transparent p-5 transition duration-300 hover:border-accent/40 hover:shadow-glow-sm md:p-6"
                  >
                    <div
                      className="pointer-events-none absolute -right-6 top-0 h-32 w-32 rounded-full bg-accent/5 blur-2xl transition group-hover:bg-accent/10"
                      aria-hidden
                    />

                    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <code
                            className="max-w-full truncate rounded-lg bg-[var(--color-bg)]/50 px-2 py-1 font-mono text-xs text-fg md:text-sm"
                            title={r.id}
                          >
                            {r.id}
                          </code>
                          <button
                            type="button"
                            onClick={() => void copyLink(r.id)}
                            className={`${btnGhost} !min-h-0 px-3 py-1.5 text-xs`}
                          >
                            {copyFlashId === r.id
                              ? t(locale, 'dashboard.proxyAdmin.copied')
                              : t(locale, 'dashboard.proxyAdmin.copyLink')}
                          </button>
                        </div>

                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="email"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              disabled={busy}
                              className="min-h-touch w-full max-w-md rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-2.5 text-fg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                              aria-label={t(locale, 'dashboard.proxyAdmin.accountsLabel')}
                            />
                            <div className="flex flex-wrap gap-2">
                              <button type="button" disabled={busy || !editValue.trim()} onClick={() => void saveEdit()} className={btnPrimary}>
                                {updatingId === r.id ? t(locale, 'dashboard.proxyAdmin.saving') : t(locale, 'dashboard.proxyAdmin.save')}
                              </button>
                              <button type="button" disabled={busy} onClick={cancelEdit} className={btnGhost}>
                                {t(locale, 'dashboard.proxyAdmin.cancel')}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="break-all text-lg font-medium text-fg md:text-xl">{r.accounts}</p>
                        )}

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted md:text-sm">
                          <span>
                            {t(locale, 'dashboard.proxyAdmin.colCreated')}: {formatWhen(r.created_at, locale)}
                          </span>
                          {r.updated_at ? (
                            <span>
                              {t(locale, 'dashboard.proxyAdmin.colUpdated')}: {formatWhen(r.updated_at, locale)}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {!isEditing ? (
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col md:items-stretch">
                          {confirmDel ? (
                            <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-3">
                              <p className="text-center text-xs font-medium text-[var(--color-error)] md:text-left">
                                {t(locale, 'dashboard.proxyAdmin.deleteConfirm')}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => void onDelete(r.id)}
                                  className={btnDanger}
                                >
                                  {deletingId === r.id ? t(locale, 'dashboard.proxyAdmin.deleting') : t(locale, 'dashboard.proxyAdmin.deleteYes')}
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => setDeleteConfirmId(null)}
                                  className={btnGhost}
                                >
                                  {t(locale, 'dashboard.proxyAdmin.deleteNo')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button type="button" disabled={busy} onClick={() => startEdit(r)} className={btnGhost}>
                                {t(locale, 'dashboard.proxyAdmin.edit')}
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => {
                                  setEditingId(null);
                                  setDeleteConfirmId(r.id);
                                }}
                                className={btnDanger}
                              >
                                {t(locale, 'dashboard.proxyAdmin.delete')}
                              </button>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {!loading && rows.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => { setPage(p => p - 1); void load(page - 1, search); }}
                className={btnGhost}
              >
                Previous
              </button>
              <span className="text-sm text-fg-muted font-medium">Page {page} of {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => { setPage(p => p + 1); void load(page + 1, search); }}
                className={btnGhost}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
