"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Dictionary, Project } from "@/content/site";
import { useI18n } from "./I18nProvider";

/* ───────────── Рамки устройств ───────────── */

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-5 bottom-[-40px] top-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]">
      <div className="flex h-8 items-center gap-1.5 border-b border-line bg-white px-3">
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="ml-3 flex-1 truncate rounded-full bg-gray-100 px-3 py-0.5 text-center text-[9px] text-muted">
          wishpool-two.vercel.app
        </span>
      </div>
      <div className="relative h-full overflow-hidden">{children}</div>
    </div>
  );
}

function PhoneFrame({
  title,
  children,
  header = true,
}: {
  title?: string;
  children: ReactNode;
  header?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className="absolute left-1/2 top-8 h-[115%] w-[72%] -translate-x-1/2 overflow-hidden rounded-[32px] border-[5px] border-black bg-white shadow-[0_28px_60px_-18px_rgba(0,0,0,0.45)]">
      <span
        aria-hidden
        className="absolute left-1/2 top-1.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black"
      />
      {header && (
        <div className="flex items-center gap-2 border-b border-line px-3 pb-2 pt-5">
          <span className="flex size-6 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
            {title?.[0]}
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold">{title}</p>
            <p className="text-[9px] text-muted">{t.previews.bot}</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

/* ───────────── Анимированный чат ───────────── */

interface Msg {
  from: "user" | "bot";
  content: ReactNode;
}

function TypingDots() {
  return (
    <div className="flex w-fit gap-1 rounded-2xl rounded-bl-md border border-line px-3 py-2.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function Chat({ messages }: { messages: Msg[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      while (!cancelled) {
        setShown(0);
        await wait(700);
        for (let i = 0; i < messages.length; i++) {
          if (cancelled) return;
          if (messages[i].from === "bot") {
            setTyping(true);
            await wait(1000);
            if (cancelled) return;
            setTyping(false);
          } else {
            await wait(500);
          }
          setShown(i + 1);
          await wait(650);
        }
        await wait(3500);
      }
    })();

    return () => {
      cancelled = true;
      setTyping(false);
    };
  }, [inView, reduce, messages]);

  const visible = reduce ? messages.length : shown;

  return (
    <div ref={ref} className="flex flex-col gap-2 p-3">
      <AnimatePresence initial={false}>
        {messages.slice(0, visible).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className={`max-w-[88%] rounded-2xl px-3 py-2 text-[10.5px] leading-snug ${
              m.from === "user"
                ? "ml-auto rounded-br-md bg-black text-white"
                : "rounded-bl-md border border-line bg-white"
            }`}
          >
            {m.content}
          </motion.div>
        ))}
      </AnimatePresence>
      {typing && <TypingDots />}
    </div>
  );
}

const searchMessages = ({ previews: { search: s } }: Dictionary): Msg[] => [
  { from: "user", content: "/search xzboq" },
  {
    from: "bot",
    content: (
      <>
        <p className="font-semibold">@xzboq</p>
        <p className="mt-1 text-muted">{s.free}</p>
        <p className="text-muted">{s.notFound}</p>
        <p className="mt-1.5 inline-block rounded-full bg-black px-2 py-0.5 text-[9px] font-medium text-white">
          {s.canClaim}
        </p>
      </>
    ),
  },
  { from: "user", content: "/find 5" },
  {
    from: "bot",
    content: (
      <>
        <p className="font-semibold">{s.searching}</p>
        <p className="mt-1 text-muted">{s.checking}</p>
      </>
    ),
  },
];

const kiberMessages = ({ previews: { kiber: k } }: Dictionary): Msg[] => [
  { from: "user", content: "secure-bank-login.example" },
  {
    from: "bot",
    content: (
      <>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-black px-2 py-0.5 text-[9px] font-semibold tracking-wide text-white">
            DANGEROUS
          </span>
          <span className="font-semibold">92/100</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: "92%" }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-muted">{k.brand}</p>
        <p className="text-muted">{k.otp}</p>
      </>
    ),
  },
  { from: "user", content: k.userMsg },
  {
    from: "bot",
    content: (
      <>
        <p className="font-semibold">{k.noPanic}</p>
        <p className="mt-1 text-muted">{k.plan}</p>
      </>
    ),
  },
];

/* ───────────── Превью ───────────── */

function WishPoolPreview({ project }: { project: Project }) {
  const { t } = useI18n();
  return (
    <BrowserFrame>
      <div className="transition-transform duration-[4500ms] ease-in-out group-hover:-translate-y-[42%]">
        <Image
          // next/image с unoptimized не добавляет basePath к файлам из /public
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${project.image}`}
          alt={t.projects.screenshot(project.title)}
          width={1440}
          height={2050}
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 45vw, 92vw"
          className="h-auto w-full"
        />
      </div>
    </BrowserFrame>
  );
}

function WeatherPreview() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, 24, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setTemp(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView]);

  const bars = [42, 55, 70, 62, 48, 36];
  const hours = ["12", "14", "16", "18", "20", "22"];

  return (
    <PhoneFrame header={false}>
      <div ref={ref} className="flex flex-col items-center px-3 pt-8 text-center">
        <p className="text-[10px] text-muted">{t.previews.city}</p>
        <p className="mt-1 text-6xl font-semibold leading-none tracking-tighter">
          {temp}°
        </p>
        <p className="mt-1 text-[10px] text-muted">{t.previews.clear}</p>

        <motion.svg
          aria-hidden
          viewBox="0 0 24 24"
          className="mt-3 size-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </motion.svg>

        <div className="mt-4 flex h-16 w-full items-end justify-between gap-1.5">
          {bars.map((b, i) => (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <motion.div
                className="w-2 rounded-full bg-black"
                initial={{ height: 0 }}
                animate={inView ? { height: `${b}%` } : {}}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: "easeOut" }}
              />
              <span className="text-[8px] text-muted">{hours[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

export function Preview({ project }: { project: Project }) {
  const { t } = useI18n();
  const search = useMemo(() => searchMessages(t), [t]);
  const kiber = useMemo(() => kiberMessages(t), [t]);
  switch (project.preview) {
    case "image":
      return <WishPoolPreview project={project} />;
    case "search":
      return (
        <PhoneFrame title="KravlezSearch">
          <Chat messages={search} />
        </PhoneFrame>
      );
    case "kiber":
      return (
        <PhoneFrame title="Kiber Yordamchi">
          <Chat messages={kiber} />
        </PhoneFrame>
      );
    case "weather":
      return <WeatherPreview />;
  }
}
