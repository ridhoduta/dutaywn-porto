"use client";

import { ReactNode } from "react";

export interface Column<T = any> {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T, index: number) => ReactNode;
}

interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  emptyMessage?: string;
  className?: string;
  hoverable?: boolean;
  striped?: boolean;
}

export function Table<T = any>({
  columns,
  data,
  keyExtractor = (_, index) => index,
  emptyMessage = "No data available",
  className = "",
  hoverable = true,
  striped = false,
}: TableProps<T>) {
  const getAlignment = (align?: string) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-xs font-medium text-slate-700 uppercase tracking-wider ${getAlignment(
                  column.align
                )}`}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row, rowIndex)}
                className={`
                  border-b border-slate-100
                  ${hoverable ? "hover:bg-slate-50" : ""}
                  ${striped && rowIndex % 2 === 1 ? "bg-slate-50/50" : ""}
                  transition-colors
                `}
              >
                {columns.map((column) => {
                  const value = (row as any)[column.key];
                  return (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-slate-900 ${getAlignment(
                        column.align
                      )}`}
                    >
                      {column.render
                        ? column.render(value, row, rowIndex)
                        : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Table Action Buttons
interface TableActionProps {
  icon?: string;
  label?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md";
}

export function TableAction({
  icon,
  label,
  onClick,
  variant = "secondary",
  size = "sm",
}: TableActionProps) {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-medium rounded-lg transition inline-flex items-center gap-1.5
      `}
    >
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
}

// Badge Component for Table Cells
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variantClasses = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
