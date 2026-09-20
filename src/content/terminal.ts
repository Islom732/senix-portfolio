import type { HuntProblem, Rarity, ScanLevel, Signal } from "@/lib/terminal-tools";
import type { Locale } from "./site";

export interface TerminalStrings {
  open: string;
  close: string;
  hint: string;
  placeholder: string;
  boot: string[];
  help: { cmd: string; desc: string }[];
  helpTitle: string;
  unknown: (cmd: string) => string;
  usage: {
    open: string;
    lang: string;
    theme: string;
    scan: string;
  };
  empty: string;
  noLive: (title: string) => string;
  opening: (title: string) => string;
  langSet: (l: string) => string;
  themeSet: (t: string) => string;
  projectsTitle: string;
  skillsTitle: string;
  contactTitle: string;
  hunt: {
    generating: string;
    candidates: string;
    note: string;
    invalid: Record<HuntProblem, string>;
    rarity: Record<Rarity, string>;
    traits: Record<string, string>;
    score: string;
    formatOk: string;
  };
  scan: {
    running: string[];
    level: Record<ScanLevel, string>;
    verdict: string;
    evidence: string;
    none: string;
    signal: (s: Signal) => string;
    note: string;
  };
  matrix: string;
  visitors: { loading: string; count: (n: string) => string; unavailable: string };
  hire: string[];
  whoami: string;
  sudoDenied: string;
}

const ru: TerminalStrings = {
  open: "Открыть терминал",
  close: "Закрыть терминал",
  hint: "нажми ` или Ctrl+K — тут спрятан терминал",
  placeholder: "введи help…",
  boot: [
    "senix-shell v1.0 — добро пожаловать.",
    "Набери help, чтобы увидеть команды. Например: scan, hunt, matrix.",
  ],
  helpTitle: "Доступные команды:",
  help: [
    { cmd: "about", desc: "кто я" },
    { cmd: "projects", desc: "мои проекты" },
    { cmd: "open <№>", desc: "открыть проект (если есть живая ссылка)" },
    { cmd: "skills", desc: "стек" },
    { cmd: "contact", desc: "как связаться" },
    { cmd: "scan <ссылка/текст>", desc: "проверить на фишинг (мини-версия Kiber Yordamchi)" },
    { cmd: "hunt [имя]", desc: "оценить юзернейм или сгенерировать кандидатов" },
    { cmd: "lang ru|en|uz", desc: "сменить язык сайта" },
    { cmd: "theme dark|light", desc: "сменить тему" },
    { cmd: "visitors", desc: "сколько людей здесь было" },
    { cmd: "matrix", desc: "включить дождь" },
    { cmd: "sudo hire me", desc: "не спрашивай, просто попробуй" },
    { cmd: "clear", desc: "очистить экран" },
    { cmd: "exit", desc: "закрыть терминал" },
  ],
  unknown: (c) => `команда не найдена: ${c}. Набери help.`,
  usage: {
    open: "использование: open <номер проекта>, например open 1",
    lang: "использование: lang ru | en | uz",
    theme: "использование: theme dark | light",
    scan: "использование: scan https://click-uz-bonus.xyz/login",
  },
  empty: "",
  noLive: (t) => `у «${t}» пока нет живой ссылки — это бот или приложение.`,
  opening: (t) => `открываю ${t}…`,
  langSet: (l) => `язык переключён: ${l}`,
  themeSet: (t) => `тема: ${t}`,
  projectsTitle: "Проекты:",
  skillsTitle: "Стек:",
  contactTitle: "Контакты:",
  hunt: {
    generating: "подбираю звучные пятибуквенные имена…",
    candidates: "Кандидаты (проверь наличие в Telegram сам или в моём боте):",
    note: "Это проверка формата и оценка редкости. Живую проверку Telegram и Fragment делает бот KravlezSearch.",
    invalid: {
      length: "длина должна быть от 5 до 32 символов",
      chars: "разрешены только латинские буквы, цифры и _",
      start: "имя должно начинаться с буквы",
      "underscore-end": "имя не может заканчиваться на _",
      "double-underscore": "двойное подчёркивание __ запрещено",
    },
    rarity: { common: "обычное", rare: "редкое", epic: "эпичное", legendary: "легендарное" },
    traits: {
      len5: "5 символов — минимум Telegram",
      short: "короткое",
      letters: "только буквы",
      pronounceable: "легко произносится",
      palindrome: "палиндром",
      repeat: "повторы букв",
    },
    score: "редкость",
    formatOk: "формат корректен",
  },
  scan: {
    running: ["разбираю адрес…", "сверяю бренды и домены…", "считаю Risk Score…"],
    level: { safe: "НИЗКИЙ РИСК", suspicious: "ПОДОЗРИТЕЛЬНО", dangerous: "ОПАСНО" },
    verdict: "вердикт",
    evidence: "улики:",
    none: "ничего подозрительного не найдено (это не гарантия безопасности).",
    signal: (s) => {
      switch (s.key) {
        case "brand": return `имитация бренда «${s.detail}» — домен не настоящий`;
        case "lure": return `слова-приманки: ${s.detail}`;
        case "punycode": return "punycode (xn--) — возможны подменённые символы";
        case "ip": return "вместо домена — IP-адрес";
        case "tld": return `подозрительная зона ${s.detail}`;
        case "structure": return "странная структура: много дефисов или поддоменов";
        case "shortener": return "сокращатель ссылок скрывает реальный адрес";
        case "apk": return "ссылка ведёт на установку APK";
        case "http": return "нет HTTPS";
        case "userinfo": return "в адресе есть логин/пароль до @ — классика обмана";
      }
    },
    note: "Упрощённая эвристика для демо. Боевой Risk Engine ловит гораздо больше.",
  },
  matrix: "просыпайся, Нео…",
  visitors: {
    loading: "считаю посетителей…",
    count: (n) => `посетителей на сайте: ${n}. Ты — один из них.`,
    unavailable: "счётчик сейчас недоступен, попробуй позже.",
  },
  hire: [
    "sudo: проверка пароля… ok",
    "доступ разрешён.",
    "Отличное решение. Открываю контакты →",
  ],
  whoami: "гость",
  sudoDenied: "нужен пароль. Подсказка: sudo hire me",
};

