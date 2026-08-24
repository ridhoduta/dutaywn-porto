"use client";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-primary/10 ${className ?? ""}`}
    />
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="bg-background text-primary min-h-screen">
      {/* Nav */}
      <nav className="fixed w-full top-0 z-50 bg-background border-b-2 border-primary">
        <div className="flex items-center justify-between w-full px-5 md:px-16 max-w-[1200px] mx-auto h-20">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </nav>

      <div className="pt-24 max-w-[900px] mx-auto px-5 md:px-16 pb-24 space-y-16">
        <Skeleton className="w-full h-[420px]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
