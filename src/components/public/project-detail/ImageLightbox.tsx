"use client";

import { useEffect } from "react";

export interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt = "Preview", onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (src) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-primary/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 border-2 border-secondary bg-primary text-secondary flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors cursor-pointer z-10 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        onClick={onClose}
        aria-label="Tutup preview"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
      <div
        className="relative max-w-full max-h-[85vh] overflow-hidden border-2 border-secondary bg-background p-1 shadow-[8px_8px_0px_0px_rgba(0,0,102,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[82vh] object-contain block"
        />
      </div>
    </div>
  );
}
