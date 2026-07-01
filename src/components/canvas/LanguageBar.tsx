"use client";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Java: "#b07219",
};

function colorFor(language: string): string {
  return LANGUAGE_COLORS[language] ?? "#8b8b8b";
}

export function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  if (total === 0) return null;

  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {entries.map(([language, bytes]) => (
          <div
            key={language}
            style={{ width: `${(bytes / total) * 100}%`, backgroundColor: colorFor(language) }}
            title={`${language} ${((bytes / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-1 flex flex-wrap gap-x-2 text-[10px] text-muted-foreground">
        {entries.slice(0, 3).map(([language, bytes]) => (
          <span key={language} className="flex items-center gap-1">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: colorFor(language) }}
            />
            {language} {((bytes / total) * 100).toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}
