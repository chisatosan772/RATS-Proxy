import { c as createComponent } from './astro-component_B7obQc8D.mjs';
import 'piccolore';
import { l as createRenderInstruction, m as maybeRenderHead, r as renderTemplate, n as renderSlot, o as renderComponent, p as renderHead, h as addAttribute } from './entrypoint_D2_mp3Xr.mjs';
import 'clsx';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useLayoutEffect, useEffect, useCallback } from 'react';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="rats-theme-group flex items-center gap-1 rounded-xl glass-panel p-1" role="group" aria-label=""> <button type="button" class="rats-theme-btn min-h-touch min-w-touch rounded-lg px-2 text-lg transition-all hover:scale-105 hover:shadow-glow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" data-theme="galaxy" aria-pressed="false" aria-label="">
✦
</button> <button type="button" class="rats-theme-btn min-h-touch min-w-touch rounded-lg px-2 text-lg transition-all hover:scale-105 hover:shadow-glow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" data-theme="light" aria-pressed="false" aria-label="">
☀
</button> <button type="button" class="rats-theme-btn min-h-touch min-w-touch rounded-lg px-2 text-lg transition-all hover:scale-105 hover:shadow-glow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" data-theme="dark" aria-pressed="false" aria-label="">
☾
</button> </div> ${renderScript($$result, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/ThemeToggle.astro", void 0);

const $$LanguageSwitcher = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<label class="sr-only" for="rats-lang-select" id="rats-lang-label"></label> <select id="rats-lang-select" class="min-h-touch w-full max-w-[200px] cursor-pointer rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-2 text-sm font-medium text-fg shadow-inner backdrop-blur-md transition-all hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:max-w-none md:min-w-[160px]" aria-labelledby="rats-lang-label"> <option value="en"></option> <option value="id"></option> </select> ${renderScript($$result, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/LanguageSwitcher.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/LanguageSwitcher.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "RATS Proxy" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="theme-galaxy"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><title>", "</title><script>\n      (function () {\n        try {\n          var th = localStorage.getItem('theme') || 'galaxy';\n          if (['galaxy', 'light', 'dark'].indexOf(th) === -1) th = 'galaxy';\n          document.documentElement.classList.remove('theme-galaxy', 'theme-light', 'theme-dark');\n          document.documentElement.classList.add('theme-' + th);\n          var lg = localStorage.getItem('lang') || 'en';\n          if (lg !== 'en' && lg !== 'id') lg = 'en';\n          document.documentElement.setAttribute('data-lang', lg);\n          document.documentElement.lang = lg === 'id' ? 'id' : 'en';\n        } catch (e) {}\n      })();\n    <\/script>", "</head> <body> ", ' <div class="relative z-[1] flex min-h-screen flex-col"> <header class="flex flex-wrap items-center justify-between gap-3 p-4 md:items-center md:justify-between md:px-8"> <div class="flex min-h-touch items-center"> ', ' </div> <div class="flex w-full max-w-full flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center md:gap-4"> ', " ", ' </div> </header> <main class="flex flex-1 flex-col px-4 pb-12 pt-2 md:px-8"> ', " </main> </div> </body></html>"])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderSlot($$result, $$slots["background"]), renderSlot($$result, $$slots["header-left"]), renderComponent($$result, "ThemeToggle", $$ThemeToggle, {}), renderComponent($$result, "LanguageSwitcher", $$LanguageSwitcher, {}), renderSlot($$result, $$slots["default"]));
}, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/layouts/BaseLayout.astro", void 0);

const $$StarBackground = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<canvas id="rats-starfield" class="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true"></canvas> ${renderScript($$result, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/StarBackground.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/StarBackground.astro", void 0);

const $$GlassCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$GlassCard;
  const { class: className = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "glass-panel rounded-2xl p-6 shadow-glow-sm md:p-8",
    "animate-fade-in animate-slide-up",
    className
  ], "class:list")}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/GlassCard.astro", void 0);

const API_BASE_URL = ("");
const STORAGE_LANG = "lang";

class ApiError extends Error {
  constructor(kind, message, blockedUntil, retryAfterSeconds, serverError) {
    super(message);
    this.kind = kind;
    this.blockedUntil = blockedUntil;
    this.retryAfterSeconds = retryAfterSeconds;
    this.serverError = serverError;
    this.name = "ApiError";
  }
  kind;
  blockedUntil;
  retryAfterSeconds;
  serverError;
}
async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
function readRetryAfter(res, body) {
  const h = res.headers.get("Retry-After");
  if (h) {
    const n = parseInt(h, 10);
    if (!Number.isNaN(n)) return n;
  }
  if (body && typeof body === "object") {
    const o = body;
    if (typeof o.retry_after === "number") return o.retry_after;
    if (typeof o.retryAfter === "number") return o.retryAfter;
    if (typeof o.retry_after_seconds === "number") return o.retry_after_seconds;
  }
  return void 0;
}
function checkProxyErrorKind(msg) {
  const s = msg.toLowerCase();
  if (s.includes("invalid") && s.includes("uuid")) return "bad_request";
  if (s.includes("token") && (s.includes("expired") || s.includes("invalid"))) return "expired";
  return "check_proxy_error";
}
async function checkProxyRequest(uuid) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/checkProxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid })
    });
  } catch {
    throw new ApiError("network", "network");
  }
  const body = await parseJsonSafe(res);
  if (body && typeof body === "object") {
    const o = body;
    if (o.success === true && o.data && typeof o.data === "object") {
      const d = o.data;
      const remaining = Number(d.remainingTraffic ?? d.remaining ?? 0);
      const used = Number(d.useTraffic ?? d.usedTraffic ?? d.used ?? 0);
      return { remaining, used };
    }
    if (o.success === false && typeof o.error === "string") {
      const kind = checkProxyErrorKind(o.error);
      throw new ApiError(kind, kind, void 0, void 0, o.error);
    }
  }
  if (res.status === 429) {
    throw new ApiError("rate_limit", "rate_limit", void 0, readRetryAfter(res, body));
  }
  if (res.status === 404) {
    throw new ApiError("not_found", "not_found");
  }
  if (res.status === 401 || res.status === 403) {
    throw new ApiError("expired", "expired");
  }
  if (res.status === 400) {
    throw new ApiError("bad_request", "bad_request");
  }
  throw new ApiError("unknown", "unknown");
}
function parseProxyRegionRow(row) {
  if (!row || typeof row !== "object") return null;
  const o = row;
  const region = typeof o.region === "string" ? o.region.trim() : "";
  if (!region) return null;
  return {
    city: typeof o.city === "string" ? o.city : "",
    state: typeof o.state === "string" ? o.state : "",
    countryName: typeof o.countryName === "string" ? o.countryName : "",
    region
  };
}
async function getProxyRegionRequest(uuid) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/getProxyRegion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid })
    });
  } catch {
    throw new ApiError("network", "network");
  }
  const body = await parseJsonSafe(res);
  if (body && typeof body === "object") {
    const o = body;
    if (o.success === true && o.data != null) {
      const raw = o.data;
      const list = Array.isArray(raw) ? raw : [raw];
      return list.map(parseProxyRegionRow).filter((r) => r !== null);
    }
    if (o.success === false && typeof o.error === "string") {
      const kind = checkProxyErrorKind(o.error);
      throw new ApiError(kind, kind, void 0, void 0, o.error);
    }
  }
  if (res.status === 429) {
    throw new ApiError("rate_limit", "rate_limit", void 0, readRetryAfter(res, body));
  }
  if (res.status === 404) {
    throw new ApiError("not_found", "not_found");
  }
  if (res.status === 401 || res.status === 403) {
    throw new ApiError("expired", "expired");
  }
  if (res.status === 400) {
    throw new ApiError("bad_request", "bad_request");
  }
  throw new ApiError("unknown", "unknown");
}
async function createProxyRequest(uuid, country) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/createProxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, country })
    });
  } catch {
    throw new ApiError("network", "network");
  }
  const body = await parseJsonSafe(res);
  if (body && typeof body === "object") {
    const o = body;
    if (o.success === false && typeof o.error === "string") {
      const kind = checkProxyErrorKind(o.error);
      throw new ApiError(kind, kind, void 0, void 0, o.error);
    }
    if (o.success === true && o.data && typeof o.data === "object") {
      const d = o.data;
      if (typeof d.proxy === "string") return d.proxy;
      const host2 = d.host;
      const port2 = d.port;
      const username2 = d.username;
      const password2 = d.password;
      if (typeof host2 === "string" && (typeof port2 === "number" || typeof port2 === "string") && typeof username2 === "string" && typeof password2 === "string") {
        return `${host2}:${port2}:${username2}:${password2}`;
      }
    }
    if (typeof o.proxy === "string") return o.proxy;
    const host = o.host;
    const port = o.port;
    const username = o.username;
    const password = o.password;
    if (typeof host === "string" && (typeof port === "number" || typeof port === "string") && typeof username === "string" && typeof password === "string") {
      return `${host}:${port}:${username}:${password}`;
    }
  }
  if (res.ok) {
    throw new ApiError("create_proxy_error", "create_proxy_error");
  }
  if (res.status === 429) {
    throw new ApiError("rate_limit", "rate_limit", void 0, readRetryAfter(res, body));
  }
  if (res.status === 404) {
    throw new ApiError("not_found", "not_found");
  }
  if (res.status === 401 || res.status === 403) {
    throw new ApiError("expired", "expired");
  }
  throw new ApiError("unknown", "unknown");
}

