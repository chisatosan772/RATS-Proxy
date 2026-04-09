import { getAccessToken } from './auth';
import { API_BASE_URL } from './constants';

export type LoginUser = {
  id: string;
  nama?: string;
  email: string;
  role: string;
};

export type LoginSuccessBody = {
  access_token: string;
  refresh_token: string;
  user?: LoginUser;
};

export type ApiErrorKind =
  | 'invalid_credentials'
  | 'blocked'
  | 'rate_limit'
  | 'network'
  | 'not_found'
  | 'expired'
  | 'bad_request'
  | 'check_proxy_error'
  | 'create_proxy_error'
  | 'unknown';

export class ApiError extends Error {
  constructor(
    public kind: ApiErrorKind,
    message: string,
    public blockedUntil?: number,
    public retryAfterSeconds?: number,
    /** Server `error` string from Owl API (`success: false`) */
    public serverError?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function readRetryAfter(res: Response, body: unknown): number | undefined {
  const h = res.headers.get('Retry-After');
  if (h) {
    const n = parseInt(h, 10);
    if (!Number.isNaN(n)) return n;
  }
  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    if (typeof o.retry_after === 'number') return o.retry_after;
    if (typeof o.retryAfter === 'number') return o.retryAfter;
    if (typeof o.retry_after_seconds === 'number') return o.retry_after_seconds;
  }
  return undefined;
}

function readBlockedUntil(body: unknown): number | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const o = body as Record<string, unknown>;
  if (typeof o.blocked_until === 'number') {
    return o.blocked_until < 1e12 ? o.blocked_until * 1000 : o.blocked_until;
  }
  if (typeof o.blockedUntil === 'string') {
    const t = Date.parse(o.blockedUntil);
    if (!Number.isNaN(t)) return t;
  }
  if (typeof o.blocked_until === 'string') {
    const t = Date.parse(o.blocked_until);
    if (!Number.isNaN(t)) return t;
  }
  return undefined;
}

function extractTokensFromObject(o: Record<string, unknown>): { access: string; refresh: string } | null {
  const access = o.access_token ?? o.accessToken;
  const refresh = o.refresh_token ?? o.refreshToken;
  if (typeof access === 'string' && typeof refresh === 'string' && access.length > 0 && refresh.length > 0) {
    return { access, refresh };
  }
  return null;
}

function parseLoginUser(raw: unknown): LoginUser | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const u = raw as Record<string, unknown>;
  const id = u.id != null ? String(u.id) : '';
  const email = u.email != null ? String(u.email) : '';
  const role = u.role != null ? String(u.role) : 'user';
  if (!email && !id) return undefined;
  return {
    id: id || email,
    email: email || id,
    role,
    nama: typeof u.nama === 'string' ? u.nama : undefined,
  };
}

/** Supports root, `{ data: { ... } }`, `{ success, data }`, and `{ session }` shapes. */
function parseLoginSuccessBody(body: Record<string, unknown>): LoginSuccessBody | null {
  const fromTokens = (access: string, refresh: string, userRaw: unknown) =>
    ({
      access_token: access,
      refresh_token: refresh,
      user: parseLoginUser(userRaw),
    }) satisfies LoginSuccessBody;

  const root = extractTokensFromObject(body);
  if (root) {
    return fromTokens(root.access, root.refresh, body.user);
  }

  if (body.session && typeof body.session === 'object') {
    const t = extractTokensFromObject(body.session as Record<string, unknown>);
    if (t) return fromTokens(t.access, t.refresh, body.user);
  }

  const data = body.data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    const nested = extractTokensFromObject(d);
    if (nested) return fromTokens(nested.access, nested.refresh, d.user ?? body.user);
  }

  return null;
}