const en: TerminalStrings = {
  open: "Open terminal",
  close: "Close terminal",
  hint: "press ` or Ctrl+K — there's a terminal hidden here",
  placeholder: "type help…",
  boot: [
    "senix-shell v1.0 — welcome.",
    "Type help to see the commands. Try: scan, hunt, matrix.",
  ],
  helpTitle: "Available commands:",
  help: [
    { cmd: "about", desc: "who I am" },
    { cmd: "projects", desc: "my projects" },
    { cmd: "open <#>", desc: "open a project (if it has a live link)" },
    { cmd: "skills", desc: "the stack" },
    { cmd: "contact", desc: "how to reach me" },
    { cmd: "scan <url/text>", desc: "check for phishing (mini Kiber Yordamchi)" },
    { cmd: "hunt [name]", desc: "rate a username or generate candidates" },
    { cmd: "lang ru|en|uz", desc: "switch site language" },
    { cmd: "theme dark|light", desc: "switch theme" },
    { cmd: "visitors", desc: "how many people have been here" },
    { cmd: "matrix", desc: "make it rain" },
    { cmd: "sudo hire me", desc: "don't ask, just try" },
    { cmd: "clear", desc: "clear the screen" },
    { cmd: "exit", desc: "close the terminal" },
  ],
  unknown: (c) => `command not found: ${c}. Type help.`,
  usage: {
    open: "usage: open <project number>, e.g. open 1",
    lang: "usage: lang ru | en | uz",
    theme: "usage: theme dark | light",
    scan: "usage: scan https://click-uz-bonus.xyz/login",
  },
  empty: "",
  noLive: (t) => `"${t}" has no live link yet — it's a bot or an app.`,
  opening: (t) => `opening ${t}…`,
  langSet: (l) => `language switched: ${l}`,
  themeSet: (t) => `theme: ${t}`,
  projectsTitle: "Projects:",
  skillsTitle: "Stack:",
  contactTitle: "Contact:",
  hunt: {
    generating: "picking catchy five-letter names…",
    candidates: "Candidates (check availability on Telegram yourself, or use my bot):",
    note: "This is a format check and rarity score. Live Telegram and Fragment checks are done by the KravlezSearch bot.",
    invalid: {
      length: "length must be 5 to 32 characters",
      chars: "only Latin letters, digits and _ are allowed",
      start: "the name must start with a letter",
      "underscore-end": "the name can't end with _",
      "double-underscore": "double underscore __ is not allowed",
    },
    rarity: { common: "common", rare: "rare", epic: "epic", legendary: "legendary" },
    traits: {
      len5: "5 chars — Telegram's minimum",
      short: "short",
      letters: "letters only",
      pronounceable: "easy to pronounce",
      palindrome: "palindrome",
      repeat: "repeated letters",
    },
    score: "rarity",
    formatOk: "format is valid",
  },
  scan: {
    running: ["parsing the address…", "matching brands and domains…", "computing Risk Score…"],
    level: { safe: "LOW RISK", suspicious: "SUSPICIOUS", dangerous: "DANGEROUS" },
    verdict: "verdict",
    evidence: "evidence:",
    none: "nothing suspicious found (this is not a safety guarantee).",
    signal: (s) => {
      switch (s.key) {
        case "brand": return `brand impersonation "${s.detail}" — the domain isn't official`;
        case "lure": return `bait words: ${s.detail}`;
        case "punycode": return "punycode (xn--) — lookalike characters possible";
        case "ip": return "an IP address instead of a domain";
        case "tld": return `suspicious zone ${s.detail}`;
        case "structure": return "odd structure: many hyphens or subdomains";
        case "shortener": return "a link shortener hides the real address";
        case "apk": return "the link leads to an APK install";
        case "http": return "no HTTPS";
        case "userinfo": return "login/password before @ in the URL — a classic trick";
      }
    },
    note: "A simplified demo heuristic. The real Risk Engine catches far more.",
  },
  matrix: "wake up, Neo…",
  visitors: {
    loading: "counting visitors…",
    count: (n) => `visitors so far: ${n}. You are one of them.`,
    unavailable: "the counter is unavailable right now, try again later.",
  },
  hire: [
    "sudo: checking password… ok",
    "access granted.",
    "Great decision. Opening contacts →",
  ],
  whoami: "guest",
  sudoDenied: "password required. Hint: sudo hire me",
};

