"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
}

interface SidebarProps {
  items?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Profile", href: "/admin/profile", icon: "👤" },
  { label: "Skills", href: "/admin/skills", icon: "⚡" },
  { label: "Projects", href: "/admin/projects", icon: "💼" },
  { label: "Certifications", href: "/admin/certifications", icon: "🏆" },
  { label: "Education", href: "/admin/education", icon: "🎓" },
];

export function Sidebar({ items = defaultNavItems }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Portfolio</h2>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      active
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 bg-slate-50">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition"
        >
          <span>🌐</span>
          <span>View Site</span>
          <span className="ml-auto">↗</span>
        </Link>
      </div>
    </aside>
  );
}
