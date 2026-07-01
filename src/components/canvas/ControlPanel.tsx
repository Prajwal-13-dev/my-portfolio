"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function ControlPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-4 py-3 sm:px-6",
        className,
      )}
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-2 shadow-[0_0_20px_-8px_rgba(99,102,241,0.6)] backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
        <span className="font-mono text-sm font-medium tracking-tight text-foreground">
          Prajwal
          <span className="mx-1.5 text-muted-foreground">/</span>
          <span className="text-muted-foreground">Engineering Atlas</span>
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-md sm:flex">
          <span>Drag to explore</span>
          <span className="text-border">·</span>
          <span>Scroll to zoom</span>
          <span className="text-border">·</span>
          <span>Click a node to expand</span>
        </div>
        <Link
          href="/about"
          className="rounded-full border border-border/50 bg-card/60 px-3.5 py-1.5 font-mono text-[11px] font-medium text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-card/90"
        >
          About
        </Link>
      </div>
    </div>
  );
}
