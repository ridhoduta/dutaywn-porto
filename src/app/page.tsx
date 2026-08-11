"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useProfile,
  useSkills,
  useProjects,
  useCertifications,
  useEducations,
} from "@/hooks/usePortfolio";

// ─── Typed Text Hook ───────────────────────────────────────────────
function useTypingEffect(words: string[], speed = 100, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

// ─── Section Heading ───────────────────────────────────────────────
function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-end gap-6 mb-14">
      <span
        className="font-display text-[96px] leading-none text-secondary font-extrabold select-none"
        style={{ WebkitTextStroke: "3px #000066" }}
      >
        {number}
      </span>
      <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary pb-2 border-b-4 border-primary leading-tight">
        {title}
      </h2>
    </div>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────────
function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`border-2 border-primary/20 bg-surface-container animate-pulse ${className}`}
    />
  );
}

// ─── Default data ──────────────────────────────────────────────────
const DEFAULT_SKILLS_GROUPED = {
  Frontend: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
  Backend: ["Node.js", "Express", "Laravel", "REST APIs", "GraphQL"],
  Database: ["PostgreSQL", "MySQL", "Prisma ORM", "MongoDB", "Redis"],
};

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, payment gateway integration, and admin dashboard.",
    image_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGnndHOxQMC9P7kHYR-NCziQOHTYxPNDH6FyixbGFqO_KRMF-t1EUHAmPe6hni1wsTKXjlYA5YbhwHVgT7oPXz8HDqW6dqDoUkilL2QmjAz4zcwjpWUIkmkltP2Js7aE1zKglyU7a4vibtXU1GcvadWQmYAGRCc8CTmIapikW1CSlTDnul-hbI-R2lXBSj7S9vo_SSzOnffaCk07sRyqxgBfPGb-sm33DNXtUqPahSpKe_TNs_helP",
    ],
    technologies: [
      { id: 1, name: "React", icon: null },
      { id: 2, name: "Node.js", icon: null },
      { id: 3, name: "PostgreSQL", icon: null },
    ],
    demo_url: "#",
    github_url: "#",
  },
  {
    id: 2,
    title: "Mobile Banking App",
    description:
      "Secure and intuitive mobile banking experience featuring biometric authentication, real-time transactions, and spending analytics.",
    image_urls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyn_2V2u-jGweP-1DaAgdodzyimf4zJFB-z7dTnNVNOP7rNAEsfViIeu5EcUcxU7-Z4ci4LqjKK2sBv86F4puXVDQZi9BZT5E-ZgSeIkOQF5hJYta3QFL9YesUT9Mc6dNo8L2P6sP3QfiyRSgyt-T3Y7KnZ_fZvGdWLravG4oBGcCLlSUVlXaUz7WoT-v-Lhpn9g6N-aRlEOBYc81IGgtKhoz5mqtxNfw_S5rIcIjQAeM0Ag_eW1PZ",
    ],
    technologies: [
      { id: 3, name: "Flutter", icon: null },
      { id: 4, name: "Firebase", icon: null },
      { id: 5, name: "Express", icon: null },
    ],
    demo_url: "#",
    github_url: "#",
  },
];

