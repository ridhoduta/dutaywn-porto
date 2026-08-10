"use client";

import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  userEmail?: string;
  userRole?: string;
  actions?: ReactNode;
  onLogout?: () => void;
}

export function Header({
  title,
  subtitle,
  userEmail,
  userRole = "Administrator",
  actions,
  onLogout,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Custom Actions */}
            {actions && <div className="flex items-center gap-2">{actions}</div>}

            {/* User Info */}
            {userEmail && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">
                    {userEmail}
                  </p>
                  <p className="text-xs text-slate-500">{userRole}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