const common$1 = {"appName":"RATS Proxy","retry":"Retry","close":"Close"};
const nav$1 = {"theme":"Theme","language":"Language"};
const theme$1 = {"galaxy":"Galaxy","light":"Light","dark":"Dark"};
const language$1 = {"en":"English","id":"Indonesian"};
const login$1 = {"title":"Sign in","subtitle":"Admin and user access","email":"Email","password":"Password","button":"Sign in","loading":"Signing in…","error":{"invalid":"Please enter a valid email and password.","credentials":"Invalid email or password.","blocked":"Too many failed attempts. Your IP is temporarily blocked.","blockedCountdown":"Try again in {{minutes}}m {{seconds}}s.","ratelimit":"Too many requests, please wait.","network":"Cannot connect to server."}};
const dashboard$1 = {"title":"Dashboard","subtitle":"You are signed in.","logout":"Sign out","roleAdmin":"Administrator","roleUser":"User","proxyAdmin":{"title":"Proxy management","subtitle":"Create, edit, or remove Owl proxy entries tied to customer accounts.","totalProxies":"{{count}} proxies","sectionAdd":"New proxy","sectionList":"Your proxies","accountsLabel":"Account (email)","accountsPlaceholder":"user@example.com","add":"Add proxy","creating":"Creating…","loading":"Loading proxies…","empty":"No proxies yet. Add one above.","errorLoad":"Could not load the proxy list.","errorNetwork":"Cannot connect to server.","errorCreate":"Could not create proxy. Check the account value.","errorUpdate":"Could not update this proxy.","errorDelete":"Could not delete this proxy.","errorNotFound":"That proxy no longer exists. List refreshed.","copyId":"Copy ID","copied":"Copied","edit":"Edit","save":"Save","saving":"Saving…","cancel":"Cancel","delete":"Delete","deleteConfirm":"Delete this proxy permanently?","deleteYes":"Yes, delete","deleteNo":"Cancel","deleting":"Deleting…","colId":"ID","colAccounts":"Accounts","colCreated":"Created","colUpdated":"Updated"}};
const proxy$1 = {"title":"Proxy quota","remaining":"Remaining traffic","used":"Used traffic","create":"Create proxy","creating":"Creating…","selectCountry":"Select country","selectRegion":"Select region","regionsEmpty":"No regions are available for this proxy.","result":"Your proxy","copy":"Copy","copied":"Copied","loading":"Loading quota…","error":{"invaliduuid":"This link does not contain a valid proxy ID.","notfound":"Proxy not found.","expired":"Session expired, proxy is inactive.","ratelimit":"Rate limited. Please try again later.","ratelimitRetry":"You can retry after {{seconds}} seconds.","network":"Cannot connect to server.","regionsFailed":"Could not load regions. Try again."},"supportInfo":"Supports SOCKS5, HTTP, and HTTPS protocols"};
const en = {
  common: common$1,
  nav: nav$1,
  theme: theme$1,
  language: language$1,
  login: login$1,
  dashboard: dashboard$1,
  proxy: proxy$1,
};

