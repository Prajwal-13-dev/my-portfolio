import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

/** True once the camera is within `threshold` world units of the ref'd object.
 *  Used to switch nodes between a compact pill and a full detail card, so
 *  a zoomed-out overview doesn't turn into an illegible pile of overlapping
 *  cards. */
export function useIsNear(threshold: number) {
  const ref = useRef<Group>(null);
  const [isNear, setIsNear] = useState(false);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    const near = camera.position.distanceTo(ref.current.position) < threshold;
    setIsNear((prev) => (prev === near ? prev : near));
  });

  return { ref, isNear };
}
