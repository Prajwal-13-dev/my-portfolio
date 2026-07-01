"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageBar } from "./LanguageBar";
import type { Project } from "@/lib/github/types";

function CiBadges({ project }: { project: Project }) {
  const encoded = encodeURIComponent(project.repoName);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.shields.io/github/actions/workflow/status/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/${encoded}/ci.yml?label=build`}
        alt="build status"
        className="h-4"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.shields.io/github/stars/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/${encoded}?style=flat&label=stars`}
        alt="stars"
        className="h-4"
      />
    </div>
  );
}

export function ProjectCard({
  project,
  expanded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      onClick={onToggle}
      className={`cursor-pointer border-border/60 bg-card/95 backdrop-blur-sm shadow-lg transition-all duration-200 ${
        expanded ? "w-80" : "w-56"
      }`}
    >
      <CardHeader className="gap-1 pb-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{project.title}</h3>
          {project.featured && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              featured
            </Badge>
          )}
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {project.description ?? "No description yet."}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <LanguageBar languages={project.languages} />

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, expanded ? undefined : 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <CiBadges project={project} />

        {expanded && (
          <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-border/50 bg-background/60 p-2 text-xs">
            {project.readmeMarkdown ? (
              <div className="prose prose-invert prose-xs max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {project.readmeMarkdown}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground">No README available.</p>
            )}
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-block text-xs font-medium text-primary underline"
            >
              View on GitHub &rarr;
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
