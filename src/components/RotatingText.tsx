"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Фразы, которые по очереди «перелистываются» на одном месте. */
export function RotatingText({
  items,
  interval = 2600,
  className,
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items.length, interval, reduce]);

  return (
    <span className={`relative inline-grid overflow-hidden ${className ?? ""}`}>
      {/* Самая длинная фраза задаёт ширину, чтобы пилюля не «прыгала» */}
      {items.map((t) => (
        <span key={t} aria-hidden className="invisible col-start-1 row-start-1">
          {t}
        </span>
      ))}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={items[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1"
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
