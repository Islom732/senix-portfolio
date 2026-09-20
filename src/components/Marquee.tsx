"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { useI18n } from "./I18nProvider";

const rowA = ["Next.js", "TypeScript", "React", "Tailwind", "Framer Motion", "React Native"];
const rowB = ["Python", "aiogram", "Telegram Bots", "SQLAlchemy", "Expo", "Vercel"];

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({
  items,
  speed,
  outlineFirst,
}: {
  items: string[];
  /** % ширины в секунду; знак — направление. */
  speed: number;
  outlineFirst: boolean;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const base = Math.sign(speed);
  const dir = useRef(base);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    // Скролл вниз — по умолчанию, вверх — разворачиваем ленту
    if (f < -0.05) dir.current = -base;
    else if (f > 0.05) dir.current = base;
    const move = dir.current * Math.abs(speed) * (delta / 1000) * (1 + Math.abs(f));
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap py-2">
      <motion.div style={{ x }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {items.map((t, i) => {
              const outline = (i + (outlineFirst ? 0 : 1)) % 2 === 0;
              return (
                <span key={t} className="flex items-center">
                  <span
                    className={`px-6 text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-tight tracking-tighter transition-colors duration-300 ${
                      outline
                        ? "text-transparent [-webkit-text-stroke:1.5px_var(--foreground)] hover:text-black"
                        : "text-black"
                    }`}
                  >
                    {t}
                  </span>
                  <span className="size-2.5 rounded-full bg-black sm:size-3.5" />
                </span>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Гигантская лента со стеком: ускоряется и разворачивается вместе со скроллом. */
export function Marquee() {
  const { t } = useI18n();
  return (
    <section
      aria-label={t.ui.technologies}
      className="overflow-hidden border-y border-line py-6"
    >
      <Row items={rowA} speed={-4} outlineFirst={false} />
      <Row items={rowB} speed={4} outlineFirst />
    </section>
  );
}