const common = {"appName":"RATS Proxy","retry":"Coba lagi","close":"Tutup"};
const nav = {"theme":"Tema","language":"Bahasa"};
const theme = {"galaxy":"Galaksi","light":"Terang","dark":"Gelap"};
const language = {"en":"English","id":"Bahasa Indonesia"};
const login = {"title":"Masuk","subtitle":"Akses admin dan pengguna","email":"Email","password":"Kata sandi","button":"Masuk","loading":"Memproses…","error":{"invalid":"Masukkan email dan kata sandi yang valid.","credentials":"Email atau kata sandi salah.","blocked":"Terlalu banyak percobaan gagal. IP Anda diblokir sementara.","blockedCountdown":"Coba lagi dalam {{minutes}}m {{seconds}}d.","ratelimit":"Terlalu banyak permintaan, harap tunggu.","network":"Tidak dapat terhubung ke server."}};
const dashboard = {"title":"Dasbor","subtitle":"Anda sudah masuk.","logout":"Keluar","roleAdmin":"Administrator","roleUser":"Pengguna","proxyAdmin":{"title":"Manajemen proxy","subtitle":"Buat, ubah, atau hapus entri proxy Owl yang terikat ke akun pelanggan.","totalProxies":"{{count}} proxy","sectionAdd":"Proxy baru","sectionList":"Daftar proxy","accountsLabel":"Akun (email)","accountsPlaceholder":"user@example.com","add":"Tambah proxy","creating":"Membuat…","loading":"Memuat daftar proxy…","empty":"Belum ada proxy. Tambahkan di atas.","errorLoad":"Gagal memuat daftar proxy.","errorNetwork":"Tidak dapat terhubung ke server.","errorCreate":"Gagal membuat proxy. Periksa nilai akun.","errorUpdate":"Gagal memperbarui proxy ini.","errorDelete":"Gagal menghapus proxy ini.","errorNotFound":"Proxy tidak ditemukan. Daftar diperbarui.","copyId":"Salin ID","copied":"Tersalin","edit":"Ubah","save":"Simpan","saving":"Menyimpan…","cancel":"Batal","delete":"Hapus","deleteConfirm":"Hapus proxy ini permanen?","deleteYes":"Ya, hapus","deleteNo":"Batal","deleting":"Menghapus…","colId":"ID","colAccounts":"Akun","colCreated":"Dibuat","colUpdated":"Diperbarui"}};
const proxy = {"title":"Kuota proxy","remaining":"Sisa trafik","used":"Trafik terpakai","create":"Buat proxy","creating":"Membuat…","selectCountry":"Pilih negara","selectRegion":"Pilih wilayah","regionsEmpty":"Tidak ada wilayah untuk proxy ini.","result":"Proxy Anda","copy":"Salin","copied":"Tersalin","loading":"Memuat kuota…","error":{"invaliduuid":"Tautan ini tidak berisi ID proxy yang valid.","notfound":"Proxy tidak ditemukan.","expired":"Sesi berakhir, proxy tidak aktif.","ratelimit":"Batas permintaan. Coba lagi nanti.","ratelimitRetry":"Anda bisa mencoba lagi setelah {{seconds}} detik.","network":"Tidak dapat terhubung ke server.","regionsFailed":"Gagal memuat wilayah. Coba lagi."},"supportInfo":"Mendukung protokol SOCKS5, HTTP, dan HTTPS"};
const id = {
  common,
  nav,
  theme,
  language,
  login,
  dashboard,
  proxy,
};

