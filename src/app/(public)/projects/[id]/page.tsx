"use client";

import { use } from "react";
import Link from "next/link";
import { useProjectWithDetails } from "@/hooks/usePortfolio";
import {
  Section,
  HeroSection,
  ProblemsSection,
  SolutionsSection,
  DesignsSection,
  FeaturesSection,
  TestingSection,
  ResultsSection,
  LearningsSection,
  TocSidebar,
  ProjectDetailSkeleton,
} from "@/components/public";

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
  if (loading) return <ProjectDetailSkeleton />;

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
          <TocSidebar />

          {/* ── Main Article ── */}
          <main className="flex-1 min-w-0 pb-32 space-y-16 pt-10">
            {/* ── Hero section ── */}
            <HeroSection project={project} />

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
