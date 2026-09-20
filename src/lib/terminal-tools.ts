/* Небольшие рабочие «движки» для терминала: всё считается прямо в браузере. */

/* ───────────── hunt: юзернеймы ───────────── */

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type HuntProblem =
  | "length"
  | "chars"
  | "start"
  | "underscore-end"
  | "double-underscore";

export interface HuntResult {
  name: string;
  problem?: HuntProblem;
  rarity?: Rarity;
  score?: number;
  traits?: string[];
}

const VOWELS = "aeiouy";

/** Проверка по правилам Telegram + оценка «редкости» имени. Наличие имени она не проверяет. */
export function analyzeUsername(raw: string): HuntResult {
  const name = raw.trim().replace(/^@/, "");
  if (name.length < 5 || name.length > 32) return { name, problem: "length" };
  if (!/^[A-Za-z0-9_]+$/.test(name)) return { name, problem: "chars" };
  if (!/^[A-Za-z]/.test(name)) return { name, problem: "start" };
  if (name.endsWith("_")) return { name, problem: "underscore-end" };
  if (name.includes("__")) return { name, problem: "double-underscore" };

  const lower = name.toLowerCase();
  const traits: string[] = [];
  let score = 0;

  // Чем короче, тем ценнее
  const lenScore = Math.max(0, 12 - lower.length) * 6;
  score += lenScore;
  if (lower.length === 5) traits.push("len5");
  else if (lower.length <= 7) traits.push("short");

  if (/^[a-z]+$/.test(lower)) {
    score += 14;
    traits.push("letters");
  }
  if (!/[0-9_]/.test(lower)) score += 6;

  // Произносимость: чередование гласных и согласных
  let alt = 0;
  for (let i = 1; i < lower.length; i++) {
    if (VOWELS.includes(lower[i]) !== VOWELS.includes(lower[i - 1])) alt++;
  }
  if (alt / (lower.length - 1) > 0.8) {
    score += 18;
    traits.push("pronounceable");
  }

  if (lower === [...lower].reverse().join("")) {
    score += 20;
    traits.push("palindrome");
  }
  if (/(.)\1\1/.test(lower)) {
    score += 6;
    traits.push("repeat");
  }
  if (/\d{3,}$/.test(lower)) score -= 18;
  if (lower.includes("_")) score -= 10;

  score = Math.max(1, Math.min(100, Math.round(score)));
  const rarity: Rarity =
    score >= 80 ? "legendary" : score >= 60 ? "epic" : score >= 38 ? "rare" : "common";
  return { name, rarity, score, traits };
}

const CONS = "bcdfghjklmnprstvzkx";
const VOW = "aeiou";
const pick = (s: string) => s[Math.floor(Math.random() * s.length)];

/** Кандидаты «звучных» имён вроде CVCVC — от лучшего к худшему по оценке. */
export function generateCandidates(count = 6): string[] {
  const patterns = ["CVCVC", "CVCCV", "VCVCV", "CVVCV", "CVCVCV", "CVCCVC", "CVCVV"];
  const out = new Set<string>();
  while (out.size < count) {
    const p = patterns[Math.floor(Math.random() * patterns.length)];
    out.add([...p].map((c) => (c === "C" ? pick(CONS) : pick(VOW))).join(""));
  }
  return [...out].sort((a, b) => (analyzeUsername(b).score ?? 0) - (analyzeUsername(a).score ?? 0));
}

/* ───────────── scan: антифрод ───────────── */

export type ScanLevel = "safe" | "suspicious" | "dangerous";

export interface Signal {
  code: string;
  weight: number;
  /** Ключ для локализованного описания; `detail` подставляется в текст. */
  key:
    | "brand"
    | "lure"
    | "punycode"
    | "ip"
    | "tld"
    | "structure"
    | "shortener"
    | "apk"
    | "http"
    | "userinfo";
  detail?: string;
}

export interface ScanResult {
  input: string;
  host: string | null;
  score: number;
  level: ScanLevel;
  signals: Signal[];
}

