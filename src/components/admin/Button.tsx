import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "font-medium rounded-lg transition inline-flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:bg-slate-50",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400",
    success: "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="animate-spin">⏳</span>
      )}
      {!loading && icon && iconPosition === "left" && <span>{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
