"use client";

import { animate, AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { playgroundStrings, scanPresets } from "@/content/playground";
import { terminalStrings } from "@/content/terminal";
import {
  analyzeUsername,
  generateCandidates,
  scanInput,
  type Rarity,
  type ScanLevel,
} from "@/lib/terminal-tools";
import { useI18n } from "./I18nProvider";
import { MaskLines } from "./MaskLines";
import { Reveal } from "./Reveal";

const levelColor: Record<ScanLevel, string> = {
  safe: "#10b981",
  suspicious: "#f59e0b",
  dangerous: "#f43f5e",
};

const rarityColor: Record<Rarity, string> = {
  common: "#9ca3af",
  rare: "#10b981",
  epic: "#38bdf8",
  legendary: "#f59e0b",
};

/** Число, которое плавно «доезжает» до нового значения. */
function Num({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const c = animate(shown, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className={className}>{shown}</span>;
}

function useDebounced<T>(value: T, ms = 220): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

const inputCls =
  "w-full rounded-2xl border border-line bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-black";

const chipCls =
  "rounded-full border border-line px-3 py-1.5 text-left font-mono text-[11px] text-muted transition-all hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white";

function CardShell({
  index,
  title,
  sub,
  live,
  children,
}: {
  index: string;
  title: string;
  sub: string;
  live: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dot-grid-sm relative flex w-full flex-col rounded-[28px] border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-wider text-muted">{index}</span>
        <span className="flex items-center gap-2 rounded-full border border-line bg-white/85 px-2.5 py-1 font-mono text-[10px] text-muted backdrop-blur">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          {live}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{sub}</p>
      <div className="mt-6 flex flex-1 flex-col gap-5">{children}</div>
    </div>
  );
}

/* ───────────── Сканер ───────────── */

function Gauge({ score, level }: { score: number; level: ScanLevel }) {
  return (
    <div className="relative mx-auto w-full max-w-[240px]">
      <svg viewBox="0 0 200 112" className="w-full" aria-hidden>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--line)" strokeWidth="14" strokeLinecap="round" />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: Math.max(score, 1.5) / 100, stroke: levelColor[level] }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <Num value={score} className="text-5xl font-semibold leading-none tracking-tighter" />
      </div>
    </div>
  );
}

function Scanner() {
  const { locale } = useI18n();
  const pg = playgroundStrings[locale];
  const tr = terminalStrings[locale];
  const [value, setValue] = useState(scanPresets[1]);
  const debounced = useDebounced(value);
  const result = useMemo(() => (debounced.trim() ? scanInput(debounced) : null), [debounced]);
  const score = result?.score ?? 0;
  const level = result?.level ?? "safe";

  return (
    <CardShell index="A" title={pg.scan.title} sub={pg.scan.sub} live={pg.live}>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {pg.scan.label}
        </span>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={pg.scan.placeholder}
          rows={2}
          spellCheck={false}
          className={`${inputCls} resize-none`}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">{pg.scan.presets}</span>
        {scanPresets.map((p) => (
          <button key={p} type="button" onClick={() => setValue(p)} className={chipCls}>
            {p.length > 34 ? `${p.slice(0, 32)}…` : p}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-white/70 p-5 backdrop-blur">
        {result ? (
          <>
            <Gauge score={score} level={level} />
            <div className="mt-3 flex flex-col items-center gap-1">
              <motion.span
                key={level}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em]"
                style={{ background: levelColor[level], color: "#fff" }}
              >
                {tr.scan.level[level]}
              </motion.span>
              <span className="font-mono text-[11px] text-muted">
                {pg.scan.score}
                {result.host ? ` · ${result.host}` : ""}
              </span>
            </div>

            <ul className="mt-5 space-y-2">
              <AnimatePresence initial={false} mode="popLayout">
                {result.signals.map((s) => (
                  <motion.li
                    key={s.code + (s.detail ?? "")}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex gap-3 text-sm leading-snug"
                  >
                    <span className="mt-0.5 shrink-0 rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                      {s.code}
                    </span>
                    <span>{tr.scan.signal(s)}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {!result.signals.length && (
                <li className="text-center text-sm text-muted">{tr.scan.none}</li>
              )}
            </ul>
          </>
        ) : (
          <p className="py-10 text-center text-sm text-muted">{pg.scan.empty}</p>
        )}
      </div>
    </CardShell>
  );
}

/* ───────────── Охотник ───────────── */

function Hunter() {
  const { locale } = useI18n();
  const pg = playgroundStrings[locale];
  const tr = terminalStrings[locale];
  const [value, setValue] = useState("xzboq");
  const [names, setNames] = useState<string[]>([]);
  const result = useMemo(() => (value.trim() ? analyzeUsername(value) : null), [value]);

  // Кандидаты генерируются на клиенте, чтобы SSR и гидрация совпадали
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNames(generateCandidates(6));
  }, []);

  const color = result?.rarity ? rarityColor[result.rarity] : "#f43f5e";

  return (
    <CardShell index="B" title={pg.hunt.title} sub={pg.hunt.sub} live={pg.live}>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {pg.hunt.label}
        </span>
        <div className="flex items-center rounded-2xl border border-line bg-transparent px-4 transition-colors focus-within:border-black">
          <span className="font-mono text-sm text-muted">@</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/^@/, ""))}
            placeholder={pg.hunt.placeholder}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            maxLength={40}
            className="w-full bg-transparent px-1 py-3 font-mono text-sm outline-none placeholder:text-muted/60"
          />
        </div>
      </label>

      <div className="rounded-2xl border border-line bg-white/70 p-5 backdrop-blur">
        {result ? (
          result.problem ? (
            <motion.p
              key={result.problem}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium"
              style={{ color: "#f43f5e" }}
            >
              @{result.name} — {tr.hunt.invalid[result.problem]}
            </motion.p>
          ) : (
            <div>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-mono text-lg font-semibold">@{result.name}</p>
                  <motion.span
                    key={result.rarity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ background: color, color: "#fff" }}
                  >
                    {tr.hunt.rarity[result.rarity!]}
                  </motion.span>
                </div>
                <Num value={result.score ?? 0} className="text-5xl font-semibold leading-none tracking-tighter" />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full rounded-full"
                  initial={false}
                  animate={{ width: `${result.score}%`, background: color }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(result.traits ?? []).map((k) => (
                  <li key={k} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                    {tr.hunt.traits[k] ?? k}
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : (
          <p className="py-6 text-center text-sm text-muted">{pg.hunt.empty}</p>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs text-muted">{pg.hunt.pick}</span>
          <button
            type="button"
            onClick={() => setNames(generateCandidates(6))}
            className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            🎲 {pg.hunt.generate}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {names.map((n) => (
            <button key={n} type="button" onClick={() => setValue(n)} className={chipCls}>
              @{n}
            </button>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

export function Playground() {
  const { locale } = useI18n();
  const pg = playgroundStrings[locale];

  return (
    <section
      id="playground"
      className="mx-auto w-full max-w-7xl scroll-mt-16 px-5 pb-28 sm:px-8 sm:pb-44"
    >
      <Reveal>
        <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted">
          <span className="font-mono">02</span>
          <span aria-hidden className="h-px w-10 bg-line" />
          {pg.eyebrow}
        </p>
        <MaskLines
          key={pg.title[0]}
          className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-7xl"
          lines={[{ text: pg.title[0] }, { text: pg.title[1], className: "text-muted" }]}
        />
        <p className="mt-6 max-w-xl text-lg text-muted">{pg.lead}</p>
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <Reveal className="flex">
          <Scanner />
        </Reveal>
        <Reveal delay={0.1} className="flex">
          <Hunter />
        </Reveal>
      </div>
    </section>
  );
}
