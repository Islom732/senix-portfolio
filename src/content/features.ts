import type { Locale } from "./site";

export type BriefKind = "site" | "bot" | "app" | "other";

export interface FeatureStrings {
  brief: {
    title: string;
    sub: string;
    kindLabel: string;
    kinds: Record<BriefKind, string>;
    name: string;
    namePh: string;
    message: string;
    messagePh: string;
    open: string;
    copy: string;
    copied: string;
    hint: string;
    template: (p: { name: string; kind: string; message: string }) => string;
  };
  like: { label: (title: string) => string };
  share: { label: string; copied: string };
  dots: { top: string; playground: string; nav: string };
  ex: {
    help: { cmd: string; desc: string }[];
    pass: {
      usage: string;
      strength: [string, string, string, string];
      info: (len: number, bits: number, label: string) => string;
      note: string;
    };
    hash: { usage: string; note: string };
    weather: {
      usage: string;
      loading: string;
      notFound: string;
      error: string;
      line: (city: string, country: string) => string;
      stats: (t: number, feels: string, hum: number, wind: number) => string;
      note: string;
      /** Описание по коду WMO */
      code: (c: number) => string;
    };
    neofetch: {
      os: string;
      browser: string;
      screen: string;
      lang: string;
      tz: string;
      theme: string;
      session: string;
      visitors: string;
      unknown: string;
    };
  };
}

const wmoGroup = (c: number): "clear" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm" => {
  if (c === 0) return "clear";
  if (c <= 3) return "cloud";
  if (c <= 48) return "fog";
  if (c <= 57) return "drizzle";
  if (c <= 67 || (c >= 80 && c <= 82)) return "rain";
  if (c <= 77 || c === 85 || c === 86) return "snow";
  return "storm";
};

const icons = { clear: "☀️", cloud: "⛅", fog: "🌫️", drizzle: "🌦️", rain: "🌧️", snow: "❄️", storm: "⛈️" };

const wmo = (names: Record<ReturnType<typeof wmoGroup>, string>) => (c: number) => {
  const g = wmoGroup(c);
  return `${icons[g]} ${names[g]}`;
};

const ru: FeatureStrings = {
  brief: {
    title: "Или опишите задачу",
    sub: "Соберу сообщение и открою чат в Telegram — останется нажать «Отправить».",
    kindLabel: "Что нужно",
    kinds: { site: "Сайт", bot: "Telegram-бот", app: "Приложение", other: "Другое" },
    name: "Как к вам обращаться",
    namePh: "Имя",
    message: "Задача",
    messagePh: "Коротко: что нужно сделать и к какому сроку",
    open: "Открыть в Telegram",
    copy: "Скопировать",
    copied: "Скопировано ✓",
    hint: "Если текст не подставился в чат, нажмите «Скопировать» и вставьте вручную.",
    template: ({ name, kind, message }) =>
      `Здравствуйте${name ? `, я ${name}` : ""}! Хочу заказать: ${kind}.\n\n${message || "(опишу подробнее в чате)"}\n\n— с сайта-портфолио`,
  },
  like: { label: (t) => `Нравится проект ${t}` },
  share: { label: "Поделиться", copied: "Ссылка скопирована ✓" },
  dots: { top: "Начало", playground: "Песочница", nav: "Разделы страницы" },
  ex: {
    help: [
      { cmd: "pass [длина]", desc: "надёжный пароль (8–64 символа)" },
      { cmd: "hash <текст>", desc: "SHA-256 хэш текста" },
      { cmd: "weather <город>", desc: "погода сейчас (Open-Meteo)" },
      { cmd: "neofetch", desc: "что сайт знает о твоём устройстве" },
    ],
    pass: {
      usage: "использование: pass [длина от 8 до 64], например pass 20",
      strength: ["слабый", "средний", "хороший", "отличный"],
      info: (len, bits, label) => `длина ${len} · энтропия ≈ ${bits} бит — ${label}`,
      note: "Создан в твоём браузере и никуда не отправляется.",
    },
    hash: { usage: "использование: hash <текст>", note: "SHA-256, считается прямо в браузере." },
    weather: {
      usage: "использование: weather Tashkent",
      loading: "запрашиваю погоду…",
      notFound: "город не найден.",
      error: "сервис погоды сейчас недоступен.",
      line: (c, k) => `${c}${k ? `, ${k}` : ""}`,
      stats: (t, f, h, w) => `${t}°C (ощущается ${f}°) · влажность ${h}% · ветер ${w} км/ч`,
      note: "Данные: Open-Meteo.",
      code: wmo({ clear: "ясно", cloud: "облачно", fog: "туман", drizzle: "морось", rain: "дождь", snow: "снег", storm: "гроза" }),
    },
    neofetch: {
      os: "Система", browser: "Браузер", screen: "Экран", lang: "Языки браузера",
      tz: "Часовой пояс", theme: "Тема", session: "На сайте", visitors: "Посетителей", unknown: "неизвестно",
    },
  },
};

