"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/usePortfolio";
import type { ProjectWithTechnologies } from "@/types/portfolio";

// ─── Fallback data ─────────────────────────────────────────────────
const FALLBACK_PROJECTS: ProjectWithTechnologies[] = [
    {
        id: 1,
        title: "E-Commerce Platform",
        slug: "e-commerce-platform",
        description:
            "A full-stack e-commerce solution with real-time inventory management, payment gateway integration, and admin dashboard.",
        image_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCGnndHOxQMC9P7kHYR-NCziQOHTYxPNDH6FyixbGFqO_KRMF-t1EUHAmPe6hni1wsTKXjlYA5YbhwHVgT7oPXz8HDqW6dqDoUkilL2QmjAz4zcwjpWUIkmkltP2Js7aE1zKglyU7a4vibtXU1GcvadWQmYAGRCc8CTmIapikW1CSlTDnul-hbI-R2lXBSj7S9vo_SSzOnffaCk07sRyqxgBfPGb-sm33DNXtUqPahSpKe_TNs_helP",
        ],
        technologies: [
            { id: 1, name: "React", icon: null, created_at: "" },
            { id: 2, name: "Node.js", icon: null, created_at: "" },
            { id: 3, name: "PostgreSQL", icon: null, created_at: "" },
        ],
        demo_url: "#",
        github_url: "#",
        created_at: "",
        updated_at: "",
    },
    {
        id: 2,
        title: "Mobile Banking App",
        slug: "mobile-banking-app",
        description:
            "Secure and intuitive mobile banking experience featuring biometric authentication, real-time transactions, and spending analytics.",
        image_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDyn_2V2u-jGweP-1DaAgdodzyimf4zJFB-z7dTnNVNOP7rNAEsfViIeu5EcUcxU7-Z4ci4LqjKK2sBv86F4puXVDQZi9BZT5E-ZgSeIkOQF5hJYta3QFL9YesUT9Mc6dNo8L2P6sP3QfiyRSgyt-T3Y7KnZ_fZvGdWLravG4oBGcCLlSUVlXaUz7WoT-v-Lhpn9g6N-aRlEOBYc81IGgtKhoz5mqtxNfw_S5rIcIjQAeM0Ag_eW1PZ",
        ],
        technologies: [
            { id: 3, name: "Flutter", icon: null, created_at: "" },
            { id: 4, name: "Firebase", icon: null, created_at: "" },
            { id: 5, name: "Express", icon: null, created_at: "" },
        ],
        demo_url: "#",
        github_url: "#",
        created_at: "",
        updated_at: "",
    },
];

const FALLBACK_IMG =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCGnndHOxQMC9P7kHYR-NCziQOHTYxPNDH6FyixbGFqO_KRMF-t1EUHAmPe6hni1wsTKXjlYA5YbhwHVgT7oPXz8HDqW6dqDoUkilL2QmjAz4zcwjpWUIkmkltP2Js7aE1zKglyU7a4vibtXU1GcvadWQmYAGRCc8CTmIapikW1CSlTDnul-hbI-R2lXBSj7S9vo_SSzOnffaCk07sRyqxgBfPGb-sm33DNXtUqPahSpKe_TNs_helP";

