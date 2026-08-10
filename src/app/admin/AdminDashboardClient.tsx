"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout, Header, Card } from "@/components/admin";
import { handleLogout } from "./logout-action";

interface AdminDashboardClientProps {
  userEmail: string;
  stats: {
    skills: number;
    projects: number;
    certifications: number;
    education: number;
  };
}

const navigationCards = [
  {
    href: "/admin/profile",
    icon: "👤",
    title: "Profile",
    description: "Edit informasi profil, foto, dan kontak",
    color: "blue",
  },
  {
    href: "/admin/skills",
    icon: "⚡",
    title: "Skills",
    description: "Kelola technical skills dan kategori",
    color: "green",
  },
  {
    href: "/admin/projects",
    icon: "💼",
    title: "Projects",
    description: "Tambah dan edit portfolio projects",
    color: "purple",
  },
  {
    href: "/admin/certifications",
    icon: "🏆",
    title: "Certifications",
    description: "Kelola sertifikasi profesional",
    color: "yellow",
  },
  {
    href: "/admin/education",
    icon: "🎓",
    title: "Education",
    description: "Kelola riwayat pendidikan",
    color: "red",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    hover: "group-hover:bg-blue-200",
    border: "hover:border-blue-300",
    text: "group-hover:text-blue-500",
  },
  green: {
    bg: "bg-green-100",
    hover: "group-hover:bg-green-200",
    border: "hover:border-green-300",
    text: "group-hover:text-green-500",
  },
  purple: {
    bg: "bg-purple-100",
    hover: "group-hover:bg-purple-200",
    border: "hover:border-purple-300",
    text: "group-hover:text-purple-500",
  },
  yellow: {
    bg: "bg-yellow-100",
    hover: "group-hover:bg-yellow-200",
    border: "hover:border-yellow-300",
    text: "group-hover:text-yellow-500",
  },
  red: {
    bg: "bg-red-100",
    hover: "group-hover:bg-red-200",
    border: "hover:border-red-300",
    text: "group-hover:text-red-500",
  },
};

export function AdminDashboardClient({
  userEmail,
  stats,
}: AdminDashboardClientProps) {
  const router = useRouter();

  return (
    <AdminLayout>
      <Header
        title="Portfolio Admin"
        subtitle="Kelola konten portfolio Anda"
        userEmail={userEmail}
        onLogout={async () => {
          await handleLogout();
          router.push("/admin/login");
        }}
      />

      <div className="p-6 space-y-6">
        {/* Welcome Card */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Selamat Datang! 👋
          </h2>
          <p className="text-slate-600">
            Dashboard admin portfolio Anda. Gunakan menu di bawah untuk mulai
            mengelola konten.
          </p>
        </Card>

        {/* Quick Stats */}
        <Card title="Quick Stats" subtitle="Overview of your portfolio content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats.skills}</p>
              <p className="text-sm text-slate-600 mt-1">Skills</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {stats.projects}
              </p>
              <p className="text-sm text-slate-600 mt-1">Projects</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                {stats.certifications}
              </p>
              <p className="text-sm text-slate-600 mt-1">Certifications</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">
                {stats.education}
              </p>
              <p className="text-sm text-slate-600 mt-1">Education</p>
            </div>
          </div>
        </Card>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => {
            const colors = colorClasses[card.color as keyof typeof colorClasses];
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`block bg-white rounded-lg shadow-sm border border-slate-200 p-6 ${colors.border} hover:shadow-md transition group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 ${colors.bg} rounded-lg ${colors.hover} transition`}
                  >
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <span
                    className={`text-slate-400 ${colors.text} transition`}
                  >
                    →
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600">{card.description}</p>
              </Link>
            );
          })}

          {/* View Site Card */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-sm border border-slate-700 p-6 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="text-white/60 group-hover:text-white transition">
                ↗
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              View Site
            </h3>
            <p className="text-sm text-slate-300">
              Lihat portfolio public Anda
            </p>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