export async function loginRequest(email: string, password: string): Promise<LoginSuccessBody> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);

  if (res.ok && body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    const parsed = parseLoginSuccessBody(o);
    if (parsed) return parsed;
    if (o.success === false) {
      throw new ApiError('invalid_credentials', 'invalid_credentials');
    }
  }

  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }

  if (res.status === 403) {
    const until = readBlockedUntil(body);
    if (until !== undefined) {
      throw new ApiError('blocked', 'blocked', until);
    }
    const errText =
      body && typeof body === 'object' && typeof (body as Record<string, unknown>).error === 'string'
        ? String((body as Record<string, unknown>).error).toLowerCase()
        : '';
    if (errText.includes('block') || errText.includes('abuse')) {
      throw new ApiError('blocked', 'blocked', Date.now() + 30 * 60 * 1000);
    }
  }

  if (res.status === 401 || res.status === 400) {
    throw new ApiError('invalid_credentials', 'invalid_credentials');
  }

  const code =
    body && typeof body === 'object' && typeof (body as Record<string, unknown>).code === 'string'
      ? String((body as Record<string, unknown>).code)
      : '';
  if (code === 'IP_BLOCKED' || code === 'BLOCKED') {
    const until = readBlockedUntil(body) ?? Date.now() + 30 * 60 * 1000;
    throw new ApiError('blocked', 'blocked', until);
  }

  throw new ApiError('unknown', 'unknown');
}

/** Matches documented `POST /api/checkProxy` success payload */
export type CheckProxyResult = {
  remaining: number;
  used: number;
};

function checkProxyErrorKind(msg: string): ApiError['kind'] {
  const s = msg.toLowerCase();
  if (s.includes('invalid') && s.includes('uuid')) return 'bad_request';
  if (s.includes('token') && (s.includes('expired') || s.includes('invalid'))) return 'expired';
  return 'check_proxy_error';
}

export async function checkProxyRequest(uuid: string): Promise<CheckProxyResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/checkProxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid }),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);

  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    if (o.success === true && o.data && typeof o.data === 'object') {
      const d = o.data as Record<string, unknown>;
      const remaining = Number(d.remainingTraffic ?? d.remaining ?? 0);
      const used = Number(d.useTraffic ?? d.usedTraffic ?? d.used ?? 0);
      return { remaining, used };
    }
    if (o.success === false && typeof o.error === 'string') {
      const kind = checkProxyErrorKind(o.error);
      throw new ApiError(kind, kind, undefined, undefined, o.error);
    }
  }

  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }

  if (res.status === 404) {
    throw new ApiError('not_found', 'not_found');
  }

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('expired', 'expired');
  }

  if (res.status === 400) {
    throw new ApiError('bad_request', 'bad_request');
  }

  throw new ApiError('unknown', 'unknown');
}

export type ProxyRegion = {
  city: string;
  state: string;
  countryName: string;
  region: string;
};

function parseProxyRegionRow(row: unknown): ProxyRegion | null {
  if (!row || typeof row !== 'object') return null;
  const o = row as Record<string, unknown>;
  const region = typeof o.region === 'string' ? o.region.trim() : '';
  if (!region) return null;
  return {
    city: typeof o.city === 'string' ? o.city : '',
    state: typeof o.state === 'string' ? o.state : '',
    countryName: typeof o.countryName === 'string' ? o.countryName : '',
    region,
  };
}

/** `POST /api/getProxyRegion` — Owl Proxy region list for a UUID (public). */
export async function getProxyRegionRequest(uuid: string): Promise<ProxyRegion[]> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/getProxyRegion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid }),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);

  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    if (o.success === true && o.data != null) {
      const raw = o.data;
      const list = Array.isArray(raw) ? raw : [raw];
      return list
        .map(parseProxyRegionRow)
        .filter((r): r is ProxyRegion => r !== null);
    }
    if (o.success === false && typeof o.error === 'string') {
      const kind = checkProxyErrorKind(o.error);
      throw new ApiError(kind, kind, undefined, undefined, o.error);
    }
  }

  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }
  if (res.status === 404) {
    throw new ApiError('not_found', 'not_found');
  }
  if (res.status === 401 || res.status === 403) {
    throw new ApiError('expired', 'expired');
  }
  if (res.status === 400) {
    throw new ApiError('bad_request', 'bad_request');
  }

  throw new ApiError('unknown', 'unknown');
}

