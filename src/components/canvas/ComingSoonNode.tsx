"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NodeLabel } from "./NodeLabel";
import { useIsNear } from "@/lib/canvas/useIsNear";

const NEAR_THRESHOLD = 16;

export function ComingSoonNode({
  position,
  title,
  description,
  href,
}: {
  position: [number, number, number];
  title: string;
  description: string;
  href?: string;
}) {
  const { ref, isNear } = useIsNear(NEAR_THRESHOLD);
  const [pinned, setPinned] = useState(false);
  const showFullCard = isNear || pinned;

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#52525b" emissive="#3f3f46" emissiveIntensity={0.3} />
      </mesh>
      <Html occlude={false} position={[0, 0.9, 0]} center>
        {showFullCard ? (
          <Card className="w-56 border-dashed border-border/60 bg-card/70 opacity-80 backdrop-blur-sm">
            <CardHeader className="gap-1 pb-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-muted-foreground">{title}</h3>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  coming soon
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </CardHeader>
            {href && (
              <CardContent>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-primary underline"
                >
                  Follow along &rarr;
                </a>
              </CardContent>
            )}
          </Card>
        ) : (
          <NodeLabel title={title} muted onClick={() => setPinned(true)} />
        )}
      </Html>
    </group>
  );
}
