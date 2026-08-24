"use client";

import type { ProjectTesting, ProjectTestingStatus } from "@/types/portfolio";
import { EmptyPlaceholder, PLACEHOLDER } from "./Section";

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

export interface TestingSectionProps {
  testings: ProjectTesting[];
}

export function TestingSection({ testings }: TestingSectionProps) {
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
              const cfg =
                STATUS_CONFIG[t.status as ProjectTestingStatus] ??
                STATUS_CONFIG.pending;
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
