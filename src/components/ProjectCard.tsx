"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { PointerEvent } from "react";
import type { Project } from "@/content/site";
import { Button } from "./Button";
import { useI18n } from "./I18nProvider";
import { ArrowUpRight } from "./Icons";
import { Preview } from "./Previews";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { t } = useI18n();
  // 3D-наклон
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  // Подсветка под курсором
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, color-mix(in srgb, var(--foreground) 7%, transparent), transparent 65%)`;

  function onMove(e: PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    ry.set((x / r.width - 0.5) * 6);
    rx.set(-(y / r.height - 0.5) * 6);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    mx.set(-400);
    my.set(-400);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
      style={{ perspective: 1000 }}
    >
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white transition-[box-shadow,border-color] duration-300 hover:border-black/15 hover:shadow-[0_30px_70px_-28px_rgba(0,0,0,0.3)]"
      >
        <motion.div
          aria-hidden
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="dot-grid-sm relative aspect-[10/11] overflow-hidden border-b border-line bg-gray-50">
          <Preview project={project} />
          <span className="absolute left-4 top-4 z-10 rounded-full border border-line bg-white/85 px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            {project.category}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>

          {project.url && (
            <div className="mt-auto pt-6">
              <Button href={project.url} external className="!px-5 !py-2.5">
                {t.projects.open}
                <ArrowUpRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}
