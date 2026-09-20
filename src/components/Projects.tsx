"use client";

import { projectData, type Project } from "@/content/site";
import { useI18n } from "./I18nProvider";
import { MaskLines } from "./MaskLines";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

export function Projects() {
  const { t } = useI18n();
  const projects: Project[] = projectData.map((p, i) => ({
    ...p,
    ...t.projects.items[i],
  }));

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-7xl scroll-mt-16 px-5 py-28 sm:px-8 sm:py-44"
    >
      <Reveal>
        <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted">
          <span className="font-mono">01</span>
          <span aria-hidden className="h-px w-10 bg-line" />
          {t.projects.eyebrow}
        </p>
        <MaskLines
          key={t.projects.title[0]}
          className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-7xl"
          lines={[
            { text: t.projects.title[0] },
            { text: t.projects.title[1], className: "text-muted" },
          ]}
        />
        <p className="mt-6 max-w-xl text-lg text-muted">{t.projects.lead}</p>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
