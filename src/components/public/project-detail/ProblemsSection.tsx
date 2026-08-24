"use client";

import type { ProjectProblem } from "@/types/portfolio";
import { EmptyPlaceholder, PLACEHOLDER } from "./Section";

export interface ProblemsSectionProps {
  problems: ProjectProblem[];
}

export function ProblemsSection({ problems }: ProblemsSectionProps) {
  if (problems.length === 0) return <EmptyPlaceholder />;

  return (
    <div className="space-y-4">
      {problems.map((p, idx) => (
        <div
          key={p.id}
          className="flex gap-5 p-5 border-2 border-primary/20 hover:border-primary transition-colors duration-200 group"
        >
          {/* Index number */}
          <div className="flex-shrink-0 w-10 h-10 border-2 border-primary bg-primary text-secondary font-display text-[18px] font-extrabold flex items-center justify-center">
            {String(idx + 1).padStart(2, "0")}
          </div>
          <div>
            <h3 className="font-headline-md text-[16px] font-bold text-primary mb-1 group-hover:text-primary transition-colors">
              {p.title || PLACEHOLDER}
            </h3>
            <p className="font-body-md text-body-md text-primary/70 leading-relaxed">
              {p.description || PLACEHOLDER}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
