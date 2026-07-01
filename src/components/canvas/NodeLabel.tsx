"use client";

export function NodeLabel({
  title,
  accent,
  muted,
  onClick,
}: {
  title: string;
  accent?: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] backdrop-blur-sm transition-colors ${
        muted
          ? "border-border/40 bg-card/40 text-muted-foreground border-dashed"
          : accent
            ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
            : "border-indigo-400/40 bg-indigo-400/10 text-indigo-200"
      }`}
    >
      {title}
    </button>
  );
}
