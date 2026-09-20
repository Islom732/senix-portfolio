"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef, useState } from "react";
import { terminalStrings } from "@/content/terminal";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { DotField } from "./DotField";
import { useI18n } from "./I18nProvider";
import { ArrowDown } from "./Icons";
import { ParticleText } from "./ParticleText";
import { RotatingText } from "./RotatingText";
import { TERMINAL_EVENT } from "./Terminal";

const ease = [0.22, 1, 0.36, 1] as const;
/** Ждём, пока уедет интро-занавес. */
const START = 0.9;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: START } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { t, locale } = useI18n();
  const [particles, setParticles] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 pb-28 pt-28 sm:px-8"
    >
      <DotField className="pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(ellipse_90%_75%_at_50%_48%,black_35%,transparent_100%)]" />

      <motion.div style={{ y, opacity, scale }} className="relative w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto flex max-w-[95rem] flex-col items-center text-center"
        >
          <motion.div variants={item}>
            <Avatar />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-14 rounded-full border border-line bg-white/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted backdrop-blur"
          >
            <RotatingText items={t.roles} />
          </motion.p>

          <motion.div variants={item} className="relative mt-5">
            {/* Текст остаётся в DOM (SEO, скринридеры), но рисуется частицами */}
            <h1
              ref={h1Ref}
              className={`mx-auto w-fit py-[0.04em] text-[clamp(3.6rem,17vw,15rem)] font-semibold leading-none tracking-tighter ${
                particles ? "text-transparent" : ""
              }`}
            >
              {t.name}
            </h1>
            {!reduce && (
              <ParticleText
                text={t.name}
                sourceRef={h1Ref}
                startDelay={START}
                onReady={() => setParticles(true)}
              />
            )}
          </motion.div>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            {t.bio}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="#projects">{t.ui.hero.viewProjects}</Button>
            <Button href="#contacts" variant="secondary">
              {t.ui.hero.contact}
            </Button>
          </motion.div>

          <motion.button
            variants={item}
            type="button"
            onClick={() => window.dispatchEvent(new Event(TERMINAL_EVENT))}
            className="mt-6 hidden items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-black sm:inline-flex"
          >
            <span className="text-emerald-500">›_</span>
            {terminalStrings[locale].hint}
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.a
        href="#projects"
        aria-label={t.ui.scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: START + 1, duration: 0.8 },
          y: { delay: START + 1, duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-8 text-muted transition-colors hover:text-black"
      >
        <ArrowDown />
      </motion.a>
    </section>
  );
}