const uz: TerminalStrings = {
  open: "Terminalni ochish",
  close: "Terminalni yopish",
  hint: "` yoki Ctrl+K ni bosing — bu yerda terminal yashiringan",
  placeholder: "help deb yozing…",
  boot: [
    "senix-shell v1.0 — xush kelibsiz.",
    "Buyruqlarni ko'rish uchun help yozing. Masalan: scan, hunt, matrix.",
  ],
  helpTitle: "Mavjud buyruqlar:",
  help: [
    { cmd: "about", desc: "men kimman" },
    { cmd: "projects", desc: "loyihalarim" },
    { cmd: "open <№>", desc: "loyihani ochish (jonli havola bo'lsa)" },
    { cmd: "skills", desc: "texnologiyalar" },
    { cmd: "contact", desc: "bog'lanish" },
    { cmd: "scan <havola/matn>", desc: "fishingga tekshirish (mini Kiber Yordamchi)" },
    { cmd: "hunt [nom]", desc: "usernameni baholash yoki nomzodlar yaratish" },
    { cmd: "lang ru|en|uz", desc: "sayt tilini o'zgartirish" },
    { cmd: "theme dark|light", desc: "mavzuni o'zgartirish" },
    { cmd: "visitors", desc: "bu yerda necha kishi bo'lgan" },
    { cmd: "matrix", desc: "yomg'ir yog'dirish" },
    { cmd: "sudo hire me", desc: "so'ramang, shunchaki sinab ko'ring" },
    { cmd: "clear", desc: "ekranni tozalash" },
    { cmd: "exit", desc: "terminalni yopish" },
  ],
  unknown: (c) => `buyruq topilmadi: ${c}. help yozing.`,
  usage: {
    open: "ishlatilishi: open <loyiha raqami>, masalan open 1",
    lang: "ishlatilishi: lang ru | en | uz",
    theme: "ishlatilishi: theme dark | light",
    scan: "ishlatilishi: scan https://click-uz-bonus.xyz/login",
  },
  empty: "",
  noLive: (t) => `"${t}" uchun hozircha jonli havola yo'q — bu bot yoki ilova.`,
  opening: (t) => `${t} ochilmoqda…`,
  langSet: (l) => `til o'zgartirildi: ${l}`,
  themeSet: (t) => `mavzu: ${t}`,
  projectsTitle: "Loyihalar:",
  skillsTitle: "Texnologiyalar:",
  contactTitle: "Kontaktlar:",
  hunt: {
    generating: "jarangdor besh harfli nomlar tanlanmoqda…",
    candidates: "Nomzodlar (bandligini Telegram'da o'zingiz tekshiring yoki botimdan foydalaning):",
    note: "Bu format tekshiruvi va noyoblik bahosi. Telegram va Fragment'ni jonli tekshirishni KravlezSearch boti bajaradi.",
    invalid: {
      length: "uzunligi 5 dan 32 gacha belgi bo'lishi kerak",
      chars: "faqat lotin harflari, raqamlar va _ ruxsat etiladi",
      start: "nom harf bilan boshlanishi kerak",
      "underscore-end": "nom _ bilan tugamasligi kerak",
      "double-underscore": "ikkita pastki chiziq __ taqiqlangan",
    },
    rarity: { common: "oddiy", rare: "noyob", epic: "epik", legendary: "afsonaviy" },
    traits: {
      len5: "5 belgi — Telegram minimumi",
      short: "qisqa",
      letters: "faqat harflar",
      pronounceable: "oson talaffuz qilinadi",
      palindrome: "palindrom",
      repeat: "takrorlanuvchi harflar",
    },
    score: "noyoblik",
    formatOk: "format to'g'ri",
  },
  scan: {
    running: ["manzil tahlil qilinmoqda…", "brendlar va domenlar solishtirilmoqda…", "Risk Score hisoblanmoqda…"],
    level: { safe: "PAST XAVF", suspicious: "SHUBHALI", dangerous: "XAVFLI" },
    verdict: "xulosa",
    evidence: "dalillar:",
    none: "shubhali narsa topilmadi (bu xavfsizlik kafolati emas).",
    signal: (s) => {
      switch (s.key) {
        case "brand": return `"${s.detail}" brendini taqlid qilish — domen rasmiy emas`;
        case "lure": return `chorlovchi so'zlar: ${s.detail}`;
        case "punycode": return "punycode (xn--) — o'xshash belgilar bo'lishi mumkin";
        case "ip": return "domen o'rniga IP-manzil";
        case "tld": return `shubhali zona ${s.detail}`;
        case "structure": return "g'alati tuzilma: ko'p defis yoki subdomen";
        case "shortener": return "havola qisqartirgich haqiqiy manzilni yashiradi";
        case "apk": return "havola APK o'rnatishga olib boradi";
        case "http": return "HTTPS yo'q";
        case "userinfo": return "manzilda @ dan oldin login/parol — klassik aldov";
      }
    },
    note: "Demo uchun soddalashtirilgan evristika. Haqiqiy Risk Engine ancha ko'proqni tutadi.",
  },
  matrix: "uyg'on, Neo…",
  visitors: {
    loading: "tashrif buyuruvchilar sanalmoqda…",
    count: (n) => `saytga tashriflar: ${n}. Siz ham ulardan birisiz.`,
    unavailable: "hisoblagich hozir mavjud emas, keyinroq urinib ko'ring.",
  },
  hire: [
    "sudo: parol tekshirilmoqda… ok",
    "ruxsat berildi.",
    "Ajoyib qaror. Kontaktlar ochilmoqda →",
  ],
  whoami: "mehmon",
  sudoDenied: "parol kerak. Maslahat: sudo hire me",
};

export const terminalStrings: Record<Locale, TerminalStrings> = { ru, en, uz };
