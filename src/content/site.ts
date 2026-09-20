export type ContactKind = "telegram" | "github" | "email";

export interface Contact {
  kind: ContactKind;
  label: string;
  handle: string;
  href: string;
}

export type PreviewKind = "image" | "search" | "kiber" | "weather";

/** Данные проекта, не зависящие от языка. Тексты — в `dictionaries[locale].projects.items`. */
export interface ProjectData {
  title: string;
  tags: string[];
  preview: PreviewKind;
  /** Путь к скриншоту в /public (для preview: "image"). */
  image?: string;
  /** Ссылка на живой проект — если есть, у карточки появится кнопка «Открыть». */
  url?: string;
}

export interface Project extends ProjectData {
  category: string;
  description: string;
}

export const locales = ["ru", "en", "uz"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const localeLabels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  uz: "UZ",
};

export interface Dictionary {
  name: string;
  initial: string;
  /** Подпись в hero — фразы сменяют друг друга. */
  roles: string[];
  bio: string;
  meta: { title: string; description: string };
  ui: {
    language: string;
    visitors: string;
    theme: { toDark: string; toLight: string };
    scrollDown: string;
    technologies: string;
    hero: { viewProjects: string; contact: string };
    nav: { projects: string; about: string; contacts: string };
    footer: { top: string };
  };
  projects: {
    eyebrow: string;
    title: [string, string];
    lead: string;
    open: string;
    screenshot: (title: string) => string;
    items: { category: string; description: string }[];
  };
  about: {
    eyebrow: string;
    paragraphs: [string, string];
    facts: { value: string; label: string }[];
    skills: { title: string; items: string[] }[];
  };
  contact: {
    eyebrow: string;
    title: [string, string];
    lead: string;
  };
  previews: {
    bot: string;
    city: string;
    clear: string;
    search: {
      free: string;
      notFound: string;
      canClaim: string;
      searching: string;
      checking: string;
    };
    kiber: {
      brand: string;
      otp: string;
      userMsg: string;
      noPanic: string;
      plan: string;
    };
  };
}

/** Положи фото в /public и укажи путь, например "/avatar.jpg". Пока — аватар с инициалом. */
export const avatar: string | undefined = undefined;

export const contacts: Contact[] = [
  {
    kind: "telegram",
    label: "Telegram",
    handle: "@xzboq",
    href: "https://t.me/xzboq",
  },
];

export const projectData: ProjectData[] = [
  {
    title: "WishPool",
    tags: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    preview: "image",
    image: "/projects/wishpool-tall.jpg",
    url: "https://wishpool-two.vercel.app",
  },
  {
    title: "KravlezSearch",
    tags: ["Python", "python-telegram-bot", "httpx", "asyncio"],
    preview: "search",
  },
  {
    title: "Kiber Yordamchi",
    tags: ["Python", "aiogram", "SQLAlchemy", "Threat Intel"],
    preview: "kiber",
  },
  {
    title: "Weather",
    tags: ["React Native", "Expo", "TypeScript", "NativeWind"],
    preview: "weather",
  },
];

const factValues = ["4", "3", "2"];

