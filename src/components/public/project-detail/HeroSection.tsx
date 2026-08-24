"use client";

import type { ProjectWithDetails } from "@/types/portfolio";
import { HeroCarousel } from "./HeroCarousel";
import { PLACEHOLDER } from "./Section";

export interface HeroSectionProps {
  project: ProjectWithDetails;
}

export function HeroSection({ project }: HeroSectionProps) {
  const heroImages = project.image_urls?.length > 0 ? project.image_urls : [];

  return (
    <section id="overview" className="scroll-mt-28 space-y-8">
      {/* Hero image */}
      <HeroCarousel images={heroImages} title={project.title} />

      {/* Title & meta */}
      <div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-[40px] font-extrabold text-primary leading-tight mb-4">
          {project.title}
        </h1>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.role && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-primary font-code text-code text-[11px] text-primary">
              <span className="material-symbols-outlined text-[14px]">
                person
              </span>
              {project.role}
            </span>
          )}
          {project.duration && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-primary font-code text-code text-[11px] text-primary">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              {project.duration}
            </span>
          )}
          {project.platform && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-primary font-code text-code text-[11px] text-primary">
              <span className="material-symbols-outlined text-[14px]">
                devices
              </span>
              {project.platform}
            </span>
          )}
          {project.team && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-primary font-code text-code text-[11px] text-primary">
              <span className="material-symbols-outlined text-[14px]">
                group
              </span>
              {project.team}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="font-body-lg text-body-lg text-primary/75 leading-relaxed border-l-4 border-primary pl-5">
          {project.description || PLACEHOLDER}
        </p>
      </div>

      {/* Technologies */}
      {project.technologies.length > 0 && (
        <div>
          <p className="font-label-caps text-label-caps text-primary/40 mb-3">
            TECH STACK
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech.id}
                className="px-3 py-1.5 border-2 border-primary bg-secondary text-primary font-code text-code text-[12px] hover:bg-primary hover:text-secondary transition-colors"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      {(project.demo_url || project.github_url) && (
        <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-primary/10">
          {project.demo_url && project.demo_url !== "#" && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-primary bg-primary text-secondary font-label-caps text-label-caps hover:bg-secondary hover:text-primary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                open_in_new
              </span>
              Live Demo
            </a>
          )}
          {project.github_url && project.github_url !== "#" && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-primary bg-secondary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                code
              </span>
              Source Code
            </a>
          )}
        </div>
      )}
    </section>
  );
}
