import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  title,
  subtitle,
  actions,
  className = "",
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}
    >
      {(title || subtitle || actions) && (
        <div
          className={`flex items-start justify-between border-b border-slate-200 ${paddingClasses[padding]}`}
        >
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={title || subtitle || actions ? paddingClasses[padding] : paddingClasses[padding]}>
        {children}
      </div>
    </div>
  );
}
