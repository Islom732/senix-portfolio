/* Утилиты для команд pass / hash / weather / neofetch. Всё выполняется в браузере. */

const LOWER = "abcdefghijkmnopqrstuvwxyz"; // без похожих l
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // без I и O
const DIGITS = "23456789"; // без 0 и 1
const SYMBOLS = "!@#$%^&*-_=+?";
const ALPHABET = LOWER + UPPER + DIGITS + SYMBOLS;

/** Равномерный случайный индекс без «смещения по модулю». */
function randomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

export function generatePassword(length: number): string {
  // гарантируем по одному символу каждого класса, остальное — из общего алфавита
  const chars = [LOWER, UPPER, DIGITS, SYMBOLS].map((set) => set[randomIndex(set.length)]);
  while (chars.length < length) chars.push(ALPHABET[randomIndex(ALPHABET.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1); // Фишер — Йейтс
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export const passwordEntropy = (length: number) =>
  Math.round(length * Math.log2(ALPHABET.length));

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function browserName(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "";
}

export function platformName(): string {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const ua = navigator.userAgent;
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  return nav.userAgentData?.platform || navigator.platform || "";
}

export interface Weather {
  city: string;
  country: string;
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  code: number;
}

export class WeatherError extends Error {
  constructor(public kind: "notFound" | "error") {
    super(kind);
  }
}

export async function fetchWeather(city: string, lang: string): Promise<Weather> {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=${lang}&format=json`,
    );
    if (!geoRes.ok) throw new WeatherError("error");
    const geo = (await geoRes.json()) as {
      results?: { name: string; country?: string; latitude: number; longitude: number }[];
    };
    const place = geo.results?.[0];
    if (!place) throw new WeatherError("notFound");

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
    );
    if (!res.ok) throw new WeatherError("error");
    const { current: c } = (await res.json()) as {
      current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        weather_code: number;
        wind_speed_10m: number;
      };
    };
    return {
      city: place.name,
      country: place.country ?? "",
      temp: Math.round(c.temperature_2m),
      feels: Math.round(c.apparent_temperature),
      humidity: Math.round(c.relative_humidity_2m),
      wind: Math.round(c.wind_speed_10m),
      code: c.weather_code,
    };
  } catch (e) {
    throw e instanceof WeatherError ? e : new WeatherError("error");
  }
}
