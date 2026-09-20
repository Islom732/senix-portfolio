# senix-portfolio

Портфолио Уткира К. — фронтенд-разработчика и автора Telegram-ботов.

**Живой сайт:** https://islom732.github.io/senix-portfolio/

## Что внутри

- **Три языка** — русский, английский, узбекский. Определяется по браузеру, выбор запоминается.
- **Светлая и тёмная тема** — по умолчанию системная, без вспышки при загрузке.
- **Интерактивный терминал** — `` ` `` или `Ctrl+K`. Команды: `about`, `projects`, `scan`, `hunt`, `visitors`, `lang`, `theme`, `matrix`, `sudo hire me` и другие.
- **Песочница** — рабочие мини-версии моих ботов прямо на странице:
  - антифрод-сканер ссылок с Risk Score (как в Kiber Yordamchi);
  - оценка и генератор Telegram-юзернеймов (как в KravlezSearch).
- **Счётчик посетителей** на публичном API Abacus (один браузер — один визит).
- Частицы в имени, интерактивное поле точек, 3D-карточки, бегущая строка, искры от кликов, плавный скролл (Lenis).
- Пасхалки: код Konami, заголовок вкладки, `sudo hire me`.
- SEO: OG-картинка, Twitter Card, JSON-LD, `sitemap.xml`, `robots.txt`, своя 404.

## Стек

Next.js 16 (App Router, статический экспорт) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lenis

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # статический сайт в ./out
```

## Где что менять

| Что | Файл |
| --- | --- |
| Тексты, проекты, навыки, контакты (RU/EN/UZ) | `src/content/site.ts` |
| Тексты терминала | `src/content/terminal.ts` |
| Тексты песочницы | `src/content/playground.ts` |
| Логика сканера и оценки юзернеймов | `src/lib/terminal-tools.ts` |
| Счётчик посетителей (`NAMESPACE`) | `src/lib/visitors.ts` |
| Цвета и темы | `src/app/globals.css` |
| Адрес сайта для OG/sitemap | `SITE_URL` в `src/content/site.ts` или `NEXT_PUBLIC_SITE_URL` |

Фото для аватара: положить файл в `public/` и указать путь в `avatar` (`src/content/site.ts`).

## Деплой

Сайт публикуется на GitHub Pages через GitHub Actions (`.github/workflows/deploy.yml`) при каждом пуше в `main`.
Подпапку `/<репозиторий>` (`basePath`) workflow подставляет сам через `NEXT_PUBLIC_BASE_PATH`.
Для любого другого хостинга достаточно `npm run build` и папки `out/`.
