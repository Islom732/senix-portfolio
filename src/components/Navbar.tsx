"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { localeLabels, locales } from "@/content/site";
import { useI18n } from "./I18nProvider";
import { Moon, Sun } from "./Icons";
import { useTheme } from "./ThemeProvider";

const ids = ["projects", "about", "contacts"] as const;

export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const links = ids.map((id) => ({ id, label: t.ui.nav[id] }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["top", ...ids]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-2 sm:px-4">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex items-center gap-0.5 rounded-full sm:gap-1 border border-line bg-white/75 p-1.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl"
      >
        <a
          href="#top"
          className="hidden px-4 text-sm font-semibold tracking-tight sm:block"
        >
          {t.name}
        </a>
        <span aria-hidden className="hidden h-5 w-px bg-line sm:block" />
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={`relative rounded-full px-2 py-2 text-[12px] transition-colors sm:px-4 sm:text-sm ${
              active === l.id ? "text-white" : "text-muted hover:text-black"
            }`}
          >
            {active === l.id && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-full bg-black"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{l.label}</span>
          </a>
        ))}
        <span aria-hidden className="mx-0.5 h-5 w-px bg-line sm:mx-1" />
        <div role="group" aria-label={t.ui.language} className="flex items-center">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              lang={l}
              aria-pressed={locale === l}
              onClick={() => setLocale(l)}
              className={`relative rounded-full px-1 py-2 text-[11px] font-medium transition-colors sm:px-2.5 sm:text-xs ${
                locale === l ? "text-white" : "text-muted hover:text-black"
              }`}
            >
              {locale === l && (
                <motion.span
                  layoutId="lang-active"
                  className="absolute inset-0 rounded-full bg-black"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{localeLabels[l]}</span>
            </button>
          ))}
        </div>
        <span aria-hidden className="mx-0.5 h-5 w-px bg-line sm:mx-1" />
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? t.ui.theme.toLight : t.ui.theme.toDark}
          className="flex size-7 items-center justify-center rounded-full text-muted sm:size-8 transition-colors hover:text-black"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.nav>
    </div>
  );
}
