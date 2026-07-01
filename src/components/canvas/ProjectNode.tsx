"use client";

import { Html } from "@react-three/drei";
import { ProjectCard } from "./ProjectCard";
import { NodeLabel } from "./NodeLabel";
import { useCanvasStore } from "@/lib/canvas/store";
import { useIsNear } from "@/lib/canvas/useIsNear";
import type { Project } from "@/lib/github/types";

const NEAR_THRESHOLD = 16;

export function ProjectNode({
  project,
  position,
}: {
  project: Project;
  position: [number, number, number];
}) {
  const selectedRepo = useCanvasStore((s) => s.selectedRepo);
  const select = useCanvasStore((s) => s.select);
  const hover = useCanvasStore((s) => s.hover);
  const expanded = selectedRepo === project.repoName;
  const { ref, isNear } = useIsNear(NEAR_THRESHOLD);
  const showFullCard = expanded || isNear;

  return (
    <group ref={ref} position={position}>
      <mesh
        onPointerOver={() => hover(project.repoName)}
        onPointerOut={() => hover(null)}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={project.featured ? "#f59e0b" : "#6366f1"}
          emissive={project.featured ? "#f59e0b" : "#6366f1"}
          emissiveIntensity={0.4}
        />
      </mesh>
      <Html occlude={false} zIndexRange={[expanded ? 100 : 10, 0]} position={[0, 0.9, 0]} center>
        {showFullCard ? (
          <ProjectCard
            project={project}
            expanded={expanded}
            onToggle={() => select(expanded ? null : project.repoName)}
          />
        ) : (
          <NodeLabel
            title={project.title}
            accent={project.featured}
            onClick={() => select(project.repoName)}
          />
        )}
      </Html>
    </group>
  );
}
