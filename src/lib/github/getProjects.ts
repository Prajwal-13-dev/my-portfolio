import "server-only";
import { githubFetch } from "./client";
import type { GitHubRepo, Project, ProjectOverride } from "./types";
import { createClient } from "@/lib/supabase/server";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "Prajwal-13-dev";

async function fetchRepoList(): Promise<GitHubRepo[]> {
  const res = await githubFetch(
    `/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&per_page=100`,
  );
  if (!res.ok) {
    throw new Error(`GitHub repo list fetch failed: ${res.status}`);
  }
  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => !r.private && !r.archived && !r.fork);
}

async function fetchLanguages(repoName: string): Promise<Record<string, number>> {
  const res = await githubFetch(`/repos/${GITHUB_USERNAME}/${repoName}/languages`);
  if (!res.ok) return {};
  return res.json();
}

async function fetchReadme(repoName: string): Promise<string | null> {
  const res = await githubFetch(`/repos/${GITHUB_USERNAME}/${repoName}/readme`, {
    raw: true,
  });
  if (!res.ok) return null;
  return res.text();
}

async function fetchOverrides(): Promise<Map<string, ProjectOverride>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new Map();
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("project_overrides").select("*");

  if (error || !data) return new Map();

  return new Map(
    data.map((row) => [
      row.repo_name,
      {
        repo_name: row.repo_name,
        custom_title: row.custom_title,
        custom_description: row.custom_description,
        custom_tags: row.custom_tags ?? [],
        category: row.category,
        featured: row.featured ?? false,
        hardware_asset_url: row.hardware_asset_url,
        canvas_position: row.canvas_position,
        hidden: row.hidden ?? false,
      } satisfies ProjectOverride,
    ]),
  );
}

/**
 * Zero-touch project ingestion: pulls the live public repo list + languages
 * + README straight from GitHub (cached/revalidated hourly), then layers on
 * any curation from Supabase's project_overrides table. A newly pushed repo
 * appears here with no manual step once the cache revalidates.
 */
export async function getProjects(): Promise<Project[]> {
  const [repos, overrides] = await Promise.all([fetchRepoList(), fetchOverrides()]);

  const projects = await Promise.all(
    repos.map(async (repo): Promise<Project | null> => {
      const override = overrides.get(repo.name);
      if (override?.hidden) return null;

      const [languages, readmeMarkdown] = await Promise.all([
        fetchLanguages(repo.name),
        fetchReadme(repo.name),
      ]);

      return {
        repoName: repo.name,
        title: override?.custom_title ?? repo.name,
        description: override?.custom_description ?? repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.pushed_at,
        tags: Array.from(new Set([...(repo.topics ?? []), ...(override?.custom_tags ?? [])])),
        category: override?.category ?? null,
        featured: override?.featured ?? false,
        hardwareAssetUrl: override?.hardware_asset_url ?? null,
        canvasPosition: override?.canvas_position ?? null,
        languages,
        readmeMarkdown,
        defaultBranch: repo.default_branch,
      };
    }),
  );

  return projects.filter((p): p is Project => p !== null);
}
