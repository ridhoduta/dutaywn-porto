"use client";

import { useState } from "react";
import type { ProjectDesign } from "@/types/portfolio";
import { EmptyPlaceholder, PLACEHOLDER, FALLBACK_IMG } from "./Section";
import { ImageLightbox } from "./ImageLightbox";

const DESIGN_TYPE_LABEL: Record<string, string> = {
  wireframe: "Wireframe",
  mockup: "Mockup",
  prototype: "Prototype",
  uml: "UML Diagram",
  flowchart: "Flowchart",
};

export interface DesignsSectionProps {
  designs: ProjectDesign[];
}

export function DesignsSection({ designs }: DesignsSectionProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (designs.length === 0) return <EmptyPlaceholder />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {designs.map((d) => (
          <div
            key={d.id}
            className="border-2 border-primary/20 hover:border-primary transition-colors duration-200 group overflow-hidden"
          >
            {/* Image */}
            <button
              onClick={() => setLightbox(d.image_url)}
              className="relative w-full h-48 block overflow-hidden bg-primary/5 cursor-pointer"
              aria-label={`Lihat ${d.title}`}
            >
              <img
                src={d.image_url}
                alt={d.title}
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_IMG)
                    e.currentTarget.src = FALLBACK_IMG;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  zoom_in
                </span>
              </div>
              {/* Type badge */}
              <div className="absolute top-2 left-2 bg-primary text-secondary font-label-caps text-label-caps px-2 py-0.5 text-[10px]">
                {DESIGN_TYPE_LABEL[d.type] ?? d.type}
              </div>
            </button>

            {/* Caption */}
            <div className="p-4">
              <h3 className="font-headline-md text-[15px] font-bold text-primary mb-1">
                {d.title || PLACEHOLDER}
              </h3>
              <p className="font-body-md text-[13px] text-primary/60 leading-relaxed">
                {d.description || PLACEHOLDER}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        src={lightbox}
        alt="Desain preview"
        onClose={() => setLightbox(null)}
      />
    </>
  );
}
