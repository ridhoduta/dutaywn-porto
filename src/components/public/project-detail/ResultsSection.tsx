"use client";

import type { ProjectResult } from "@/types/portfolio";
import { EmptyPlaceholder, PLACEHOLDER } from "./Section";

export interface ResultsSectionProps {
  results: ProjectResult[];
}

export function ResultsSection({ results }: ResultsSectionProps) {
  if (results.length === 0) return <EmptyPlaceholder />;

  return (
    <div className="space-y-4">
      {results.map((r, idx) => (
        <div
          key={r.id}
          className="flex gap-4 p-4 border-2 border-primary/20 hover:border-primary transition-colors duration-200"
        >
          <div className="flex-shrink-0 w-8 h-8 border-2 border-primary bg-secondary flex items-center justify-center font-display text-[13px] font-extrabold text-primary">
            {idx + 1}
          </div>
          <div>
            <h3 className="font-headline-md text-[15px] font-bold text-primary mb-1">
              {r.title || PLACEHOLDER}
            </h3>
            <p className="font-body-md text-[13px] text-primary/70 leading-relaxed">
              {r.description || PLACEHOLDER}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
