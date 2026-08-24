"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useProjectWithDetails } from "@/hooks/usePortfolio";
import type {
  ProjectProblem,
  ProjectSolution,
  ProjectDesign,
  ProjectFeature,
  ProjectTesting,
  ProjectResult,
  ProjectLearning,
  ProjectTestingStatus,
} from "@/types/portfolio";

// ─── Constants ─────────────────────────────────────────────────────────────────

const FALLBACK_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGnndHOxQMC9P7kHYR-NCziQOHTYxPNDH6FyixbGFqO_KRMF-t1EUHAmPe6hni1wsTKXjlYA5YbhwHVgT7oPXz8HDqW6dqDoUkilL2QmjAz4zcwjpWUIkmkltP2Js7aE1zKglyU7a4vibtXU1GcvadWQmYAGRCc8CTmIapikW1CSlTDnul-hbI-R2lXBSj7S9vo_SSzOnffaCk07sRyqxgBfPGb-sm33DNXtUqPahSpKe_TNs_helP";

const PLACEHOLDER = "Tidak ada detail";

// ─── Status badge mapping ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProjectTestingStatus,
  { label: string; icon: string; cls: string }
> = {
  passed: {
    label: "Passed",
    icon: "check_circle",
    cls: "bg-green-50 text-green-700 border-green-600",
  },
  failed: {
    label: "Failed",
    icon: "cancel",
    cls: "bg-red-50 text-red-700 border-red-600",
  },
  pending: {
    label: "Pending",
    icon: "schedule",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-600",
  },
  skipped: {
    label: "Skipped",
    icon: "do_not_disturb_on",
    cls: "bg-primary/5 text-primary/50 border-primary/30",
  },
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-primary/10 ${className ?? ""}`}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="bg-background text-primary min-h-screen">
      {/* Nav */}
      <nav className="fixed w-full top-0 z-50 bg-background border-b-2 border-primary">
        <div className="flex items-center justify-between w-full px-5 md:px-16 max-w-[1200px] mx-auto h-20">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </nav>

      <div className="pt-24 max-w-[900px] mx-auto px-5 md:px-16 pb-24 space-y-16">
        <Skeleton className="w-full h-[420px]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────────

function Section({
  id,
  icon,
  label,
  number,
  children,
}: {
  id: string;
  icon: string;
  label: string;
  number: string;
  children: React.ReactNode;
}) {
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

// ─── Empty placeholder ─────────────────────────────────────────────────────────

function EmptyPlaceholder({ message = PLACEHOLDER }: { message?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-2 border-dashed border-primary/20 text-primary/40">
      <span className="material-symbols-outlined text-[20px]">
        info
      </span>
      <span className="font-code text-code italic">{message}</span>
    </div>
  );
}

// ─── Hero Image Carousel ───────────────────────────────────────────────────────

function HeroCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const urls = images.length > 0 ? images : [FALLBACK_IMG];

  const prev = () => setCurrent((c) => (c - 1 + urls.length) % urls.length);
  const next = () => setCurrent((c) => (c + 1) % urls.length);

  return (
    <div className="relative w-full border-2 border-primary overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,102,1)] bg-primary/5">
      <div className="relative h-[280px] sm:h-[380px] md:h-[440px]">
        <img
          src={urls[current]}
          alt={`${title} — gambar ${current + 1}`}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMG)
              e.currentTarget.src = FALLBACK_IMG;
          }}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />

        {/* Counter */}
        {urls.length > 1 && (
          <div className="absolute top-3 right-3 bg-primary text-secondary font-code text-[11px] px-2 py-1 z-10">
            {current + 1} / {urls.length}
          </div>
        )}
      </div>

      {/* Controls */}
      {urls.length > 1 && (
        <div className="flex items-center justify-between bg-primary px-4 py-2">
          <button
            onClick={prev}
            className="flex items-center gap-1.5 text-secondary font-label-caps text-label-caps hover:text-secondary/70 transition-colors"
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
                className={`w-2 h-2 border border-secondary transition-colors ${i === current ? "bg-secondary" : "bg-transparent"}`}
                aria-label={`Gambar ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex items-center gap-1.5 text-secondary font-label-caps text-label-caps hover:text-secondary/70 transition-colors"
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
  );
}

