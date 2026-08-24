"use client";

import type { ProjectLearning } from "@/types/portfolio";
import { EmptyPlaceholder, PLACEHOLDER } from "./Section";

export interface LearningsSectionProps {
  learnings: ProjectLearning[];
}

export function LearningsSection({ learnings }: LearningsSectionProps) {
  if (learnings.length === 0) return <EmptyPlaceholder />;

  return (
    <div className="space-y-3">
      {learnings.map((l, idx) => (
        <div
          key={l.id}
          className="flex gap-4 items-start p-4 border-2 border-primary/20 hover:border-primary transition-colors duration-200"
        >
          <span className="flex-shrink-0 mt-0.5 w-6 h-6 bg-primary text-secondary font-display text-[11px] font-extrabold flex items-center justify-center">
            {idx + 1}
          </span>
          <p className="font-body-md text-body-md text-primary/80 leading-relaxed">
            {l.content || PLACEHOLDER}
          </p>
        </div>
      ))}
    </div>
  );
}
