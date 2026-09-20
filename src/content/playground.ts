import type { Locale } from "./site";

export interface PlaygroundStrings {
  eyebrow: string;
  title: [string, string];
  lead: string;
  live: string;
  scan: {
    title: string;
    sub: string;
    label: string;
    placeholder: string;
    presets: string;
    score: string;
    empty: string;
  };
  hunt: {
    title: string;
    sub: string;
    label: string;
    placeholder: string;
    generate: string;
    legend: string;
    pick: string;
    empty: string;
  };
}

/** Значения примеров не зависят от языка. */
export const scanPresets = [
  "https://click.uz/pay",
  "http://click-uz-bonus.xyz/login — введите код из SMS",
  "https://payme-secure.top/app.apk",
];

const ru: PlaygroundStrings = {
  eyebrow: "Песочница",
  title: ["Потрогай", "руками."],
  lead: "Мои боты живут в Telegram, но их мозги можно попробовать прямо здесь. Всё считается у тебя в браузере.",
  live: "считается на лету",
  scan: {
    title: "Антифрод-сканер",
    sub: "Мини-версия Kiber Yordamchi: вставь ссылку или текст сообщения.",
    label: "Ссылка или сообщение",
    placeholder: "https://…",
    presets: "Попробуй:",
    score: "Risk Score",
    empty: "Вставь ссылку — и я покажу, что в ней не так.",
  },
  hunt: {
    title: "Охотник за юзернеймами",
    sub: "Формат по правилам Telegram и оценка редкости — как в KravlezSearch.",
    label: "Юзернейм",
    placeholder: "например, xzboq",
    generate: "Сгенерировать",
    legend: "Шкала редкости",
    pick: "Нажми на имя, чтобы проверить:",
    empty: "Введи имя — оценю формат и редкость.",
  },
};

const en: PlaygroundStrings = {
  eyebrow: "Playground",
  title: ["Get your", "hands on it."],
  lead: "My bots live in Telegram, but their brains can be tried right here. Everything is computed in your browser.",
  live: "computed live",
  scan: {
    title: "Anti-fraud scanner",
    sub: "A mini Kiber Yordamchi: paste a link or a message text.",
    label: "Link or message",
    placeholder: "https://…",
    presets: "Try:",
    score: "Risk Score",
    empty: "Paste a link and I'll show you what's wrong with it.",
  },
  hunt: {
    title: "Username hunter",
    sub: "Telegram's format rules plus a rarity score — like in KravlezSearch.",
    label: "Username",
    placeholder: "e.g. xzboq",
    generate: "Generate",
    legend: "Rarity scale",
    pick: "Tap a name to check it:",
    empty: "Type a name — I'll rate its format and rarity.",
  },
};

const uz: PlaygroundStrings = {
  eyebrow: "Sinov maydoni",
  title: ["O'zingiz", "sinab ko'ring."],
  lead: "Botlarim Telegram'da yashaydi, lekin ularning miyasini shu yerning o'zida sinab ko'rish mumkin. Hammasi brauzeringizda hisoblanadi.",
  live: "jonli hisoblanadi",
  scan: {
    title: "Antifrod-skaner",
    sub: "Kiber Yordamchining mini-versiyasi: havola yoki xabar matnini kiriting.",
    label: "Havola yoki xabar",
    placeholder: "https://…",
    presets: "Sinab ko'ring:",
    score: "Risk Score",
    empty: "Havolani kiriting — nimasi noto'g'ri ekanini ko'rsataman.",
  },
  hunt: {
    title: "Username ovchisi",
    sub: "Telegram qoidalari bo'yicha format va noyoblik bahosi — KravlezSearch'dagidek.",
    label: "Username",
    placeholder: "masalan, xzboq",
    generate: "Yaratish",
    legend: "Noyoblik shkalasi",
    pick: "Tekshirish uchun nomni bosing:",
    empty: "Nom kiriting — format va noyobligini baholayman.",
  },
};

export const playgroundStrings: Record<Locale, PlaygroundStrings> = { ru, en, uz };
