"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Stars } from "@react-three/drei";
import type { CameraControls as CameraControlsImpl } from "@react-three/drei";
import { ProjectNode } from "./ProjectNode";
import { SkillEdge } from "./SkillEdge";
import { ComingSoonNode } from "./ComingSoonNode";
import { layoutProjects, computeSkillEdges } from "./layout";
import type { Project } from "@/lib/github/types";

const FOV_DEGREES = 50;

/** Frames the camera so the whole node graph is visible on first load,
 *  regardless of how many projects/nodes exist. */
function CameraRig({ allPositions }: { allPositions: [number, number, number][] }) {
  const controlsRef = useRef<CameraControlsImpl>(null);

  useEffect(() => {
    const maxRadius = allPositions.reduce(
      (max, [x, y, z]) => Math.max(max, Math.sqrt(x * x + y * y + z * z)),
      1,
    );
    const distance = (maxRadius / Math.sin((FOV_DEGREES / 2) * (Math.PI / 180))) * 1.15;

    controlsRef.current?.setLookAt(0, distance * 0.55, distance * 0.75, 0, 0, 0, false);
  }, [allPositions]);

  return (
    <CameraControls ref={controlsRef} makeDefault minDistance={4} maxDistance={200} />
  );
}

export function Scene({ projects }: { projects: Project[] }) {
  const nodes = useMemo(() => layoutProjects(projects), [projects]);
  const edges = useMemo(() => computeSkillEdges(nodes), [nodes]);
  const comingSoonRadius = 7.5 * Math.sqrt(nodes.length + 1);

  const comingSoonPositions = useMemo(
    (): [number, number, number][] => [
      [comingSoonRadius, 0.4, 0],
      [0, 0.4, comingSoonRadius],
    ],
    [comingSoonRadius],
  );

  const allPositions = useMemo(
    () => [...nodes.map((n) => n.position), ...comingSoonPositions],
    [nodes, comingSoonPositions],
  );

  return (
    <Canvas camera={{ position: [0, 14, 18], fov: FOV_DEGREES }} className="h-dvh w-dvw bg-background">
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 15, 10]} intensity={1.2} />
      <Stars radius={80} depth={50} count={2000} factor={2} fade speed={0.5} />

      <Suspense fallback={null}>
        {nodes.map(({ project, position }) => (
          <ProjectNode key={project.repoName} project={project} position={position} />
        ))}

        {edges.map((edge, i) => (
          <SkillEdge key={i} edge={edge} />
        ))}

        <ComingSoonNode
          position={comingSoonPositions[0]}
          title="AI Recruiter Chat"
          description="A RAG-powered assistant that answers questions about my work, trained on my resume and project history."
        />
        <ComingSoonNode
          position={comingSoonPositions[1]}
          title="Personal AI Assistant"
          description="A side project in progress — will link here once live."
        />
      </Suspense>

      <CameraRig allPositions={allPositions} />
    </Canvas>
  );
}
