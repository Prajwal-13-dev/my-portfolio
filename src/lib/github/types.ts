export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  updated_at: string;
  topics: string[];
  private: boolean;
  archived: boolean;
  fork: boolean;
  default_branch: string;
}

export interface ProjectOverride {
  repo_name: string;
  custom_title: string | null;
  custom_description: string | null;
  custom_tags: string[];
  category: string | null;
  featured: boolean;
  hardware_asset_url: string | null;
  canvas_position: { x: number; y: number; z: number } | null;
  hidden: boolean;
}

export interface Project {
  repoName: string;
  title: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  tags: string[];
  category: string | null;
  featured: boolean;
  hardwareAssetUrl: string | null;
  canvasPosition: { x: number; y: number; z: number } | null;
  languages: Record<string, number>;
  readmeMarkdown: string | null;
  defaultBranch: string;
}