const DEFAULT_CERTS = [
  {
    id: 1,
    name: "AWS Certified Developer – Associate",
    issuer: "Amazon Web Services",
    issue_date: "2024–2026",
    credential_url: "#",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4Ougu0agOigk3HAh03ge3cqjx3F3EnpGAxQ_RH_GLHxoC3dGvelvqcZ_zM8fgP6lat-3F0lJgD8ba_63Szh8OvTLNVpeTxse9R8dy68f2HgGdFI3y2riNZtrtbO0xRdwHl-pL_wQBWkDJQlNfhNXDJV_v-yEf9YZPcspuOVTI4m4S-UhVvPIiUIq-y-rlNp032GW7Qw0IaxfrclI1wG8mexisHugT37-f7_Jf1E5EQpeliuKD3MXK",
  },
  {
    id: 2,
    name: "Google Associate Cloud Engineer",
    issuer: "Google Cloud",
    issue_date: "2023–2025",
    credential_url: "#",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-mDdhveOUUbPkhIlyfFQpwBLym0YaUqoCd6R-6tioFnWoce1PZDddHQaZJhOuBDqiynF4bu5EjbtKOvZQP1M6IOgV9_tV4WRcbg4666nFddobOeBOcgWS_j7GWyEzFXgfT-aTlUmOcURjADLlosW1YTtNu4dS7vo3vpqiGDdb4MInqsRY-xzZXTf1OkRACZj99dNVty2kHRCYzs1xLjGs40mdxUz8UsunHtVtG4BHgcEpZki38Aw",
  },
  {
    id: 3,
    name: "Meta Front-End Developer Certificate",
    issuer: "Coursera & Meta",
    issue_date: "2024",
    credential_url: "#",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_kOfWd1ueqIUd2FPT6XRnG2iYotTXtabpkXm3uyiC5mtwNVvoDG-1WZl8_3MohGpkO3RQqhUfU4PF12oa7vouSV34Y_WwVd3-s2qIY5x_BXz9gXZ36rT0Pv697SL25_4cmxkbCtS-FlTaAkO99eTHR-iHtmFX8DMbikxdRO5JwnqKKCcDp05YnLG-4fCpWKeUyd-yEpVjDs0NosNXzhWx6CVtYtqqCtiTN6i4zBWsamsO8YYRXpEt",
  },
  {
    id: 4,
    name: "Back-End Development with Node.js",
    issuer: "Dicoding Indonesia",
    issue_date: "2023",
    credential_url: "#",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAVBS1BPwMQgZU5zCzSBgqazgPQrkZZE3_y_52qlZZgt44M_sBJs3QEbzRHqXfHj6djI8Z0VYGG5_sbRhNz1IsZ58yGAEND6vW19CVljaMpj5a8BNCVboCDhOETZMOKy_jf3WI29BIuLfiAHM6HaJxaH9LCk6rVpSce2rCgK-O1pRFeNtovoEEgy0xJWdrM8kIB9NoaPUSLCR4mPMeqiXg5OHBUcYMQtUmPLMCZJEj-oMO3yRcYamD",
  },
];

const DEFAULT_EDUCATIONS = [
  {
    id: 1,
    institution: "Politeknik Negeri Malang",
    degree: "Sarjana Terapan (D4)",
    field: "Teknik Informatika",
    description:
      "Fokus pada rekayasa perangkat lunak, struktur data, arsitektur basis data, dan pengembangan aplikasi web & mobile.",
    start_date: "2020",
    end_date: "2024",
  },
];

const TICKER_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Laravel",
  "Flutter",
  "PostgreSQL",
  "Prisma ORM",
  "Tailwind CSS",
  "GraphQL",
  "REST API",
  "Docker",
  "AWS",
  "Firebase",
  "Supabase",
  "MongoDB",
  "Redis",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Laravel",
  "Flutter",
  "PostgreSQL",
  "Prisma ORM",
  "Tailwind CSS",
  "GraphQL",
  "REST API",
  "Docker",
  "AWS",
  "Firebase",
  "Supabase",
  "MongoDB",
  "Redis",
];

const SKILL_ICONS: Record<string, string> = {
  Frontend: "desktop_windows",
  Backend: "dns",
  Database: "database",
};

const STATS = [
  { value: "2+", label: "Years Experience" },
  { value: "15+", label: "Projects Built" },
  { value: "8+", label: "Certifications" },
  { value: "100%", label: "Passion" },
];

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Certification", href: "#certification" },
  { name: "Contacts", href: "#contacts" },
];

const TYPING_WORDS = [
  "Full Stack Developer",
  "Mobile Developer",
  "UI/UX Enthusiast",
  "Open Source Lover",
];

