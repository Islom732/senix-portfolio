"use client";

import { contacts } from "@/content/site";
import { useI18n } from "./I18nProvider";
import { ArrowUpRight, ContactIcon } from "./Icons";
import { MaskLines } from "./MaskLines";
import { Reveal } from "./Reveal";

export function Contact() {
  const { t } = useI18n();
  return (
    <section
      id="contacts"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-5 pb-28 sm:px-8 sm:pb-44"
    >
      <Reveal>
        <div className="always-dark relative overflow-hidden rounded-[32px] border border-line bg-black p-7 text-white sm:rounded-[48px] sm:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_80%_at_85%_0%,black,transparent_70%)]"
          />

          <div className="relative">
            <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-white/60">
              <span className="font-mono">04</span>
              <span aria-hidden className="h-px w-10 bg-white/25" />
              {t.contact.eyebrow}
            </p>
            <MaskLines
              key={t.contact.title[0]}
              className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-7xl lg:text-8xl"
              lines={[
                { text: t.contact.title[0] },
                { text: t.contact.title[1], className: "text-white/45" },
              ]}
            />
            <p className="mt-6 max-w-lg text-lg text-white/60">
              {t.contact.lead}
            </p>

            <ul className="mt-14 border-t border-white/15">
              {contacts.map((c) => (
                <li key={c.kind} className="border-b border-white/15">
                  <a
                    href={c.href}
                    target={c.kind === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-4 overflow-hidden px-1 py-6 transition-[padding,color] duration-500 hover:px-5 hover:text-black sm:gap-6 sm:py-7"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                    />
                    <span className="relative text-white/60 transition-colors duration-500 group-hover:text-black">
                      <ContactIcon kind={c.kind} />
                    </span>
                    <span className="relative w-24 text-sm text-white/60 transition-colors duration-500 group-hover:text-black/60 sm:w-32">
                      {c.label}
                    </span>
                    <span className="relative flex-1 truncate text-xl font-medium tracking-tight sm:text-3xl">
                      {c.handle}
                    </span>
                    <span className="relative text-white/60 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black">
                      <ArrowUpRight size={22} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
