"use client";

import type { ProjectSolution } from "@/types/portfolio";
import { EmptyPlaceholder, PLACEHOLDER } from "./Section";

export interface SolutionsSectionProps {
  solutions: ProjectSolution[];
}

export function SolutionsSection({ solutions }: SolutionsSectionProps) {
  if (solutions.length === 0) return <EmptyPlaceholder />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {solutions.map((s) => (
        <div
          key={s.id}
          className="p-5 border-2 border-primary/20 hover:border-primary hover:-translate-y-0.5 transition-all duration-200 group"
        >
          {/* Icon */}
          <div className="mb-3 w-10 h-10 border-2 border-primary bg-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] text-primary">
              {s.icon || "check"}
            </span>
          </div>
          <h3 className="font-headline-md text-[16px] font-bold text-primary mb-2">
            {s.title || PLACEHOLDER}
          </h3>
          <p className="font-body-md text-body-md text-primary/70 leading-relaxed text-[14px]">
            {s.description || PLACEHOLDER}
          </p>
        </div>
      ))}
    </div>
  );
}
