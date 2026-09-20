"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { featureStrings, type BriefKind } from "@/content/features";
import { contacts } from "@/content/site";
import { copyText } from "@/lib/clipboard";
import { useI18n } from "./I18nProvider";
import { ArrowUpRight } from "./Icons";

const KINDS: BriefKind[] = ["site", "bot", "app", "other"];

const field =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/60 sm:text-sm";

/** Форма-бриф: собирает готовое сообщение и открывает чат в Telegram. */
export function Brief() {
  const { locale } = useI18n();
  const f = featureStrings[locale].brief;
  const tg = contacts.find((c) => c.kind === "telegram");
  const [kind, setKind] = useState<BriefKind>("site");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  if (!tg) return null;

  const text = f.template({ name: name.trim(), kind: f.kinds[kind], message: message.trim() });
  const href = `${tg.href}?text=${encodeURIComponent(text)}`;

  async function onCopy() {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mt-14">
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{f.title}</h3>
      <p className="mt-2 max-w-lg text-white/60">{f.sub}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-white/55">
              {f.kindLabel}
            </legend>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={kind === k}
                  onClick={() => setKind(k)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    kind === k
                      ? "border-white bg-white text-black"
                      : "border-white/20 text-white/70 hover:border-white/60 hover:text-white"
                  }`}
                >
                  {f.kinds[k]}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/55">
              {f.name}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={f.namePh}
              maxLength={60}
              autoComplete="given-name"
              className={field}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/55">
              {f.message}
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={f.messagePh}
              rows={4}
              maxLength={800}
              className={`${field} resize-none`}
            />
          </label>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 p-5">
            <p className="mb-3 font-mono text-[11px] text-white/45">
              {tg.handle} · Telegram
            </p>
            <p className="whitespace-pre-wrap break-words rounded-2xl rounded-tl-md bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/90">
              {text}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95"
            >
              {f.open}
              <ArrowUpRight size={14} />
            </a>
            <button
              type="button"
              onClick={onCopy}
              className="min-w-[8.5rem] rounded-full border border-white/25 px-6 py-3 text-sm text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "c" : "n"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {copied ? f.copied : f.copy}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <p className="mt-3 text-xs text-white/45">{f.hint}</p>
        </div>
      </div>
    </div>
  );
}