const translations = { en, id };
function getStoredLocale() {
  if (typeof window === "undefined") return "en";
  try {
    const v = localStorage.getItem(STORAGE_LANG);
    if (v === "id" || v === "en") return v;
  } catch {
  }
  return "en";
}
function getByPath(obj, path) {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur === null || typeof cur !== "object") return void 0;
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : void 0;
}
function t(locale, key, vars) {
  const table = translations[locale];
  let text = getByPath(table, key);
  if (text === void 0 && locale !== "en") {
    text = getByPath(translations.en, key);
  }
  if (text === void 0) return key;
  if (vars) {
    for (const [k, val] of Object.entries(vars)) {
      text = text.replaceAll(`{{${k}}}`, String(val));
    }
  }
  return text;
}

const UUID_RE = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
function messageForProxyApiError(locale, err) {
  if (err.serverError) {
    const se = err.serverError.toLowerCase();
    if (se.includes("invalid") && se.includes("uuid")) return t(locale, "proxy.error.invaliduuid");
    if (se.includes("token") && (se.includes("expired") || se.includes("invalid"))) {
      return t(locale, "proxy.error.expired");
    }
  }
  switch (err.kind) {
    case "network":
      return t(locale, "proxy.error.network");
    case "not_found":
      return t(locale, "proxy.error.notfound");
    case "expired":
      return t(locale, "proxy.error.expired");
    case "bad_request":
      return t(locale, "proxy.error.invaliduuid");
    case "rate_limit":
      return err.retryAfterSeconds != null && err.retryAfterSeconds > 0 ? `${t(locale, "proxy.error.ratelimit")} ${t(locale, "proxy.error.ratelimitRetry", { seconds: err.retryAfterSeconds })}` : t(locale, "proxy.error.ratelimit");
    default:
      return t(locale, "proxy.error.network");
  }
}
function ProxyChecker({ uuid }) {
  const [locale, setLocale] = useState("en");
  const [phase, setPhase] = useState("loading_quota");
  const [remaining, setRemaining] = useState(0);
  const [used, setUsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [regions, setRegions] = useState([]);
  const [regionsError, setRegionsError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [proxyLine, setProxyLine] = useState(null);
  const [copied, setCopied] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  useLayoutEffect(() => {
    setLocale(getStoredLocale());
  }, []);
  useEffect(() => {
    const onLang = () => setLocale(getStoredLocale());
    window.addEventListener("langchange", onLang);
    return () => window.removeEventListener("langchange", onLang);
  }, []);
  const selectedRegionCode = regions[selectedIndex]?.region ?? "";
  const loadQuota = useCallback(async () => {
    if (!UUID_RE.test(uuid)) {
      setPhase("invalid_uuid");
      return;
    }
    setPhase("loading_quota");
    setErrorMsg("");
    setProxyLine(null);
    setRegionsError(null);
    setRegions([]);
    setSelectedIndex(0);
    try {
      const r = await checkProxyRequest(uuid);
      setRemaining(r.remaining);
      setUsed(r.used);
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
          setRegionsError(t(loc, "proxy.error.regionsFailed"));
        }
        setRegions([]);
      }
      setPhase("quota");
    } catch (e) {
      const loc = getStoredLocale();
      if (e instanceof ApiError) {
        setErrorMsg(messageForProxyApiError(loc, e));
      } else {
        setErrorMsg(t(loc, "proxy.error.network"));
      }
      setPhase("error");
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
        setRegionsError(t(locale, "proxy.error.regionsFailed"));
      }
      setRegions([]);
    }
  };
  const onCreate = async () => {
    if (!UUID_RE.test(uuid) || !selectedRegionCode) return;
    setProxyLine(null);
    setPhase("creating");
    setErrorMsg("");
    try {
      const line = await createProxyRequest(uuid, selectedRegionCode.trim().toUpperCase());
      setProxyLine(line);
      setPhase("result");
      setSuccessPulse(true);
      setTimeout(() => setSuccessPulse(false), 700);
    } catch (e) {
      const loc = getStoredLocale();
      if (e instanceof ApiError) {
        setErrorMsg(messageForProxyApiError(loc, e));
      } else {
        setErrorMsg(t(loc, "proxy.error.network"));
      }
      setPhase("error");
    }
  };
  const onCopy = async () => {
    if (!proxyLine) return;
    try {
      await navigator.clipboard.writeText(proxyLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
    }
  };
  const totalTraffic = Math.max(remaining + used, 1);
  const pctRemaining = Math.min(100, Math.round(remaining / totalTraffic * 100));
  const canCreate = regions.length > 0 && selectedRegionCode.length > 0;
  if (phase === "invalid_uuid") {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-lg flex-col gap-4 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-fg md:text-2xl", children: t(locale, "proxy.title") }),
      /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-4 text-sm text-[var(--color-error)]", children: t(locale, "proxy.error.invaliduuid") })
    ] });
  }
  if (phase === "error") {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-fg md:text-2xl", children: t(locale, "proxy.title") }),
      /* @__PURE__ */ jsx("p", { className: "w-full rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-4 text-sm text-[var(--color-error)]", children: errorMsg }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => void loadQuota(),
          className: "min-h-touch min-w-touch rounded-xl bg-gradient-to-r from-accent via-accent-2 to-accent px-6 py-3 font-semibold text-white shadow-glow transition-all hover:scale-[1.02] hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
          children: t(locale, "common.retry")
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-3xl flex-col gap-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-fg md:text-3xl", children: t(locale, "proxy.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-fg-muted/80", children: t(locale, "proxy.supportInfo") })
    ] }),
    phase === "loading_quota" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 animate-pulse", "aria-busy": "true", role: "status", children: [
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: t(locale, "proxy.loading") }),
      /* @__PURE__ */ jsx("div", { className: "h-10 w-2/3 self-center rounded-xl bg-fg-muted/20" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 w-full rounded-lg bg-fg-muted/15" }),
      /* @__PURE__ */ jsx("div", { className: "h-24 w-full rounded-2xl bg-fg-muted/15" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-fg-muted", children: t(locale, "proxy.remaining") }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-2xl font-bold text-fg", children: [
            remaining,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-fg-muted", children: "MB" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 h-3 w-full overflow-hidden rounded-full bg-fg-muted/20", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500",
              style: { width: `${pctRemaining}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-fg-muted", children: t(locale, "proxy.used") }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-2xl font-bold text-fg", children: [
            used,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-fg-muted", children: "MB" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 h-3 w-full overflow-hidden rounded-full bg-fg-muted/20", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500",
              style: { width: `${100 - pctRemaining}%` }
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel flex flex-col gap-4 rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-fg-muted", children: t(locale, "proxy.selectRegion") }),
          regionsError ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => void reloadRegionsOnly(),
              className: "text-sm font-semibold text-accent underline-offset-2 hover:underline",
              children: t(locale, "common.retry")
            }
          ) : null
        ] }),
        regionsError ? /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-[var(--color-error)]/35 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]", children: regionsError }) : null,
        regions.length === 0 && !regionsError ? /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-dashed border-glass-border px-4 py-6 text-center text-sm text-fg-muted", children: t(locale, "proxy.regionsEmpty") }) : /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "select",
            {
              value: selectedIndex,
              onChange: (e) => setSelectedIndex(Number(e.target.value)),
              disabled: phase === "creating",
              className: "w-full appearance-none rounded-xl border border-glass-border bg-[var(--color-input-bg)] px-4 py-3 pr-10 text-sm text-fg transition-all hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 min-h-touch cursor-pointer",
              children: (() => {
                const seen = /* @__PURE__ */ new Set();
                return regions.map((reg, i) => {
                  const displayName = reg.countryName || reg.region;
                  if (seen.has(displayName)) return null;
                  seen.add(displayName);
                  return /* @__PURE__ */ jsx("option", { value: i, children: displayName }, `${reg.region}-${reg.city}-${reg.state}-${i}`);
                });
              })()
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-fg-muted", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 fill-current", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" }) }) })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => void onCreate(),
            disabled: phase === "creating" || !canCreate,
            className: "min-h-touch w-full rounded-xl bg-gradient-to-r from-accent via-accent-2 to-accent px-5 py-3 font-semibold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
            children: phase === "creating" ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white",
                  "aria-hidden": true
                }
              ),
              t(locale, "proxy.creating")
            ] }) : t(locale, "proxy.create")
          }
        )
      ] }),
      phase === "result" && proxyLine ? /* @__PURE__ */ jsxs(
        "div",
        {
          className: `glass-panel rounded-2xl p-5 transition-transform duration-300 ${successPulse ? "scale-[1.02] shadow-glow" : ""}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-fg-muted", children: t(locale, "proxy.result") }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-col gap-3 sm:flex-row sm:items-center", children: [
              /* @__PURE__ */ jsx("code", { className: "flex-1 break-all rounded-xl bg-[var(--color-input-bg)] px-4 py-3 text-sm text-fg", children: proxyLine }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => void onCopy(),
                  className: "min-h-touch shrink-0 rounded-xl border border-glass-border px-5 py-3 text-sm font-semibold text-fg transition-all hover:border-accent hover:shadow-glow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                  children: copied ? t(locale, "proxy.copied") : t(locale, "proxy.copy")
                }
              )
            ] })
          ]
        }
      ) : null
    ] })
  ] });
}

