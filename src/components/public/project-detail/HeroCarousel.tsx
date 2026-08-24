"use client";

import { useState } from "react";
import { FALLBACK_IMG } from "./Section";
import { ImageLightbox } from "./ImageLightbox";

export interface HeroCarouselProps {
  images: string[];
  title: string;
}

export function HeroCarousel({ images, title }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const urls = images.length > 0 ? images : [FALLBACK_IMG];

  const prev = () => setCurrent((c) => (c - 1 + urls.length) % urls.length);
  const next = () => setCurrent((c) => (c + 1) % urls.length);

  return (
    <>
      <div className="relative w-full border-2 border-primary overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,102,1)] bg-primary/5 group">
        <div
          className="relative h-[280px] sm:h-[380px] md:h-[440px] cursor-pointer"
          onClick={() => setLightbox(urls[current])}
          aria-label={`Preview gambar ${current + 1}`}
        >
          <img
            src={urls[current]}
            alt={`${title} — gambar ${current + 1}`}
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMG)
                e.currentTarget.src = FALLBACK_IMG;
            }}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102"
          />

          {/* Hover zoom overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center pointer-events-none">
            <span className="material-symbols-outlined text-[36px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary/80 p-2 border-2 border-secondary">
              zoom_in
            </span>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />

          {/* Counter */}
          {urls.length > 1 && (
            <div className="absolute top-3 right-3 bg-primary text-secondary font-code text-[11px] px-2 py-1 z-10 border border-secondary">
              {current + 1} / {urls.length}
            </div>
          )}
        </div>

        {/* Controls */}
        {urls.length > 1 && (
          <div className="flex items-center justify-between bg-primary px-4 py-2">
            <button
              onClick={prev}
              className="flex items-center gap-1.5 text-secondary font-label-caps text-label-caps hover:text-secondary/70 transition-colors cursor-pointer"
              aria-label="Gambar sebelumnya"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Prev
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {urls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 border border-secondary transition-colors cursor-pointer ${
                    i === current ? "bg-secondary" : "bg-transparent"
                  }`}
                  aria-label={`Gambar ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center gap-1.5 text-secondary font-label-caps text-label-caps hover:text-secondary/70 transition-colors cursor-pointer"
              aria-label="Gambar berikutnya"
            >
              Next
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        src={lightbox}
        alt={`${title} — Preview Gambar ${current + 1}`}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}