// ─── Image Carousel ────────────────────────────────────────────────
function ImageCarousel({
    images,
    title,
}: {
    images: string[];
    title: string;
}) {
    const [current, setCurrent] = useState(0);
    const urls = images.length > 0 ? images : [FALLBACK_IMG];

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent((c) => (c - 1 + urls.length) % urls.length);
    };
    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent((c) => (c + 1) % urls.length);
    };

    return (
        <div className="relative h-56 border-b-2 border-primary overflow-hidden bg-primary/5">
            <img
                src={urls[current]}
                alt={`${title} — image ${current + 1}`}
                onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_IMG)
                        e.currentTarget.src = FALLBACK_IMG;
                }}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-500"
            />

            {/* Prev / Next — only shown when there are multiple images */}
            {urls.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-secondary transition-colors opacity-0 group-hover:opacity-100 z-10"
                        aria-label="Previous image"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            chevron_left
                        </span>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-secondary transition-colors opacity-0 group-hover:opacity-100 z-10"
                        aria-label="Next image"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            chevron_right
                        </span>
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {urls.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrent(i);
                                }}
                                className={`w-2 h-2 border border-primary transition-colors ${i === current ? "bg-primary" : "bg-secondary"
                                    }`}
                                aria-label={`Go to image ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Counter badge */}
                    <div className="absolute top-2 right-2 bg-primary text-secondary font-code text-[11px] px-2 py-0.5 z-10">
                        {current + 1}/{urls.length}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Project Card ──────────────────────────────────────────────────
function ProjectCard({ project }: { project: ProjectWithTechnologies }) {
    return (
        <div className="group border-2 border-primary bg-surface overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,102,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,102,1)] hover:-translate-y-1 transition-all duration-300">
            <ImageCarousel images={project.image_urls} title={project.title} />

            {/* Body */}
            <div className="flex flex-col flex-1 p-6 gap-4">
                {/* Title */}
                <h3 className="font-headline-md text-headline-md text-primary leading-tight">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="font-body text-body text-primary/70 leading-relaxed line-clamp-3 flex-1">
                    {project.description}
                </p>

                {/* Tech tags */}
                {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech.id}
                                className="px-2.5 py-1 font-code text-code border-2 border-primary text-primary bg-surface hover:bg-primary hover:text-secondary transition-colors text-[11px]"
                            >
                                {tech.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2 border-t-2 border-primary/10 mt-auto">
                    <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary font-label-caps text-label-caps border-2 border-primary hover:bg-primary hover:text-secondary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                    >
                        <span className="material-symbols-outlined text-[15px]">
                            article
                        </span>
                        Detail
                    </Link>
                    {project.demo_url && project.demo_url !== "#" && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-secondary font-label-caps text-label-caps border-2 border-primary hover:bg-secondary hover:text-primary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                        >
                            <span className="material-symbols-outlined text-[15px]">
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
                            className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary font-label-caps text-label-caps border-2 border-primary hover:bg-primary hover:text-secondary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                        >
                            <span className="material-symbols-outlined text-[15px]">
                                code
                            </span>
                            Source
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Skeleton Card ─────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="border-2 border-primary/20 bg-surface animate-pulse">
            <div className="h-56 bg-primary/10" />
            <div className="p-6 space-y-3">
                <div className="h-5 bg-primary/10 w-3/4" />
                <div className="h-4 bg-primary/10 w-full" />
                <div className="h-4 bg-primary/10 w-5/6" />
                <div className="flex gap-2 pt-2">
                    <div className="h-7 w-16 bg-primary/10" />
                    <div className="h-7 w-20 bg-primary/10" />
                    <div className="h-7 w-14 bg-primary/10" />
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function ProjectsPage() {
    const { projects, loading } = useProjects();
    const [search, setSearch] = useState("");
    const [activeTech, setActiveTech] = useState<string>("All");

    const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

    // Collect unique tech names across all projects for filter pills
    const allTechs = Array.from(
        new Set(
            displayProjects.flatMap((p) => p.technologies.map((t) => t.name))
        )
    ).sort();

    const filtered = displayProjects.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        const matchesTech =
            activeTech === "All" ||
            p.technologies.some((t) => t.name === activeTech);
        return matchesSearch && matchesTech;
    });

    return (
        <div className="bg-background text-primary min-h-screen">
            {/* ── Nav ── */}
            <nav className="fixed w-full top-0 z-50 bg-background border-b-2 border-primary">
                <div className="flex items-center justify-between w-full px-5 md:px-16 max-w-[1200px] mx-auto h-20">
                    <Link
                        href="/"
                        className="font-display text-[22px] font-extrabold text-primary tracking-tighter hover:text-secondary hover:bg-primary px-2 py-1 transition-all duration-150 uppercase"
                    >
                        ←&nbsp;Back
                    </Link>
                    <span className="font-label-caps text-label-caps text-primary/60 hidden md:block">
                        All Projects
                    </span>
                    <a
                        href="/#contacts"
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-primary bg-secondary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                    >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        Contact Me
                    </a>
                </div>
            </nav>

            {/* ── Header ── */}
            <section className="pt-32 pb-16 px-5 md:px-16 max-w-[1200px] mx-auto">
                <div className="flex items-end gap-6 mb-6">
                    <span
                        className="font-display text-[96px] leading-none text-secondary font-extrabold select-none"
                        style={{ WebkitTextStroke: "3px #000066" }}
                    >
                        03
                    </span>
                    <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary pb-2 border-b-4 border-primary leading-tight">
                        All Projects
                    </h1>
                </div>
                <p className="font-body-lg text-body-lg text-primary/70 max-w-2xl">
                    A complete catalogue of projects I've built — from full-stack web apps
                    to mobile experiences. Each one backed by real work and real code.
                </p>
            </section>

            {/* ── Filters ── */}
            <section className="px-5 md:px-16 max-w-[1200px] mx-auto pb-8">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-primary/50">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border-2 border-primary bg-background font-code text-code text-primary placeholder:text-primary/40 focus:outline-none focus:bg-secondary transition-colors"
                        />
                    </div>

                    {/* Tech filter pills */}
                    <div className="flex flex-wrap gap-2">
                        {["All", ...allTechs].map((tech) => (
                            <button
                                key={tech}
                                onClick={() => setActiveTech(tech)}
                                className={`px-3 py-1.5 font-code text-code border-2 border-primary transition-all text-[11px] ${activeTech === tech
                                        ? "bg-primary text-secondary shadow-[2px_2px_0px_0px_rgba(0,0,102,1)]"
                                        : "bg-secondary text-primary hover:bg-primary hover:text-secondary"
                                    }`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Result count */}
                {!loading && (
                    <p className="mt-4 font-code text-code text-primary/50">
                        {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
                    </p>
                )}
            </section>

            {/* ── Grid ── */}
            <section className="px-5 md:px-16 max-w-[1200px] mx-auto pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border-2 border-primary/20">
                        <span className="material-symbols-outlined text-[64px] text-primary/20 mb-4">
                            search_off
                        </span>
                        <p className="font-headline-md text-headline-md text-primary/40">
                            No projects match your filters
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setActiveTech("All");
                            }}
                            className="mt-6 px-6 py-2 border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-secondary transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

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
