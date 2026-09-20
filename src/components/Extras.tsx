"use client";

import { useEffect } from "react";
import { useI18n } from "./I18nProvider";
import { MATRIX_EVENT } from "./Terminal";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

/** Невидимые мелочи: ссылка «к содержимому», заголовок вкладки, код Konami. */
export function Extras() {
  const { t } = useI18n();

  // Пока вкладка в фоне, заголовок зовёт вернуться
  useEffect(() => {
    let original = document.title;
    function onVisibility() {
      if (document.hidden) {
        original = document.title;
        document.title = t.ui.away;
      } else {
        document.title = t.meta.title;
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, [t]);

  // ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    let i = 0;
    function onKey(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = key === KONAMI[i] ? i + 1 : key === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        window.dispatchEvent(new Event(MATRIX_EVENT));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-transform focus:translate-y-0"
    >
      {t.ui.skip}
    </a>
  );
}