const en: FeatureStrings = {
  brief: {
    title: "Or describe your task",
    sub: "I'll compose the message and open a Telegram chat — you just hit Send.",
    kindLabel: "What you need",
    kinds: { site: "Website", bot: "Telegram bot", app: "App", other: "Other" },
    name: "What should I call you",
    namePh: "Name",
    message: "Task",
    messagePh: "Briefly: what needs to be done and by when",
    open: "Open in Telegram",
    copy: "Copy",
    copied: "Copied ✓",
    hint: "If the text didn't appear in the chat, press Copy and paste it manually.",
    template: ({ name, kind, message }) =>
      `Hello${name ? `, I'm ${name}` : ""}! I'd like to order: ${kind}.\n\n${message || "(I'll explain in the chat)"}\n\n— sent from your portfolio`,
  },
  like: { label: (t) => `Like the ${t} project` },
  share: { label: "Share", copied: "Link copied ✓" },
  dots: { top: "Top", playground: "Playground", nav: "Page sections" },
  ex: {
    help: [
      { cmd: "pass [length]", desc: "strong password (8–64 chars)" },
      { cmd: "hash <text>", desc: "SHA-256 hash of text" },
      { cmd: "weather <city>", desc: "weather right now (Open-Meteo)" },
      { cmd: "neofetch", desc: "what the site knows about your device" },
    ],
    pass: {
      usage: "usage: pass [length 8 to 64], e.g. pass 20",
      strength: ["weak", "fair", "good", "excellent"],
      info: (len, bits, label) => `length ${len} · entropy ≈ ${bits} bits — ${label}`,
      note: "Generated in your browser and never sent anywhere.",
    },
    hash: { usage: "usage: hash <text>", note: "SHA-256, computed right in your browser." },
    weather: {
      usage: "usage: weather Tashkent",
      loading: "fetching the weather…",
      notFound: "city not found.",
      error: "the weather service is unavailable right now.",
      line: (c, k) => `${c}${k ? `, ${k}` : ""}`,
      stats: (t, f, h, w) => `${t}°C (feels like ${f}°) · humidity ${h}% · wind ${w} km/h`,
      note: "Data: Open-Meteo.",
      code: wmo({ clear: "clear", cloud: "cloudy", fog: "fog", drizzle: "drizzle", rain: "rain", snow: "snow", storm: "thunderstorm" }),
    },
    neofetch: {
      os: "System", browser: "Browser", screen: "Screen", lang: "Browser languages",
      tz: "Time zone", theme: "Theme", session: "Time on site", visitors: "Visitors", unknown: "unknown",
    },
  },
};

const uz: FeatureStrings = {
  brief: {
    title: "Yoki vazifani tasvirlab bering",
    sub: "Xabarni tayyorlab, Telegram chatini ochaman — «Yuborish»ni bosish qoladi.",
    kindLabel: "Nima kerak",
    kinds: { site: "Sayt", bot: "Telegram-bot", app: "Ilova", other: "Boshqa" },
    name: "Sizga qanday murojaat qilay",
    namePh: "Ism",
    message: "Vazifa",
    messagePh: "Qisqacha: nima qilish kerak va qachonga",
    open: "Telegram'da ochish",
    copy: "Nusxa olish",
    copied: "Nusxa olindi ✓",
    hint: "Agar matn chatga qo'yilmasa, «Nusxa olish»ni bosib, o'zingiz joylashtiring.",
    template: ({ name, kind, message }) =>
      `Assalomu alaykum${name ? `, men ${name}` : ""}! Buyurtma bermoqchiman: ${kind}.\n\n${message || "(chatda batafsil yozaman)"}\n\n— portfolio saytidan`,
  },
  like: { label: (t) => `${t} loyihasi yoqdi` },
  share: { label: "Ulashish", copied: "Havola nusxalandi ✓" },
  dots: { top: "Boshi", playground: "Sinov maydoni", nav: "Sahifa bo'limlari" },
  ex: {
    help: [
      { cmd: "pass [uzunlik]", desc: "ishonchli parol (8–64 belgi)" },
      { cmd: "hash <matn>", desc: "matnning SHA-256 xeshi" },
      { cmd: "weather <shahar>", desc: "hozirgi ob-havo (Open-Meteo)" },
      { cmd: "neofetch", desc: "sayt qurilmangiz haqida nimani biladi" },
    ],
    pass: {
      usage: "ishlatilishi: pass [uzunlik 8 dan 64 gacha], masalan pass 20",
      strength: ["zaif", "o'rtacha", "yaxshi", "a'lo"],
      info: (len, bits, label) => `uzunligi ${len} · entropiya ≈ ${bits} bit — ${label}`,
      note: "Brauzeringizda yaratildi va hech qayerga yuborilmaydi.",
    },
    hash: { usage: "ishlatilishi: hash <matn>", note: "SHA-256, to'g'ridan-to'g'ri brauzerda hisoblanadi." },
    weather: {
      usage: "ishlatilishi: weather Tashkent",
      loading: "ob-havo so'ralmoqda…",
      notFound: "shahar topilmadi.",
      error: "ob-havo xizmati hozir mavjud emas.",
      line: (c, k) => `${c}${k ? `, ${k}` : ""}`,
      stats: (t, f, h, w) => `${t}°C (his qilinishi ${f}°) · namlik ${h}% · shamol ${w} km/soat`,
      note: "Ma'lumot: Open-Meteo.",
      code: wmo({ clear: "ochiq", cloud: "bulutli", fog: "tuman", drizzle: "mayda yomg'ir", rain: "yomg'ir", snow: "qor", storm: "momaqaldiroq" }),
    },
    neofetch: {
      os: "Tizim", browser: "Brauzer", screen: "Ekran", lang: "Brauzer tillari",
      tz: "Vaqt mintaqasi", theme: "Mavzu", session: "Saytda", visitors: "Tashriflar", unknown: "noma'lum",
    },
  },
};

export const featureStrings: Record<Locale, FeatureStrings> = { ru, en, uz };