/** Documented: `POST /api/createProxy` with `{ uuid, country }` */
export async function createProxyRequest(uuid: string, country: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/createProxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, country }),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);

  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    if (o.success === false && typeof o.error === 'string') {
      const kind = checkProxyErrorKind(o.error);
      throw new ApiError(kind, kind, undefined, undefined, o.error);
    }
    if (o.success === true && o.data && typeof o.data === 'object') {
      const d = o.data as Record<string, unknown>;
      if (typeof d.proxy === 'string') return d.proxy;
      const host = d.host;
      const port = d.port;
      const username = d.username;
      const password = d.password;
      if (
        typeof host === 'string' &&
        (typeof port === 'number' || typeof port === 'string') &&
        typeof username === 'string' &&
        typeof password === 'string'
      ) {
        return `${host}:${port}:${username}:${password}`;
      }
    }
    if (typeof o.proxy === 'string') return o.proxy;
    const host = o.host;
    const port = o.port;
    const username = o.username;
    const password = o.password;
    if (
      typeof host === 'string' &&
      (typeof port === 'number' || typeof port === 'string') &&
      typeof username === 'string' &&
      typeof password === 'string'
    ) {
      return `${host}:${port}:${username}:${password}`;
    }
  }

  if (res.ok) {
    throw new ApiError('create_proxy_error', 'create_proxy_error');
  }

  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }

  if (res.status === 404) {
    throw new ApiError('not_found', 'not_found');
  }

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('expired', 'expired');
  }

  throw new ApiError('unknown', 'unknown');
}

// --- Admin: Proxy management (`GET/POST /api/proxy`, Bearer required) ---

export type AdminProxyRow = {
  id: string;
  accounts: string;
  user_id?: string;
  token?: string;
  created_at?: string;
  updated_at?: string;
};

function adminAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError('expired', 'expired');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function adminListProxies(): Promise<AdminProxyRow[]> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/proxy`, {
      headers: adminAuthHeaders(),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);

  if (res.ok && body && typeof body === 'object') {
    const data = (body as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data
        .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === 'object')
        .map((row) => ({
          id: String(row.id ?? ''),
          accounts: String(row.accounts ?? ''),
          user_id: row.user_id != null ? String(row.user_id) : undefined,
          token: typeof row.token === 'string' ? row.token : undefined,
          created_at: typeof row.created_at === 'string' ? row.created_at : undefined,
          updated_at: typeof row.updated_at === 'string' ? row.updated_at : undefined,
        }))
        .filter((r) => r.id.length > 0);
    }
  }

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('expired', 'expired');
  }
  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }

  throw new ApiError('unknown', 'unknown');
}

export async function adminCreateProxy(accounts: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/proxy`, {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: JSON.stringify({ accounts: accounts.trim() }),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);

  if (res.ok) return;

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('expired', 'expired');
  }
  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }
  if (res.status === 400) {
    throw new ApiError('bad_request', 'bad_request');
  }

  throw new ApiError('unknown', 'unknown');
}

function adminBearerOnly(): HeadersInit {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError('expired', 'expired');
  }
  return { Authorization: `Bearer ${token}` };
}

export async function adminUpdateProxy(id: string, accounts: string): Promise<void> {
  const encoded = encodeURIComponent(id);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/proxy/${encoded}`, {
      method: 'PUT',
      headers: adminAuthHeaders(),
      body: JSON.stringify({ accounts: accounts.trim() }),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);
  if (res.ok) return;

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('expired', 'expired');
  }
  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }
  if (res.status === 400 || res.status === 404) {
    throw new ApiError('bad_request', 'bad_request');
  }

  throw new ApiError('unknown', 'unknown');
}

export async function adminDeleteProxy(id: string): Promise<void> {
  const encoded = encodeURIComponent(id);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/proxy/${encoded}`, {
      method: 'DELETE',
      headers: adminBearerOnly(),
    });
  } catch {
    throw new ApiError('network', 'network');
  }

  const body = await parseJsonSafe(res);
  if (res.ok) return;

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('expired', 'expired');
  }
  if (res.status === 429) {
    throw new ApiError('rate_limit', 'rate_limit', undefined, readRetryAfter(res, body));
  }
  if (res.status === 404) {
    throw new ApiError('not_found', 'not_found');
  }

  throw new ApiError('unknown', 'unknown');
}