// ─── Problems ─────────────────────────────────────────────────────────────────

function ProblemsSection({ problems }: { problems: ProjectProblem[] }) {
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

// ─── Solutions ────────────────────────────────────────────────────────────────

function SolutionsSection({ solutions }: { solutions: ProjectSolution[] }) {
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

// ─── Designs ──────────────────────────────────────────────────────────────────

const DESIGN_TYPE_LABEL: Record<string, string> = {
  wireframe: "Wireframe",
  mockup: "Mockup",
  prototype: "Prototype",
  uml: "UML Diagram",
  flowchart: "Flowchart",
};

function DesignsSection({ designs }: { designs: ProjectDesign[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (designs.length === 0) return <EmptyPlaceholder />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {designs.map((d) => (
          <div key={d.id} className="border-2 border-primary/20 hover:border-primary transition-colors duration-200 group overflow-hidden">
            {/* Image */}
            <button
              onClick={() => setLightbox(d.image_url)}
              className="relative w-full h-48 block overflow-hidden bg-primary/5"
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-primary/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 border-2 border-secondary bg-transparent text-secondary flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <img
            src={lightbox}
            alt="Design preview"
            className="max-w-full max-h-[85vh] object-contain border-2 border-secondary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection({ features }: { features: ProjectFeature[] }) {
  if (features.length === 0) return <EmptyPlaceholder />;

  return (
    <div className="space-y-6">
      {features.map((f, idx) => (
        <div
          key={f.id}
          className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-6 border-2 border-primary/20 hover:border-primary transition-colors duration-200 overflow-hidden`}
        >
          {/* Image */}
          {f.image_url ? (
            <div className="flex-shrink-0 w-full md:w-60 h-44 overflow-hidden bg-primary/5">
              <img
                src={f.image_url}
                alt={f.title}
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_IMG)
                    e.currentTarget.src = FALLBACK_IMG;
                }}
                className="w-full h-full object-cover"
              />
            </div>
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
  );
}

// ─── Testing ──────────────────────────────────────────────────────────────────

function TestingSection({ testings }: { testings: ProjectTesting[] }) {
  if (testings.length === 0) return <EmptyPlaceholder />;

  const summary = {
    passed: testings.filter((t) => t.status === "passed").length,
    failed: testings.filter((t) => t.status === "failed").length,
    pending: testings.filter((t) => t.status === "pending").length,
    skipped: testings.filter((t) => t.status === "skipped").length,
  };

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex flex-wrap gap-3 p-4 border-2 border-primary bg-primary/5">
        {(["passed", "failed", "pending", "skipped"] as ProjectTestingStatus[]).map(
          (status) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <div
                key={status}
                className={`flex items-center gap-1.5 px-3 py-1.5 border-2 ${cfg.cls} font-code text-code text-[11px]`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {cfg.icon}
                </span>
                {cfg.label}: {summary[status]}
              </div>
            );
          }
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-2 border-primary">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead className="bg-primary text-secondary">
            <tr>
              <th className="text-left px-4 py-3 font-label-caps text-label-caps w-8">#</th>
              <th className="text-left px-4 py-3 font-label-caps text-label-caps">Test Case</th>
              <th className="text-left px-4 py-3 font-label-caps text-label-caps">Expected</th>
              <th className="text-left px-4 py-3 font-label-caps text-label-caps">Actual</th>
              <th className="text-left px-4 py-3 font-label-caps text-label-caps">Status</th>
            </tr>
          </thead>
          <tbody>
            {testings.map((t, idx) => {
              const cfg = STATUS_CONFIG[t.status as ProjectTestingStatus] ?? STATUS_CONFIG.pending;
              return (
                <tr
                  key={t.id}
                  className="border-t border-primary/15 hover:bg-primary/5 transition-colors"
                >
                  <td className="px-4 py-3 font-code text-code text-primary/40">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 font-body-md text-primary font-medium">
                    {t.test_case || PLACEHOLDER}
                  </td>
                  <td className="px-4 py-3 font-body-md text-primary/70">
                    {t.expected_result || PLACEHOLDER}
                  </td>
                  <td className="px-4 py-3 font-body-md text-primary/70">
                    {t.actual_result || PLACEHOLDER}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 border text-[11px] font-label-caps ${cfg.cls}`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {cfg.icon}
                      </span>
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

function ResultsSection({ results }: { results: ProjectResult[] }) {
  if (results.length === 0) return <EmptyPlaceholder />;

  return (
    <div className="space-y-6">
      {/* Metric highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((r) => (
          <div
            key={r.id}
            className="flex flex-col items-center justify-center p-5 border-2 border-primary text-center hover:bg-primary hover:text-secondary group transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <span className="font-display text-[32px] font-extrabold text-primary group-hover:text-secondary leading-none mb-1 transition-colors">
              {r.metric_value || "—"}
            </span>
            <span className="font-label-caps text-label-caps text-primary/50 group-hover:text-secondary/70 transition-colors text-center leading-tight">
              {r.metric_label || PLACEHOLDER}
            </span>
          </div>
        ))}
      </div>

      {/* Detail list */}
      <div className="space-y-4">
        {results.map((r, idx) => (
          <div
            key={r.id}
            className="flex gap-4 p-4 border-2 border-primary/10 hover:border-primary/30 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 border-2 border-primary bg-secondary flex items-center justify-center font-display text-[13px] font-extrabold text-primary">
              {idx + 1}
            </div>
            <div>
              <h3 className="font-headline-md text-[15px] font-bold text-primary mb-1">
                {r.title || PLACEHOLDER}
              </h3>
              <p className="font-body-md text-[13px] text-primary/65 leading-relaxed">
                {r.description || PLACEHOLDER}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Learnings ────────────────────────────────────────────────────────────────

function LearningsSection({ learnings }: { learnings: ProjectLearning[] }) {
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

// ─── TOC Nav ──────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { id: "overview", icon: "info", label: "Overview" },
  { id: "problems", icon: "report_problem", label: "Problems" },
  { id: "solutions", icon: "lightbulb", label: "Solutions" },
  { id: "designs", icon: "design_services", label: "Designs" },
  { id: "features", icon: "star", label: "Features" },
  { id: "testing", icon: "bug_report", label: "Testing" },
  { id: "results", icon: "bar_chart", label: "Results" },
  { id: "learnings", icon: "school", label: "Learnings" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = Number(id);
  const { project, loading, error } = useProjectWithDetails(
    isNaN(projectId) ? null : projectId
  );

  // ── Loading state ──
  if (loading) return <PageSkeleton />;

  // ── Error / not found ──
  if (error || !project) {
    return (
      <div className="bg-background text-primary min-h-screen flex flex-col">
        <nav className="fixed w-full top-0 z-50 bg-background border-b-2 border-primary">
          <div className="flex items-center justify-between w-full px-5 md:px-16 max-w-[1200px] mx-auto h-20">
            <Link
              href="/projects"
              className="font-display text-[22px] font-extrabold text-primary tracking-tighter hover:text-secondary hover:bg-primary px-2 py-1 transition-all duration-150 uppercase"
            >
              ← Back
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5">
          <span className="material-symbols-outlined text-[72px] text-primary/20">
            folder_off
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary/40 text-center">
            Project not found
          </h1>
          <Link
            href="/projects"
            className="px-6 py-3 border-2 border-primary bg-primary text-secondary font-label-caps text-label-caps hover:bg-secondary hover:text-primary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            View All Projects
          </Link>
        </div>
      </div>
    );
  }

  const heroImages = project.image_urls?.length > 0 ? project.image_urls : [];

  return (
    <div className="bg-background text-primary min-h-screen">
      {/* ── Top Nav ── */}
      <nav className="fixed w-full top-0 z-50 bg-background border-b-2 border-primary">
        <div className="flex items-center justify-between w-full px-5 md:px-16 max-w-[1200px] mx-auto h-20">
          <Link
            href="/projects"
            className="font-display text-[22px] font-extrabold text-primary tracking-tighter hover:text-secondary hover:bg-primary px-2 py-1 transition-all duration-150 uppercase"
          >
            ← Back
          </Link>
          <span className="font-label-caps text-label-caps text-primary/50 hidden md:block max-w-xs truncate">
            {project.title}
          </span>
          {/* Action links */}
          <div className="flex items-center gap-2">
            {project.demo_url && project.demo_url !== "#" && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-primary bg-primary text-secondary font-label-caps text-label-caps hover:bg-secondary hover:text-primary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] text-[11px]"
              >
                <span className="material-symbols-outlined text-[14px]">
                  open_in_new
                </span>
                Demo
              </a>
            )}
            {project.github_url && project.github_url !== "#" && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-primary bg-secondary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] text-[11px]"
              >
                <span className="material-symbols-outlined text-[14px]">
                  code
                </span>
                Source
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Layout: sidebar TOC + main content ── */}
      <div className="pt-20 max-w-[1200px] mx-auto px-5 md:px-16">
        <div className="flex gap-12 relative">
          {/* ── Sticky TOC sidebar ── */}
          <aside className="hidden xl:block w-48 flex-shrink-0">
            <div className="sticky top-28 space-y-1">
              <p className="font-label-caps text-label-caps text-primary/40 mb-4">
                IN THIS PAGE
              </p>
              {TOC_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left font-code text-code text-[12px] text-primary/50 hover:text-primary hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all duration-150"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Main Article ── */}
          <main className="flex-1 min-w-0 pb-32 space-y-16 pt-10">

            {/* ── Hero section ── */}
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

            {/* ── Problems ── */}
            <Section id="problems" icon="report_problem" label="Latar Belakang Masalah" number="01">
              <ProblemsSection problems={project.problems} />
            </Section>

            {/* ── Solutions ── */}
            <Section id="solutions" icon="lightbulb" label="Solusi yang Diterapkan" number="02">
              <SolutionsSection solutions={project.solutions} />
            </Section>

            {/* ── Designs ── */}
            <Section id="designs" icon="design_services" label="Desain & Arsitektur" number="03">
              <DesignsSection designs={project.designs} />
            </Section>

            {/* ── Features ── */}
            <Section id="features" icon="star" label="Fitur Utama" number="04">
              <FeaturesSection features={project.features} />
            </Section>

            {/* ── Testing ── */}
            <Section id="testing" icon="bug_report" label="Pengujian" number="05">
              <TestingSection testings={project.testings} />
            </Section>

            {/* ── Results ── */}
            <Section id="results" icon="bar_chart" label="Hasil & Dampak" number="06">
              <ResultsSection results={project.results} />
            </Section>

            {/* ── Learnings ── */}
            <Section id="learnings" icon="school" label="Pembelajaran" number="07">
              <LearningsSection learnings={project.learnings} />
            </Section>

            {/* ── Back button ── */}
            <div className="pt-8 border-t-2 border-primary/20">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary bg-secondary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Kembali ke Semua Project
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="w-full border-t-2 border-primary bg-primary py-6 px-5 md:px-16">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <span className="font-code text-code text-secondary/70">
            © {new Date().getFullYear()} — All rights reserved
          </span>
          <Link
            href="/"
            className="font-label-caps text-label-caps text-secondary hover:text-secondary/70 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
