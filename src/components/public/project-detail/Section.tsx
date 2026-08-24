"use client";

import React from "react";

export const PLACEHOLDER = "Tidak ada detail";
export const FALLBACK_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGnndHOxQMC9P7kHYR-NCziQOHTYxPNDH6FyixbGFqO_KRMF-t1EUHAmPe6hni1wsTKXjlYA5YbhwHVgT7oPXz8HDqW6dqDoUkilL2QmjAz4zcwjpWUIkmkltP2Js7aE1zKglyU7a4vibtXU1GcvadWQmYAGRCc8CTmIapikW1CSlTDnul-hbI-R2lXBSj7S9vo_SSzOnffaCk07sRyqxgBfPGb-sm33DNXtUqPahSpKe_TNs_helP";

export interface SectionProps {
  id: string;
  icon: string;
  label: string;
  number: string;
  children: React.ReactNode;
}

export function Section({ id, icon, label, number, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      {/* Section header */}
      <div className="flex items-end gap-4 mb-8 pb-4 border-b-2 border-primary">
        <span
          className="font-display text-[56px] leading-none text-secondary font-extrabold select-none hidden sm:block"
          style={{ WebkitTextStroke: "2px #000066" }}
        >
          {number}
        </span>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[28px] text-primary">
            {icon}
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-[28px] text-primary font-bold uppercase tracking-tight">
            {label}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export function EmptyPlaceholder({ message = PLACEHOLDER }: { message?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-2 border-dashed border-primary/20 text-primary/40">
      <span className="material-symbols-outlined text-[20px]">info</span>
      <span className="font-code text-code italic">{message}</span>
    </div>
  );
}