/** бренд → настоящие домены */
const BRANDS: Record<string, string[]> = {
  click: ["click.uz"],
  payme: ["payme.uz"],
  uzcard: ["uzcard.uz"],
  humo: ["humocard.uz"],
  paynet: ["paynet.uz"],
  kapitalbank: ["kapitalbank.uz"],
  ipakyuli: ["ipakyulibank.uz"],
  telegram: ["telegram.org", "t.me", "telegram.me"],
  instagram: ["instagram.com"],
  facebook: ["facebook.com"],
  paypal: ["paypal.com"],
  apple: ["apple.com", "icloud.com"],
  google: ["google.com"],
  binance: ["binance.com"],
  ozon: ["ozon.ru"],
  sberbank: ["sberbank.ru", "sber.ru"],
  olx: ["olx.uz"],
};

const SUSPICIOUS_TLDS = new Set([
  "xyz", "top", "tk", "ml", "ga", "cf", "gq", "icu", "cyou", "work",
  "support", "zip", "mov", "buzz", "click", "loan", "rest",
]);
const SHORTENERS = new Set(["bit.ly", "t.co", "tinyurl.com", "cutt.ly", "is.gd", "rebrand.ly", "goo.gl"]);
const LURES = [
  "otp", "sms", "код", "kod", "parol", "пароль", "password", "verify", "подтверд",
  "tasdiq", "login", "secure", "confirm", "account", "bonus", "бонус", "gift",
  "подар", "sovg", "yutuq", "выигр", "prize", "urgent", "срочно", "блокир",
  "blocked", "bloklan", "card", "карт",
];

function twoLevel(host: string): string {
  const parts = host.split(".");
  const cc = ["co", "com", "org", "net", "gov"];
  if (parts.length >= 3 && cc.includes(parts[parts.length - 2]) && parts[parts.length - 1].length === 2) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

export function scanInput(input: string): ScanResult {
  const text = input.trim();
  const signals: Signal[] = [];

  const urlMatch = text.match(/(?:https?:\/\/)?[^\s/$.?#][^\s]*\.[^\s]{2,}/i);
  let host: string | null = null;
  let hasHttps = false;
  let path = "";
  let userinfo = false;

  if (urlMatch) {
    const candidate = /^https?:\/\//i.test(urlMatch[0]) ? urlMatch[0] : `http://${urlMatch[0]}`;
    try {
      const u = new URL(candidate);
      host = u.hostname.toLowerCase();
      hasHttps = /^https:/i.test(candidate);
      path = u.pathname + u.search;
      userinfo = !!(u.username || u.password);
      if (!/^https?:\/\//i.test(urlMatch[0])) hasHttps = false;
    } catch {
      host = null;
    }
  }

  const lowerAll = text.toLowerCase();
  const add = (s: Signal) => signals.push(s);

  if (host) {
    const registrable = twoLevel(host);
    const tld = host.split(".").pop() ?? "";

    // E01: бренд в адресе, но домен не настоящий
    for (const [brand, official] of Object.entries(BRANDS)) {
      if (host.includes(brand) && !official.some((d) => host === d || host.endsWith(`.${d}`))) {
        add({ code: "E01", weight: 38, key: "brand", detail: brand });
        break;
      }
    }
    if (host.includes("xn--")) add({ code: "E03", weight: 25, key: "punycode" });
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add({ code: "E04", weight: 30, key: "ip" });
    if (SUSPICIOUS_TLDS.has(tld) && registrable !== "click.uz") {
      add({ code: "E05", weight: 15, key: "tld", detail: `.${tld}` });
    }
    const hyphens = (registrable.match(/-/g) ?? []).length;
    if (hyphens >= 2 || host.split(".").length >= 5) {
      add({ code: "E06", weight: 10, key: "structure" });
    }
    if (SHORTENERS.has(registrable)) add({ code: "E07", weight: 10, key: "shortener" });
    if (/\.apk(\?|$)/i.test(path)) add({ code: "E08", weight: 30, key: "apk" });
    if (!hasHttps) add({ code: "E09", weight: 8, key: "http" });
    if (userinfo) add({ code: "E10", weight: 20, key: "userinfo" });
  }

  // E02: приманки в тексте (макс. два срабатывания)
  const lures = LURES.filter((w) => lowerAll.includes(w)).slice(0, 2);
  if (lures.length) {
    add({ code: "E02", weight: 15 * lures.length, key: "lure", detail: lures.join(", ") });
  }

  signals.sort((a, b) => a.code.localeCompare(b.code));
  const score = Math.min(100, signals.reduce((s, x) => s + x.weight, 0));
  const level: ScanLevel = score >= 55 ? "dangerous" : score >= 25 ? "suspicious" : "safe";
  return { input: text, host, score, level, signals };
}