const ru: Dictionary = {
  name: "Уткир К.",
  initial: "У",
  roles: [
    "Фронтенд-разработчик",
    "Охотник за юзернеймами",
    "Строю Telegram-ботов",
    "Влюблён в минимализм",
  ],
  bio: "Превращаю идеи в живые интерфейсы. Мои боты охотятся за редкими юзернеймами и ловят фишинг, а сайты хочется листать до конца.",
  meta: {
    title: "Уткир К. — Фронтенд-разработчик",
    description:
      "Превращаю идеи в живые интерфейсы. Мои боты охотятся за редкими юзернеймами и ловят фишинг, а сайты хочется листать до конца.",
  },
  ui: {
    language: "Язык",
    visitors: "Посетителей",
    theme: { toDark: "Включить тёмную тему", toLight: "Включить светлую тему" },
    scrollDown: "Прокрутить вниз",
    technologies: "Технологии",
    hero: { viewProjects: "Смотреть проекты", contact: "Связаться" },
    nav: { projects: "Проекты", about: "Обо мне", contacts: "Контакты" },
    footer: { top: "Наверх" },
  },
  projects: {
    eyebrow: "Работы",
    title: ["Проекты, которыми", "я горжусь."],
    lead: "Сайты, боты и приложения — то, что я сделал и довёл до рабочего вида.",
    open: "Открыть",
    screenshot: (t) => `Скриншот проекта ${t}`,
    items: [
      {
        category: "Веб-платформа",
        description:
          "Платформа желаний и добрых дел: публикуешь желание — другие помогают исполнить его полностью или частично. Каталог, профили, рейтинг доверия и админ-панель.",
      },
      {
        category: "Telegram-бот",
        description:
          "Бот для поиска свободных редких юзернеймов. Каждое имя проверяется вживую — и в Telegram, и на Fragment, поэтому предлагает только то, что реально можно занять.",
      },
      {
        category: "Telegram-бот",
        description:
          "Антифрод-бот для Узбекистана: проверяет ссылки, сообщения и APK на фишинг и мошенничество. Risk Engine с доказательствами и три языка интерфейса.",
      },
      {
        category: "Мобильное приложение",
        description:
          "Приложение погоды на React Native: поиск города, геолокация, почасовой прогноз и кэширование данных для работы без сети.",
      },
    ],
  },
  about: {
    eyebrow: "Обо мне",
    paragraphs: [
      "Люблю, когда интерфейс дышит: пружинит под пальцем, подсвечивается под курсором и не оставляет ни одного лишнего пикселя.",
      "Одни мои проекты про красоту, другие — про пользу: веб-платформы на Next.js, боты на Python, которые гоняют мошенников и находят редкие имена, и приложения, которые живут в кармане.",
    ],
    facts: [
      "проекта в портфолио",
      "платформы: веб, боты, мобайл",
      "основных языка: TypeScript и Python",
    ].map((label, i) => ({ value: factValues[i], label })),
    skills: [
      { title: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
      { title: "Mobile", items: ["React Native", "Expo", "NativeWind", "Zustand", "TanStack Query"] },
      { title: "Backend и боты", items: ["Python", "aiogram", "python-telegram-bot", "SQLAlchemy", "SQLite", "PostgreSQL"] },
      { title: "Инструменты", items: ["Git", "Vercel", "ESLint", "Playwright"] },
    ],
  },
  contact: {
    eyebrow: "Контакты",
    title: ["Давайте работать", "вместе."],
    lead: "Есть идея или задача? Напишите — отвечу как можно быстрее.",
  },
  previews: {
    bot: "бот",
    city: "Ташкент",
    clear: "Ясно",
    search: {
      free: "Telegram — свободен",
      notFound: "Fragment — не найден",
      canClaim: "Можно занять",
      searching: "Ищу свободные имена…",
      checking: "Проверяю Telegram и Fragment",
    },
    kiber: {
      brand: "E01 · Имитация бренда",
      otp: "E02 · Форма ввода OTP",
      userMsg: "я ввёл код",
      noPanic: "Без паники.",
      plan: "Вот пошаговый план действий.",
    },
  },
};

const en: Dictionary = {
  name: "Utkir K.",
  initial: "U",
  roles: [
    "Frontend developer",
    "Username hunter",
    "I build Telegram bots",
    "In love with minimalism",
  ],
  bio: "I turn ideas into living interfaces. My bots hunt rare usernames and catch phishing, and my sites make you want to scroll to the end.",
  meta: {
    title: "Utkir K. — Frontend developer",
    description:
      "I turn ideas into living interfaces. My bots hunt rare usernames and catch phishing, and my sites make you want to scroll to the end.",
  },
  ui: {
    language: "Language",
    visitors: "Visitors",
    theme: { toDark: "Switch to dark theme", toLight: "Switch to light theme" },
    scrollDown: "Scroll down",
    technologies: "Technologies",
    hero: { viewProjects: "View projects", contact: "Get in touch" },
    nav: { projects: "Projects", about: "About", contacts: "Contact" },
    footer: { top: "Back to top" },
  },
  projects: {
    eyebrow: "Work",
    title: ["Projects I'm", "proud of."],
    lead: "Sites, bots and apps — things I built and brought to a working state.",
    open: "Open",
    screenshot: (t) => `Screenshot of ${t}`,
    items: [
      {
        category: "Web platform",
        description:
          "A platform for wishes and good deeds: you post a wish — others help fulfil it fully or partly. Catalog, profiles, trust rating and an admin panel.",
      },
      {
        category: "Telegram bot",
        description:
          "A bot for finding free rare usernames. Every name is checked live — on Telegram and on Fragment — so it only suggests what can really be claimed.",
      },
      {
        category: "Telegram bot",
        description:
          "An anti-fraud bot for Uzbekistan: checks links, messages and APKs for phishing and scams. A Risk Engine with evidence and an interface in three languages.",
      },
      {
        category: "Mobile app",
        description:
          "A weather app on React Native: city search, geolocation, hourly forecast and data caching for offline use.",
      },
    ],
  },
  about: {
    eyebrow: "About",
    paragraphs: [
      "I love an interface that breathes: it springs under a finger, lights up under the cursor and leaves not a single spare pixel.",
      "Some of my projects are about beauty, others about usefulness: web platforms on Next.js, Python bots that chase off scammers and find rare names, and apps that live in your pocket.",
    ],
    facts: [
      "projects in the portfolio",
      "platforms: web, bots, mobile",
      "main languages: TypeScript and Python",
    ].map((label, i) => ({ value: factValues[i], label })),
    skills: [
      { title: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
      { title: "Mobile", items: ["React Native", "Expo", "NativeWind", "Zustand", "TanStack Query"] },
      { title: "Backend & bots", items: ["Python", "aiogram", "python-telegram-bot", "SQLAlchemy", "SQLite", "PostgreSQL"] },
      { title: "Tools", items: ["Git", "Vercel", "ESLint", "Playwright"] },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: ["Let's work", "together."],
    lead: "Have an idea or a task? Write to me — I'll reply as fast as I can.",
  },
  previews: {
    bot: "bot",
    city: "Tashkent",
    clear: "Clear",
    search: {
      free: "Telegram — available",
      notFound: "Fragment — not found",
      canClaim: "Can be claimed",
      searching: "Looking for free names…",
      checking: "Checking Telegram and Fragment",
    },
    kiber: {
      brand: "E01 · Brand impersonation",
      otp: "E02 · OTP input form",
      userMsg: "I entered the code",
      noPanic: "Don't panic.",
      plan: "Here's a step-by-step action plan.",
    },
  },
};

const uz: Dictionary = {
  name: "Utkir K.",
  initial: "U",
  roles: [
    "Frontend dasturchi",
    "Username ovchisi",
    "Telegram botlar yarataman",
    "Minimalizmga oshiqman",
  ],
  bio: "G'oyalarni jonli interfeyslarga aylantiraman. Botlarim noyob usernamelarni ovlaydi va fishingni tutadi, saytlarimni esa oxirigacha varaqlagingiz keladi.",
  meta: {
    title: "Utkir K. — Frontend dasturchi",
    description:
      "G'oyalarni jonli interfeyslarga aylantiraman. Botlarim noyob usernamelarni ovlaydi va fishingni tutadi, saytlarimni esa oxirigacha varaqlagingiz keladi.",
  },
  ui: {
    language: "Til",
    visitors: "Tashrif buyuruvchilar",
    theme: { toDark: "Qorong'i mavzuga o'tish", toLight: "Yorug' mavzuga o'tish" },
    scrollDown: "Pastga aylantirish",
    technologies: "Texnologiyalar",
    hero: { viewProjects: "Loyihalarni ko'rish", contact: "Bog'lanish" },
    nav: { projects: "Loyihalar", about: "Men haqimda", contacts: "Kontaktlar" },
    footer: { top: "Yuqoriga" },
  },
  projects: {
    eyebrow: "Ishlar",
    title: ["Men faxrlanadigan", "loyihalar."],
    lead: "Saytlar, botlar va ilovalar — men yaratib, ishlaydigan holatga keltirganlarim.",
    open: "Ochish",
    screenshot: (t) => `${t} loyihasi skrinshoti`,
    items: [
      {
        category: "Veb-platforma",
        description:
          "Istaklar va ezgu ishlar platformasi: istak e'lon qilasiz — boshqalar uni to'liq yoki qisman amalga oshirishga yordam beradi. Katalog, profillar, ishonch reytingi va admin-panel.",
      },
      {
        category: "Telegram-bot",
        description:
          "Bo'sh noyob usernamelarni qidiruvchi bot. Har bir nom Telegram'da ham, Fragment'da ham jonli tekshiriladi, shuning uchun faqat haqiqatan band qilish mumkin bo'lganini taklif qiladi.",
      },
      {
        category: "Telegram-bot",
        description:
          "O'zbekiston uchun antifrod-bot: havolalar, xabarlar va APK fayllarni fishing va firibgarlikka tekshiradi. Dalillar bilan Risk Engine va uch tilli interfeys.",
      },
      {
        category: "Mobil ilova",
        description:
          "React Native'dagi ob-havo ilovasi: shahar qidirish, geolokatsiya, soatlik prognoz va tarmoqsiz ishlash uchun ma'lumotlarni keshlash.",
      },
    ],
  },
  about: {
    eyebrow: "Men haqimda",
    paragraphs: [
      "Interfeys nafas olganini yaxshi ko'raman: barmoq ostida siljiydi, kursor ostida yorishadi va bitta ortiqcha piksel qoldirmaydi.",
      "Ba'zi loyihalarim go'zallik haqida, boshqalari — foyda haqida: Next.js'dagi veb-platformalar, firibgarlarni quvadigan va noyob nomlarni topadigan Python botlar hamda cho'ntakda yashaydigan ilovalar.",
    ],
    facts: [
      "portfoliodagi loyiha",
      "platforma: veb, botlar, mobil",
      "asosiy til: TypeScript va Python",
    ].map((label, i) => ({ value: factValues[i], label })),
    skills: [
      { title: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
      { title: "Mobile", items: ["React Native", "Expo", "NativeWind", "Zustand", "TanStack Query"] },
      { title: "Backend va botlar", items: ["Python", "aiogram", "python-telegram-bot", "SQLAlchemy", "SQLite", "PostgreSQL"] },
      { title: "Asboblar", items: ["Git", "Vercel", "ESLint", "Playwright"] },
    ],
  },
  contact: {
    eyebrow: "Kontaktlar",
    title: ["Keling, birga", "ishlaymiz."],
    lead: "G'oya yoki vazifa bormi? Yozing — imkon qadar tez javob beraman.",
  },
  previews: {
    bot: "bot",
    city: "Toshkent",
    clear: "Ochiq",
    search: {
      free: "Telegram — bo'sh",
      notFound: "Fragment — topilmadi",
      canClaim: "Band qilish mumkin",
      searching: "Bo'sh nomlarni qidiryapman…",
      checking: "Telegram va Fragment'ni tekshiryapman",
    },
    kiber: {
      brand: "E01 · Brend taqlidi",
      otp: "E02 · OTP kiritish shakli",
      userMsg: "kodni kiritib yubordim",
      noPanic: "Vahima qilmang.",
      plan: "Mana bosqichma-bosqich harakat rejasi.",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ru, en, uz };
