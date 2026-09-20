"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

/** Чёрный занавес при загрузке: имя появляется и «улетает» вверх. */
export function Intro() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      document.body.style.overflow = "";
      setDone(true);
    }, 1500);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro"
          exit={{
            y: "-100%",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          className="always-dark fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
        >
          <div className="overflow-hidden py-2">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl font-semibold tracking-tighter sm:text-7xl"
            >
              {t.name}
            </motion.p>
          </div>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-white"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