// ─── Main Component ────────────────────────────────────────────────
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const typed = useTypingEffect(TYPING_WORDS);

  const { profile, loading: profileLoading } = useProfile();
  const { skills, loading: skillsLoading } = useSkills();
  const { projects, loading: projectsLoading } = useProjects();
  const { certifications, loading: certsLoading } = useCertifications();
  const { educations, loading: eduLoading } = useEducations();

  // ESC key handler to close pop-up modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll listener for sticky nav shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Active section detection
      const sections = [
        "about",
        "projects",
        "education",
        "certification",
        "contacts",
      ];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Derived display values ── */
  const displayName = profile?.name || "Ridho";
  const displayTitle = profile?.title || "Full Stack Developer";
  const displayDesc =
    profile?.description ||
    "Saya membangun website, aplikasi mobile, dan sistem informasi dengan fokus pada performa, skalabilitas, dan pengalaman pengguna yang luar biasa.";
  const displayLocation = profile?.location || "Malang, Indonesia";
  const displayEmail = profile?.email || "hello@ridho.dev";
  const displayGithub = profile?.github_url || "#";
  const displayLinkedin = profile?.linkedin_url || "https://www.instagram.com/dutaywn/";

  const heroFallbackImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNdN0A0-4z4WnCFfYri40zJuvppWQJ6Qk0btFZ4DwfFbHGpX0r2jvkyROLYVSQDQz7OgTZRvqaSJZU71wkCp9g5S4SEr2W0shm6uN-3iTzvtgcbzdkdp0FlNZWwTZDXnrF2sNxL6sYHe_lPQ6Ow9fGO0FqF8ICysHynVNXZHB5olSQZSligXvkrTZUceEvq1Jn-cE09n5P6kN266qoNtk0NzlfNj3Sg4I291Ed8nUlLQve6P0E7SkP";
  const displayImg = profile?.profile_image || heroFallbackImg;

  const groupedSkills: Record<string, string[]> =
    skills.length > 0
      ? skills.reduce<Record<string, string[]>>((acc, s) => {
        const cat = s.category || "General";
        (acc[cat] ??= []).push(s.name);
        return acc;
      }, {})
      : DEFAULT_SKILLS_GROUPED;

  const displayProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;
  const displayCerts =
    certifications.length > 0 ? certifications : DEFAULT_CERTS;
  const displayEducations =
    educations.length > 0 ? educations : DEFAULT_EDUCATIONS;

  const anyLoading =
    profileLoading ||
    skillsLoading ||
    projectsLoading ||
    certsLoading ||
    eduLoading;

  // ─ JSX ──────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-primary min-h-screen overflow-x-hidden selection:bg-primary selection:text-secondary">
      {/* ═══════════════ NAV ═══════════════ */}
      <nav
        className={`fixed w-full top-0 z-50 bg-background border-b-2 border-primary transition-shadow duration-300 ${scrolled ? "shadow-[0_4px_0px_0px_rgba(0,0,102,0.12)]" : ""
          }`}
      >
        <div className="flex justify-between items-center w-full px-5 md:px-16 max-w-[1200px] mx-auto h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-[22px] font-extrabold text-primary tracking-tighter hover:text-secondary hover:bg-primary px-2 py-1 transition-all duration-150 uppercase"
          >
            {displayName}
            <span
              className="text-secondary"
              style={{ WebkitTextStroke: "1px #000066" }}
            >
              .
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-1">
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-label-caps text-label-caps px-4 py-2 border-b-2 transition-all duration-150 ${isActive
                    ? "border-primary text-primary bg-secondary"
                    : "border-transparent text-primary/70 hover:text-primary hover:border-primary"
                    }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <a
            href="#contacts"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 border-2 border-primary bg-secondary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            Contact Me
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden text-primary p-2 border-2 border-primary focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen
            ? "max-h-screen border-b-2 border-primary"
            : "max-h-0"
            }`}
        >
          <div className="bg-background px-5 py-6 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-caps text-label-caps text-primary py-3 px-4 border-b border-primary/10 hover:bg-secondary transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contacts"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 text-center px-6 py-3 border-2 border-primary bg-primary text-secondary font-label-caps text-label-caps"
            >
              Contact Me
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="flex flex-col md:flex-row items-center px-5 md:px-16 max-w-[1200px] mx-auto gap-10 md:gap-16 mt-20 min-h-[calc(100vh-80px)] py-16 md:py-0">
        {/* Left */}
        <div className="w-full mt-12 md:w-1/2 flex flex-col items-start animate-fade-in-left">
          {/* Heading */}
          <h1 className="font-display text-[48px] md:text-display text-primary leading-tight tracking-tight mb-4">
            Hello, I&apos;m
            <br />
            <span className="relative inline-block">
              {displayName}
              {/* underline accent */}
              <span className="absolute -bottom-2 left-0 w-full h-4 bg-secondary -z-10" />
            </span>
            <span className="ml-3">👋</span>
          </h1>

          {/* Typed role */}
          <p className="font-code text-code md:text-[18px] text-primary/60 mb-5">
            &gt;&nbsp;
            <span className="text-primary font-semibold">{typed}</span>
            <span className="animate-blink">|</span>
          </p>

          {/* Description */}
          <p className="font-body-lg text-body-lg text-primary/80 max-w-lg mb-8 leading-relaxed">
            {displayDesc}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-0 border-2 border-primary mb-8 w-full max-w-lg">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center py-4 px-2 ${i < STATS.length - 1 ? "border-r-2 border-primary" : ""
                  }`}
              >
                <span className="font-display text-[22px] text-primary font-extrabold leading-none">
                  {stat.value}
                </span>
                <span className="font-label-caps text-[9px] text-primary/60 mt-1 text-center leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-label-caps text-label-caps hover:bg-secondary hover:text-primary border-2 border-primary transition-all shadow-[5px_5px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px]"
            >
              <span className="material-symbols-outlined text-[18px]">
                visibility
              </span>
              View Projects
            </a>
            <a
              href="/cv/CV-Ridho-Software-Engineer.pdf"
              download="CV-Ridho-Software-Engineer.pdf"
              className="flex items-center gap-2 px-8 py-4 bg-secondary text-primary border-2 border-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-all shadow-[5px_5px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px]"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Download CV
            </a>
          </div>
        </div>

        {/* Right — profile card */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-fade-in-right delay-200">
          <div className="relative w-full max-w-[420px] pb-4 pr-4">
            {/* Decorative offset block */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-secondary border-2 border-primary" />
            {/* Main card */}
            <div className="relative border-4 border-primary overflow-hidden bg-primary">
              {/* Dot pattern overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />
              <img
                src={displayImg}
                alt={displayName}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== heroFallbackImg) {
                    target.src = heroFallbackImg;
                  }
                }}
                className="relative z-10 w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 z-20 bg-secondary border-2 border-primary px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,102,1)]">
                <span className="font-label-caps text-label-caps text-primary block">
                  {displayLocation}
                </span>
                <span className="font-code text-code text-primary/70">
                  {displayTitle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TICKER ═══════════════ */}
      <div className="w-full border-y-2 border-primary bg-primary overflow-hidden py-3 mt-12">
        <div className="animate-marquee whitespace-nowrap">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 mr-8">
              <span className="font-label-caps text-label-caps text-secondary">
                {item}
              </span>
              <span className="text-secondary opacity-40 text-xl">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════ MAIN ═══════════════ */}
      <main className="px-5 md:px-16 max-w-[1200px] mx-auto">
        {/* ── ABOUT ── */}
        <section id="about" className="py-section-gap scroll-mt-28">
          <SectionHeading number="01" title="About Me" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Text */}
            <div className="md:col-span-7 space-y-5 font-body-lg text-body-lg text-primary/80 leading-relaxed">
              <p>
                Seorang <strong className="text-primary">{displayTitle}</strong>{" "}
                yang berdedikasi tinggi dengan pengalaman dalam merancang,
                mengembangkan, dan memelihara aplikasi web modern. Saya memiliki
                ketertarikan yang kuat pada arsitektur perangkat lunak yang
                bersih, kode yang efisien, dan antarmuka pengguna yang intuitif.
              </p>
              <p>
                Pendekatan saya terhadap pengembangan selalu berpusat pada
                pemecahan masalah bisnis nyata melalui teknologi. Saya menikmati
                tantangan dalam membangun sistem yang kompleks namun
                menyajikannya dengan cara yang sederhana dan mudah digunakan.
              </p>
              {/* Social links */}
              <div className="flex gap-4 pt-2">
                <a
                  href={displayGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-label-caps text-label-caps text-primary border-2 border-primary px-4 py-2 hover:bg-primary hover:text-secondary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    code
                  </span>
                  GitHub
                </a>
                <a
                  href={displayLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-label-caps text-label-caps text-primary border-2 border-primary px-4 py-2 hover:bg-primary hover:text-secondary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    person
                  </span>
                  Instagram
                </a>
              </div>
            </div>

            {/* Info card */}
            <div className="md:col-span-5">
              <div className="border-2 border-primary bg-secondary shadow-[8px_8px_0px_0px_rgba(0,0,102,1)]">
                <div className="border-b-2 border-primary px-6 py-4 flex items-center gap-2 bg-primary">
                  <span className="w-3 h-3 bg-secondary border border-secondary/40" />
                  <span className="w-3 h-3 bg-secondary/60 border border-secondary/40" />
                  <span className="w-3 h-3 bg-secondary/30 border border-secondary/40" />
                  <span className="font-code text-code text-secondary ml-2 opacity-70">
                    quick_info.json
                  </span>
                </div>
                <div className="p-6 font-code text-code space-y-4">
                  {[
                    {
                      icon: "location_on",
                      label: "location",
                      value: displayLocation,
                    },
                    {
                      icon: "school",
                      label: "education",
                      value:
                        displayEducations[0]?.institution ||
                        "Politeknik Negeri Malang",
                    },
                    { icon: "work", label: "experience", value: "2+ Years" },
                    { icon: "mail", label: "email", value: displayEmail },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">
                        {row.icon}
                      </span>
                      <div>
                        <span className="text-primary/50 block text-[11px]">
                          &quot;{row.label}&quot;:
                        </span>
                        <span className="text-primary font-semibold break-all">
                          &quot;{row.value}&quot;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="pb-section-gap">
          <SectionHeading number="02" title="Technical Stack" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <div
                key={category}
                className="group border-2 border-primary bg-surface hover:bg-secondary transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,102,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,102,1)] hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-8 py-5 border-b-2 border-primary bg-secondary group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl text-primary group-hover:text-secondary transition-colors">
                    {SKILL_ICONS[category] || "code"}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">
                    {category}
                  </h3>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-3 p-8">
                  {items.map((name, i) => (
                    <span
                      key={name}
                      className={`px-3 py-1.5 font-code text-code border-2 border-primary transition-colors ${i < 3
                        ? "bg-primary text-secondary group-hover:bg-secondary group-hover:text-primary"
                        : "bg-surface text-primary"
                        }`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="pb-section-gap scroll-mt-28">
          <SectionHeading number="03" title="Featured Projects" />

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SkeletonCard className="h-80" />
              <SkeletonCard className="h-80" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayProjects.map((proj) => {
                const projFallbackImg =
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGnndHOxQMC9P7kHYR-NCziQOHTYxPNDH6FyixbGFqO_KRMF-t1EUHAmPe6hni1wsTKXjlYA5YbhwHVgT7oPXz8HDqW6dqDoUkilL2QmjAz4zcwjpWUIkmkltP2Js7aE1zKglyU7a4vibtXU1GcvadWQmYAGRCc8CTmIapikW1CSlTDnul-hbI-R2lXBSj7S9vo_SSzOnffaCk07sRyqxgBfPGb-sm33DNXtUqPahSpKe_TNs_helP";
                const imgUrl = (proj.image_urls && proj.image_urls[0]) || projFallbackImg;

                return (
                  <div
                    key={proj.id}
                    className="group border-2 border-primary bg-surface overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,102,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,102,1)] hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image with overlay */}
                    <div className="relative h-56 border-b-2 border-primary overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={proj.title}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== projFallbackImg) {
                            target.src = projFallbackImg;
                          }
                        }}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-500"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0  opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {proj.demo_url && proj.demo_url !== "#" && (
                          <a
                            href={proj.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-4 py-2 bg-secondary text-primary font-label-caps text-label-caps border-2 border-secondary hover:bg-primary hover:text-secondary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              open_in_new
                            </span>
                            Live Demo
                          </a>
                        )}
                        {proj.github_url && proj.github_url !== "#" && (
                          <a
                            href={proj.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-4 py-2 bg-secondary text-primary font-label-caps text-label-caps border-2 border-secondary hover:bg-primary hover:text-secondary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              code
                            </span>
                            GitHub
                          </a>
                        )}
                      </div>
                      {/* Index number */}
                      <div className="absolute top-3 right-3 w-10 h-10 bg-secondary border-2 border-primary flex items-center justify-center">
                        <span className="font-display text-[13px] font-extrabold text-primary">
                          {String(proj.id).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 flex flex-col flex-grow">
                      <h3 className="font-headline-md text-headline-md text-primary mb-3">
                        {proj.title}
                      </h3>
                      <p className="font-body-md text-body-md text-primary/70 mb-6 flex-grow leading-relaxed">
                        {proj.description}
                      </p>
                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {proj.technologies?.map((tech) => (
                          <span
                            key={tech.id}
                            className="px-3 py-1 bg-primary text-secondary font-code text-[12px] border-2 border-primary"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              href="/projects"
              className="flex items-center gap-2 px-10 py-4 bg-secondary text-primary border-2 border-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-all shadow-[5px_5px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px]"
            >
              <span className="material-symbols-outlined text-[18px]">
                apps
              </span>
              View All Projects
            </Link>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section id="education" className="pb-section-gap scroll-mt-28">
          <SectionHeading number="04" title="Education" />
          <div className="space-y-6">
            {displayEducations.map((edu) => (
              <div
                key={edu.id}
                className="group relative border-2 border-primary bg-surface hover:bg-secondary transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,102,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,102,1)] hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Left accent stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                <div className="pl-8 pr-8 py-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary flex items-center justify-center mt-1">
                        <span className="material-symbols-outlined text-secondary text-xl">
                          school
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-primary mb-1">
                          {edu.institution}
                        </h3>
                        <p className="font-body-lg text-body-lg text-primary/80">
                          {edu.degree} &bull; {edu.field}
                        </p>
                      </div>
                    </div>
                    <span className="font-code text-code text-primary bg-secondary border-2 border-primary px-4 py-1.5 self-start shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,102,1)]">
                      {edu.start_date}
                      {edu.end_date ? ` — ${edu.end_date}` : ""}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="font-body-md text-body-md text-primary/70 mt-4 leading-relaxed max-w-2xl">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section id="certification" className="pb-section-gap scroll-mt-28">
          <SectionHeading number="05" title="Certifications" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayCerts.map((cert) => {
              const defaultCertFallback =
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD4Ougu0agOigk3HAh03ge3cqjx3F3EnpGAxQ_RH_GLHxoC3dGvelvqcZ_zM8fgP6lat-3F0lJgD8ba_63Szh8OvTLNVpeTxse9R8dy68f2HgGdFI3y2riNZtrtbO0xRdwHl-pL_wQBWkDJQlNfhNXDJV_v-yEf9YZPcspuOVTI4m4S-UhVvPIiUIq-y-rlNp032GW7Qw0IaxfrclI1wG8mexisHugT37-f7_Jf1E5EQpeliuKD3MXK";
              const certImg = cert.image_url || defaultCertFallback;

              return (
                <div
                  key={cert.id}
                  className="group border-2 border-primary bg-surface flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,102,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,102,1)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Top Image Banner Container (Clickable for Popup) */}
                  <div
                    onClick={() =>
                      setSelectedImage({ url: certImg, title: cert.name })
                    }
                    className="relative h-52 border-b-2 border-primary bg-white overflow-hidden cursor-pointer group/img"
                  >
                    <iframe
                      src={certImg}
                      // alt={cert.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== defaultCertFallback) {
                          target.src = defaultCertFallback;
                        }
                      }}
                      className="w-full h-full object-contain p-4 group-hover/img:scale-105 transition-transform duration-300"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-secondary font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-2xl">
                        zoom_in
                      </span>
                      Click to Preview
                    </div>
                    {/* Date Badge overlay */}
                    <div className="absolute top-3 right-3 bg-secondary border-2 border-primary px-3 py-1 font-code text-code text-primary font-bold shadow-[2px_2px_0px_0px_rgba(0,0,102,1)]">
                      {cert.issue_date}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="material-symbols-outlined text-2xl text-primary shrink-0 mt-0.5">
                        workspace_premium
                      </span>
                      <h3 className="font-headline-md text-[18px] text-primary leading-tight font-bold">
                        {cert.name}
                      </h3>
                    </div>
                    <p className="font-body-md text-body-md text-primary/70 mb-6 pl-9 flex-grow">
                      Issued by {cert.issuer}
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-primary/10 mt-auto">
                      <button
                        onClick={() =>
                          setSelectedImage({ url: certImg, title: cert.name })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-primary font-label-caps text-xs border-2 border-primary hover:bg-primary hover:text-secondary transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,102,1)]"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          zoom_in
                        </span>
                        Preview
                      </button>
                      {cert.credential_url && cert.credential_url !== "#" && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-primary font-label-caps text-xs border-2 border-primary hover:bg-primary hover:text-secondary transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,102,1)]"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            verified
                          </span>
                          Credential
                          <span className="material-symbols-outlined text-[14px]">
                            arrow_outward
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CONTACT CTA ── */}
        <section id="contacts" className="pb-section-gap scroll-mt-28">
          <div className="relative border-4 border-primary overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,102,1)]">
            {/* Background dots */}
            <div
              className="absolute inset-0 bg-secondary opacity-100"
              style={{
                backgroundImage:
                  "radial-gradient(#000066 1.5px, transparent 1.5px)",
                backgroundSize: "28px 28px",
                opacity: 0.07,
              }}
            />
            <div className="relative bg-secondary px-8 py-20 text-center">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 border-2 border-primary px-4 py-1.5 mb-8 bg-white">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  rocket_launch
                </span>
                <span className="font-label-caps text-label-caps text-primary">
                  Open to Work
                </span>
              </div>

              <h2 className="font-display text-[40px] md:text-display text-primary mb-6 leading-tight tracking-tight">
                Let&apos;s Build Something
                <br />
                <span
                  className="relative inline-block"
                  style={{
                    WebkitTextStroke: "2px #000066",
                    color: "transparent",
                  }}
                >
                  Amazing Together
                  <span className="absolute -bottom-2 left-0 w-full h-4 bg-primary -z-10" />
                </span>
              </h2>

              <p className="font-body-lg text-body-lg text-primary/80 max-w-xl mx-auto mb-12 leading-relaxed">
                Have a project in mind? Let&apos;s build something great
                together. I&apos;m currently available for new opportunities and
                collaborations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${displayEmail}`}
                  className="flex items-center justify-center gap-2 px-10 py-5 bg-primary text-secondary font-label-caps text-label-caps text-[13px] border-2 border-primary hover:bg-background hover:text-primary transition-all shadow-[6px_6px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
                >
                  <span className="material-symbols-outlined">mail</span>
                  Send Me an Email
                </a>
                {/* <a
                  href={displayLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-10 py-5 bg-background text-primary font-label-caps text-label-caps text-[13px] border-2 border-primary hover:bg-primary hover:text-secondary transition-all shadow-[6px_6px_0px_0px_rgba(0,0,102,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
                >
                  <span className="material-symbols-outlined">person</span>
                  Connect on LinkedIn
                </a> */}
              </div>

              {/* Email chip */}
              <p className="mt-8 font-code text-code text-primary/50">
                or email me directly at{" "}
                <a
                  href={`mailto:${displayEmail}`}
                  className="text-primary underline underline-offset-2"
                >
                  {displayEmail}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-primary border-t-2 border-primary">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-5 md:px-16 py-8 max-w-[1200px] mx-auto">
          {/* Brand */}
          <div>
            <div className="font-display text-[20px] text-secondary font-extrabold uppercase tracking-tight mb-1">
              {displayName}
              <span className="text-secondary/50">.</span>
            </div>
            <div className="font-code text-[11px] text-secondary/50">
              Built with Next.js &amp; ❤️
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-label-caps text-label-caps text-secondary/60 hover:text-secondary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Social + copyright */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-4">
              {[
                { label: "GitHub", href: displayGithub, icon: "code" },
                { label: "LinkedIn", href: displayLinkedin, icon: "person" },
                {
                  label: "Email",
                  href: `mailto:${displayEmail}`,
                  icon: "mail",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="w-9 h-9 border-2 border-secondary/30 flex items-center justify-center text-secondary/60 hover:text-secondary hover:border-secondary transition-colors"
                  aria-label={s.label}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {s.icon}
                  </span>
                </a>
              ))}
            </div>
            <span className="font-code text-[11px] text-secondary/40">
              © {new Date().getFullYear()} {displayName}. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* ═══════════════ IMAGE PREVIEW POP-UP MODAL ═══════════════ */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative border-4 border-primary bg-background shadow-[12px_12px_0px_0px_rgba(0,0,102,1)] max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-secondary border-b-2 border-primary">
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-2xl text-primary">
                  workspace_premium
                </span>

                <h3 className="font-headline-md text-headline-md text-primary truncate max-w-md md:max-w-xl font-bold">
                  {selectedImage.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 border-2 border-primary bg-background hover:bg-primary hover:text-secondary text-primary transition-colors flex items-center justify-center"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-2xl">
                  close
                </span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="bg-white flex-1 min-h-0 p-4">
              <iframe
                src={selectedImage.url}
                title={selectedImage.title}
                className="w-full h-[70vh] border-2 border-primary"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-surface border-t-2 border-primary flex justify-between items-center gap-4">
              <span className="font-code text-xs text-primary/70 hidden md:block">
                Preview sertifikat PDF
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-secondary text-primary border-2 border-primary font-label-caps text-label-caps hover:bg-primary hover:text-secondary transition-colors"
                >
                  Buka PDF
                </a>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-1.5 bg-primary text-secondary border-2 border-primary font-label-caps text-label-caps hover:bg-secondary hover:text-primary transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
