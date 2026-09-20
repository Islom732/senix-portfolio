"use client";

import { CountUp } from "./CountUp";
import { useI18n } from "./I18nProvider";
import { Reveal } from "./Reveal";
import { ScrollText } from "./ScrollText";

export function About() {
  const { t } = useI18n();
  const { eyebrow, paragraphs, facts, skills } = t.about;
  return (
    <section id="about" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 sm:py-44">
        <Reveal>
          <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted">
            <span className="font-mono">03</span>
            <span aria-hidden className="h-px w-10 bg-line" />
            {eyebrow}
          </p>
        </Reveal>

        <ScrollText
          key={paragraphs[0]}
          text={paragraphs[0]}
          className="mt-8 max-w-5xl text-3xl font-semibold leading-[1.15] tracking-tighter sm:text-5xl lg:text-6xl"
        />

        <div className="mt-24 grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal delay={0.05}>
            <p className="text-lg leading-relaxed text-muted">{paragraphs[1]}</p>
            <dl className="mt-12 grid grid-cols-3 gap-4">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-line p-4 transition-colors hover:border-black sm:p-5"
                >
                  <dt className="text-4xl font-semibold tracking-tighter sm:text-5xl">
                    <CountUp to={Number(f.value)} />
                  </dt>
                  <dd className="mt-2 text-xs leading-snug text-muted">
                    {f.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="divide-y divide-line border-y border-line">
              {skills.map((group) => (
                <div
                  key={group.title}
                  className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr]"
                >
                  <dt className="text-sm font-medium">{group.title}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line px-3 py-1 text-sm text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