const $$uuid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$uuid;
  const { uuid } = Astro2.params;
  const id = uuid ?? "";
  const UUID_RE = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
  const isValidUuid = UUID_RE.test(id);
  if (!isValidUuid && Astro2.response) {
    Astro2.response.status = 404;
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": isValidUuid ? "RATS Proxy" : "404 Not Found" }, { "background": ($$result2) => renderTemplate`${renderComponent($$result2, "StarBackground", $$StarBackground, { "slot": "background" })}`, "default": ($$result2) => renderTemplate`   ${maybeRenderHead()}<div class="flex flex-1 items-start justify-center pt-2 md:items-center md:pt-0"> ${isValidUuid ? renderTemplate`${renderComponent($$result2, "GlassCard", $$GlassCard, { "class": "w-full max-w-3xl" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ProxyChecker", ProxyChecker, { "client:load": true, "uuid": id, "client:component-hydration": "load", "client:component-path": "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/components/ProxyChecker", "client:component-export": "default" })} ` })}` : renderTemplate`<div class="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center mt-12 md:mt-0"> <h1 class="text-[6rem] leading-none font-bold bg-gradient-to-br from-[var(--color-error)] to-accent-2 bg-clip-text text-transparent drop-shadow-glow md:text-[8rem]">404</h1> <p class="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-6 py-4 text-lg text-fg shadow-glow">
Halaman tidak ditemukan
</p> </div>`} </div> `, "header-left": ($$result2) => renderTemplate`<span class="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-lg font-bold text-transparent md:text-xl" data-i18n="common.appName"></span>` })}`;
}, "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/pages/[uuid].astro", void 0);

const $$file = "C:/Users/agusb_s3yp95p/OneDrive/Documents/Project Website/RATS-Proxy/src/pages/[uuid].astro";
const $$url = "/[uuid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$uuid,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
