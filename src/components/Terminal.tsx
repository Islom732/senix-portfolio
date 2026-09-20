"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { contacts, locales, projectData, type Locale } from "@/content/site";
import { terminalStrings } from "@/content/terminal";
import {
  analyzeUsername,
  generateCandidates,
  scanInput,
} from "@/lib/terminal-tools";
import { loadVisitors } from "@/lib/visitors";
import { useI18n } from "./I18nProvider";
import { useTheme } from "./ThemeProvider";

export const TERMINAL_EVENT = "senix:terminal";
export const MATRIX_EVENT = "senix:matrix";

type Tone = "cmd" | "dim" | "ok" | "warn" | "bad" | "accent" | "plain";

interface Line {
  id: number;
  text: string;
  tone: Tone;
  href?: string;
}

type Effect = "matrix" | "confetti" | null;

const toneClass: Record<Tone, string> = {
  cmd: "text-white",
  plain: "text-white/85",
  dim: "text-white/45",
  ok: "text-emerald-400",
  warn: "text-amber-300",
  bad: "text-rose-400",
  accent: "text-sky-300",
};

const COMMANDS = [
  "about", "projects", "open", "skills", "contact", "scan", "hunt", "lang",
  "theme", "visitors", "matrix", "sudo hire me", "clear", "exit", "help", "whoami",
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const bar = (score: number, width = 20) => {
  const filled = Math.round((score / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
};

/* ───────────── Эффекты на весь экран ───────────── */

function ScreenEffect({ kind, onDone }: { kind: Exclude<Effect, null>; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const started = performance.now();
    const duration = kind === "matrix" ? 5500 : 3200;
    let raf = 0;

    if (kind === "matrix") {
      const size = 16;
      const cols = Math.ceil(W / size);
      const drops = Array.from({ length: cols }, () => Math.random() * -40);
      const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ｦｱｳｴｵ";
      ctx.font = `${size}px monospace`;
      const frame = (now: number) => {
        const t = now - started;
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,0.09)";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
        if (t < duration - 1200) {
          for (let i = 0; i < cols; i++) {
            const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
            const y = drops[i] * size;
            ctx.fillStyle = "#eaffea";
            ctx.fillText(ch, i * size, y);
            ctx.fillStyle = "rgba(40,255,110,0.9)";
            ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, y - size);
            if (y > H && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 1;
          }
        }
        if (t < duration) raf = requestAnimationFrame(frame);
        else onDone();
      };
      raf = requestAnimationFrame(frame);
    } else {
      const colors = ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ffffff"];
      const parts = Array.from({ length: 160 }, () => ({
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H * 0.75,
        vx: (Math.random() - 0.5) * 16,
        vy: -8 - Math.random() * 14,
        r: 3 + Math.random() * 4,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
      const frame = (now: number) => {
        const t = now - started;
        ctx.clearRect(0, 0, W, H);
        for (const p of parts) {
          p.vy += 0.42;
          p.vx *= 0.99;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, 1 - t / duration);
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
          ctx.restore();
        }
        if (t < duration) raf = requestAnimationFrame(frame);
        else onDone();
      };
      raf = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`pointer-events-none fixed inset-0 z-[80] ${kind === "matrix" ? "bg-black/55" : ""}`}
    >
      <canvas ref={ref} className="size-full" />
    </motion.div>
  );
}

/* ───────────── Терминал ───────────── */

export function Terminal() {
  const { t, locale, setLocale } = useI18n();
  const { toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [effect, setEffect] = useState<Effect>(null);

  const idRef = useRef(0);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);
  const tr = terminalStrings[locale];

  const print = useCallback((text: string, tone: Tone = "plain", href?: string) => {
    setLines((l) => [...l, { id: idRef.current++, text, tone, href }]);
  }, []);

  // Кнопка-запуск появляется после интро
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(id);
  }, []);

  // Горячие клавиши и событие из hero
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const typing =
        !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    const onEvent = () => setOpen((o) => !o);
    const onMatrix = () => setEffect("matrix");
    window.addEventListener("keydown", onKey);
    window.addEventListener(TERMINAL_EVENT, onEvent);
    window.addEventListener(MATRIX_EVENT, onMatrix);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TERMINAL_EVENT, onEvent);
      window.removeEventListener(MATRIX_EVENT, onMatrix);
    };
  }, []);

  // Приветствие при первом открытии + фокус
  useEffect(() => {
    if (!open) return;
    if (!booted.current) {
      booted.current = true;
      tr.boot.forEach((b, i) => print(b, i === 0 ? "accent" : "dim"));
    }
    const id = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(id);
  }, [open, print, tr]);

  // Автопрокрутка вниз
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines, busy]);

  async function run(input: string) {
    const raw = input.trim();
    print(`guest@senix:~$ ${raw}`, "cmd");
    if (!raw) return;
    history.current.unshift(raw);
    cursor.current = -1;

    const [cmdRaw, ...rest] = raw.split(/\s+/);
    const cmd = cmdRaw.toLowerCase();
    const arg = rest.join(" ");
    setBusy(true);
    try {
      switch (cmd) {
        case "help":
        case "?": {
          print(tr.helpTitle, "accent");
          const w = Math.max(...tr.help.map((h) => h.cmd.length)) + 2;
          tr.help.forEach((h) => print(`  ${h.cmd.padEnd(w)}${h.desc}`));
          break;
        }
        case "about":
          t.about.paragraphs.forEach((p) => print(p));
          break;
        case "whoami":
          print(tr.whoami);
          break;
        case "projects":
        case "ls": {
          print(tr.projectsTitle, "accent");
          projectData.forEach((p, i) => {
            const item = t.projects.items[i];
            print(`  ${i + 1}. ${p.title} — ${item.category}${p.url ? "  ↗" : ""}`);
            print(`     ${p.tags.join(" · ")}`, "dim");
          });
          break;
        }
        case "open": {
          if (!arg) {
            print(tr.usage.open, "warn");
            break;
          }
          const n = Number(arg);
          const idx = Number.isInteger(n)
            ? n - 1
            : projectData.findIndex((p) => p.title.toLowerCase().includes(arg.toLowerCase()));
          const p = projectData[idx];
          if (!p) {
            print(tr.usage.open, "warn");
          } else if (!p.url) {
            print(tr.noLive(p.title), "warn");
          } else {
            print(tr.opening(p.title), "ok");
            window.open(p.url, "_blank", "noopener,noreferrer");
          }
          break;
        }
        case "skills":
          print(tr.skillsTitle, "accent");
          t.about.skills.forEach((g) => print(`  ${g.title.padEnd(16)}${g.items.join(", ")}`));
          break;
        case "contact":
        case "contacts":
          print(tr.contactTitle, "accent");
          contacts.forEach((c) => print(`  ${c.label}: ${c.handle}`, "plain", c.href));
          break;
        case "lang": {
          const l = arg.toLowerCase() as Locale;
          if (!(locales as readonly string[]).includes(l)) {
            print(tr.usage.lang, "warn");
          } else {
            setLocale(l);
            print(terminalStrings[l].langSet(l.toUpperCase()), "ok");
          }
          break;
        }
        case "theme": {
          const a = arg.toLowerCase();
          if (a !== "dark" && a !== "light") {
            print(tr.usage.theme, "warn");
          } else {
            if (document.documentElement.dataset.theme !== a) toggleTheme();
            print(tr.themeSet(a), "ok");
          }
          break;
        }
        case "visitors":
        case "stats": {
          print(tr.visitors.loading, "dim");
          const n = await loadVisitors();
          if (n === null) print(tr.visitors.unavailable, "warn");
          else print(tr.visitors.count(n.toLocaleString(locale)), "ok");
          break;
        }
        case "matrix":
          print(tr.matrix, "ok");
          setEffect("matrix");
          break;
        case "clear":
          setLines([]);
          break;
        case "exit":
        case "quit":
          setOpen(false);
          break;
        case "sudo": {
          if (arg.toLowerCase() !== "hire me") {
            print(tr.sudoDenied, "warn");
            break;
          }
          for (const [i, l] of tr.hire.entries()) {
            print(l, i === 0 ? "dim" : "ok");
            await sleep(450);
          }
          setEffect("confetti");
          await sleep(500);
          setOpen(false);
          document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
          break;
        }
        case "hunt": {
          if (!arg) {
            print(tr.hunt.generating, "dim");
            await sleep(450);
            print(tr.hunt.candidates, "accent");
            for (const name of generateCandidates(6)) {
              const r = analyzeUsername(name);
              print(`  @${name.padEnd(8)} ${bar(r.score ?? 0, 10)} ${r.score}  ${tr.hunt.rarity[r.rarity ?? "common"]}`);
              await sleep(160);
            }
            print(tr.hunt.note, "dim");
            break;
          }
          const r = analyzeUsername(arg);
          if (r.problem) {
            print(`@${r.name} — ${tr.hunt.invalid[r.problem]}`, "bad");
            break;
          }
          const tone: Tone =
            r.rarity === "legendary" ? "warn" : r.rarity === "epic" ? "accent" : r.rarity === "rare" ? "ok" : "plain";
          print(`@${r.name} — ${tr.hunt.formatOk}`, "ok");
          print(`  ${tr.hunt.score}: ${bar(r.score ?? 0)} ${r.score}/100 — ${tr.hunt.rarity[r.rarity!]}`, tone);
          (r.traits ?? []).forEach((k) => print(`  • ${tr.hunt.traits[k] ?? k}`, "dim"));
          print(tr.hunt.note, "dim");
          break;
        }
        case "scan": {
          if (!arg) {
            print(tr.usage.scan, "warn");
            break;
          }
          for (const step of tr.scan.running) {
            print(step, "dim");
            await sleep(320);
          }
          const r = scanInput(arg);
          const tone: Tone = r.level === "dangerous" ? "bad" : r.level === "suspicious" ? "warn" : "ok";
          print(`${tr.scan.verdict}: ${tr.scan.level[r.level]}`, tone);
          print(`${bar(r.score)} ${r.score}/100`, tone);
          if (r.host) print(`host: ${r.host}`, "dim");
          if (r.signals.length) {
            print(tr.scan.evidence, "accent");
            r.signals.forEach((s) => print(`  ${s.code} · ${tr.scan.signal(s)}`));
          } else {
            print(tr.scan.none, "ok");
          }
          print(tr.scan.note, "dim");
          break;
        }
        default:
          print(tr.unknown(cmdRaw), "bad");
      }
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !busy) {
      const v = value;
      setValue("");
      void run(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor.current + 1, history.current.length - 1);
      if (next >= 0 && history.current[next] !== undefined) {
        cursor.current = next;
        setValue(history.current[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor.current - 1;
      cursor.current = Math.max(next, -1);
      setValue(next >= 0 ? history.current[next] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const v = value.toLowerCase();
      const hit = v ? COMMANDS.find((c) => c.startsWith(v)) : undefined;
      if (hit) setValue(hit + (hit.endsWith("hire me") || hit === "exit" ? "" : " "));
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <>
      <AnimatePresence>
        {effect && <ScreenEffect key={effect} kind={effect} onDone={() => setEffect(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {ready && !open && (
          <motion.button
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            aria-label={tr.open}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="always-dark fixed bottom-5 right-5 z-[65] flex items-center gap-2 rounded-full border border-line bg-black px-4 py-2.5 font-mono text-sm text-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.55)]"
          >
            <span className="text-emerald-400">›_</span>
            <span className="hidden text-white/60 sm:inline">Ctrl K</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal"
            role="dialog"
            aria-label="Terminal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={() => inputRef.current?.focus()}
            className="always-dark fixed inset-x-3 bottom-3 z-[70] flex h-[min(70vh,480px)] flex-col overflow-hidden rounded-2xl border border-line bg-black font-mono text-[12.5px] leading-relaxed text-white shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[min(680px,calc(100vw-3rem))]"
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <button
                type="button"
                aria-label={tr.close}
                onClick={() => setOpen(false)}
                className="size-3 rounded-full bg-rose-500 transition-transform hover:scale-125"
              />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-500" />
              <span className="ml-2 truncate text-xs text-white/45">senix-shell — guest@senix</span>
              <span className="ml-auto hidden text-[10px] text-white/30 sm:inline">esc</span>
            </div>

            <div
              ref={bodyRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-3"
            >
              {lines.map((l) =>
                l.href ? (
                  <a
                    key={l.id}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block whitespace-pre-wrap break-words underline decoration-white/30 underline-offset-4 hover:decoration-white ${toneClass.accent}`}
                  >
                    {l.text}
                  </a>
                ) : (
                  <div key={l.id} className={`whitespace-pre-wrap break-words ${toneClass[l.tone]}`}>
                    {l.text}
                  </div>
                ),
              )}
              {busy && <div className="text-white/40">…</div>}
            </div>

            <label className="flex items-center gap-2 border-t border-line px-4 py-3">
              <span className="shrink-0 text-emerald-400">guest@senix:~$</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={tr.placeholder}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                aria-label="Terminal input"
                className="min-w-0 flex-1 bg-transparent text-white caret-emerald-400 outline-none placeholder:text-white/25"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
