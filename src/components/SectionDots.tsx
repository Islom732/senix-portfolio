"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { featureStrings } from "@/content/features";
import { useI18n } from "./I18nProvider";

const IDS = ["top", "projects", "playground", "about", "contacts"] as const;

/** Боковые точки: показывают, где вы на странице, и прокручивают к секции. */
export function SectionDots() {
  const { t, locale } = useI18n();
  const f = featureStrings[locale].dots;
  const [active, setActive] = useState<string>("top");

  const labels: Record<(typeof IDS)[number], string> = {
    top: f.top,
    projects: t.ui.nav.projects,
    playground: f.playground,
    about: t.ui.nav.about,
    contacts: t.ui.nav.contacts,
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of IDS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <motion.nav
      aria-label={f.nav}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 lg:flex"
    >
      {IDS.map((id) => {
        const on = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={labels[id]}
            aria-current={on ? "true" : undefined}
            className="group flex h-6 items-center gap-3"
          >
            <span className="pointer-events-none translate-x-1 rounded-full border border-line bg-white/85 px-3 py-1 text-xs opacity-0 shadow-sm backdrop-blur transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
              {labels[id]}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                on ? "h-6 w-1.5 bg-black" : "size-1.5 bg-muted/50 group-hover:bg-black"
              }`}
            />
          </a>
        );
      })}
    </motion.nav>
  );
}