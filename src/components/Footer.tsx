"use client";

import { motion } from "framer-motion";
import { contacts } from "@/content/site";
import { useVisitors } from "@/lib/visitors";
import { CountUp } from "./CountUp";
import { useI18n } from "./I18nProvider";
import { ArrowUpRight, ContactIcon } from "./Icons";

export function Footer() {
  const { t } = useI18n();
  const visitors = useVisitors();
  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {t.name}
          </p>
          {visitors != null && (
            <p className="flex items-center gap-2 font-mono text-xs text-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {t.ui.visitors}: <CountUp to={visitors} />
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-2">
            {contacts.map((c) => (
              <li key={c.kind}>
                <motion.a
                  href={c.href}
                  target={c.kind === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={c.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  <ContactIcon kind={c.kind} />
                </motion.a>
              </li>
            ))}
          </ul>
          <a
            href="#top"
            className="ml-2 inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-black"
          >
            {t.ui.footer.top}
            <span className="-rotate-45">
              <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </div>

      <div
        aria-hidden
        className="select-none whitespace-nowrap bg-gradient-to-b from-line to-transparent bg-clip-text pb-4 text-center text-[clamp(4rem,19vw,17rem)] font-semibold leading-[0.85] tracking-tighter text-transparent"
      >
        {t.name}
      </div>
    </footer>
  );
}
