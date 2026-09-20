import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL, contacts, dictionaries } from "@/content/site";
import { themeInitScript } from "@/content/theme-script";

const { meta } = dictionaries.en;
const ru = dictionaries.ru.meta;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const ogImage = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: meta.title,
};

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: ru.title,
  description: ru.description,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: ru.title,
    description: ru.description,
    url: `${SITE_URL}/`,
    siteName: dictionaries.en.name,
    locale: "ru_RU",
    alternateLocale: ["en_US", "uz_UZ"],
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/** Микроразметка schema.org — помогает поисковикам понять, что это за страница. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: dictionaries.en.name,
  alternateName: dictionaries.ru.name,
  jobTitle: "Frontend developer",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og.png`,
  description: meta.description,
  sameAs: contacts.map((c) => c.href),
  knowsAbout: ["Next.js", "React", "TypeScript", "Python", "Telegram bots", "aiogram"],
  knowsLanguage: ["ru", "en", "uz"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
