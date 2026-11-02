"use client";

export const TOC_ITEMS = [
  { id: "overview", icon: "info", label: "Overview" },
  { id: "problems", icon: "report_problem", label: "Problems" },
  { id: "solutions", icon: "lightbulb", label: "Solutions" },
  { id: "designs", icon: "design_services", label: "Designs" },
  { id: "features", icon: "star", label: "Features" },
  { id: "testing", icon: "bug_report", label: "Testing" },
  { id: "results", icon: "bar_chart", label: "Results" },
  { id: "learnings", icon: "school", label: "Learnings" },
];

interface TocSidebarProps {
  visibleSections?: string[];
}

export function TocSidebar({ visibleSections }: TocSidebarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter TOC items based on visible sections
  const filteredItems = visibleSections
    ? TOC_ITEMS.filter((item) => visibleSections.includes(item.id))
    : TOC_ITEMS;

  return (
    <aside className="hidden xl:block w-48 flex-shrink-0">
      <div className="sticky top-28 space-y-1">
        <p className="font-label-caps text-label-caps text-primary/40 mb-4">
          IN THIS PAGE
        </p>
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left font-code text-code text-[12px] text-primary/50 hover:text-primary hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[14px]">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
