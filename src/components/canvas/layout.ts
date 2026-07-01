import type { Project } from "@/lib/github/types";

export interface LaidOutNode {
  project: Project;
  position: [number, number, number];
}

export interface SkillEdgeData {
  from: [number, number, number];
  to: [number, number, number];
  sharedTags: string[];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Deterministic phyllotaxis (golden-angle spiral) layout so the canvas
 * feels organic and "infinite" rather than a rigid grid, while still
 * being stable across renders/deploys (same repo -> same position)
 * unless a manual canvas_position override is set in Supabase.
 */
export function layoutProjects(projects: Project[]): LaidOutNode[] {
  return projects.map((project, index) => {
    if (project.canvasPosition) {
      const { x, y, z } = project.canvasPosition;
      return { project, position: [x, y, z] };
    }

    const radius = 7.5 * Math.sqrt(index + 1);
    const angle = index * GOLDEN_ANGLE + (hashString(project.repoName) % 100) / 100;
    const jitterY = ((hashString(project.repoName + "y") % 200) - 100) / 100;

    return {
      project,
      position: [radius * Math.cos(angle), jitterY * 0.6, radius * Math.sin(angle)],
    };
  });
}

/** Connects any two nodes that share at least one tag. */
export function computeSkillEdges(nodes: LaidOutNode[]): SkillEdgeData[] {
  const edges: SkillEdgeData[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const sharedTags = a.project.tags.filter((tag) => b.project.tags.includes(tag));

      if (sharedTags.length > 0) {
        edges.push({ from: a.position, to: b.position, sharedTags });
      }
    }
  }

  return edges;
}
