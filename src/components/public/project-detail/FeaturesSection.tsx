"use client";

import { useState } from "react";
import type { ProjectFeature } from "@/types/portfolio";
import { EmptyPlaceholder, PLACEHOLDER, FALLBACK_IMG } from "./Section";
import { ImageLightbox } from "./ImageLightbox";

export interface FeaturesSectionProps {
  features: ProjectFeature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (features.length === 0) return <EmptyPlaceholder />;

  return (
    <>
      <div className="space-y-6">
        {features.map((f, idx) => (
          <div
            key={f.id}
            className={`flex flex-col ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } gap-6 border-2 border-primary/20 hover:border-primary transition-colors duration-200 overflow-hidden group`}
          >
            {/* Image */}
            {f.image_url ? (
              <button
                onClick={() => setLightbox(f.image_url)}
                className="relative flex-shrink-0 w-full md:w-60 h-44 overflow-hidden bg-primary/5 cursor-pointer block text-left"
                aria-label={`Lihat gambar fitur ${f.title}`}
              >
                <img
                  src={f.image_url}
                  alt={f.title}
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
              </button>
            ) : (
              <div className="flex-shrink-0 w-full md:w-60 h-44 bg-primary/5 flex items-center justify-center border-r-2 border-primary/10">
                <span className="material-symbols-outlined text-[40px] text-primary/20">
                  image
                </span>
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col justify-center p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-code text-code text-primary/40 text-[11px]">
                  FITUR {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-headline-md text-[17px] font-bold text-primary mb-2">
                {f.title || PLACEHOLDER}
              </h3>
              <p className="font-body-md text-body-md text-primary/70 leading-relaxed text-[14px]">
                {f.description || PLACEHOLDER}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        src={lightbox}
        alt="Fitur preview"
        onClose={() => setLightbox(null)}
      />
    </>
  );
}
