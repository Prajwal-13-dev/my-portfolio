"use client";

import { QuadraticBezierLine } from "@react-three/drei";
import type { SkillEdgeData } from "./layout";

export function SkillEdge({ edge }: { edge: SkillEdgeData }) {
  const midY = (edge.from[1] + edge.to[1]) / 2 + 0.6;
  const mid: [number, number, number] = [
    (edge.from[0] + edge.to[0]) / 2,
    midY,
    (edge.from[2] + edge.to[2]) / 2,
  ];

  const opacity = Math.min(0.15 + edge.sharedTags.length * 0.12, 0.6);

  return (
    <QuadraticBezierLine
      start={edge.from}
      end={edge.to}
      mid={mid}
      color="#818cf8"
      lineWidth={0.6}
      transparent
      opacity={opacity}
    />
  );
}
