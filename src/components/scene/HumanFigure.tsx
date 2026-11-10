"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Bone, type Group } from "three";
import { clone as cloneWithSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { MannequinBuild } from "@/lib/mannequin";

/**
 * Rigged human avatars, vendored from Ready Player Me's MIT-licensed
 * Unity-Loadtest repository (see public/avatars/LICENSE.md). The GLBs ship
 * in T-pose; we relax the arms by rotating the shoulder bones so the gown
 * drapes naturally, then scale the figure to the studio's world units.
 */

const AVATARS: Record<MannequinBuild, string> = {
  female: "/avatars/638e50b1d72bffc6fa18253f.glb",
  male: "/avatars/638e50b05a7d322604bbd0de.glb",
};

const TARGET_HEIGHT = 3.3;

/** Local-space arm rotations that bring a T-pose to arms-at-sides. The
 * left/right arm bones are mirrored, so symmetric drop needs opposite signs. */
const ARM_POSE: Record<string, [number, number, number]> = {
  LeftArm: [0, 0, -1.32],
  RightArm: [0, 0, 1.32],
  LeftForeArm: [0, 0, -0.18],
  RightForeArm: [0, 0, 0.18],
};

export default function HumanFigure({ build }: { build: MannequinBuild }) {
  const { scene } = useGLTF(AVATARS[build]);

  const figure = useMemo(() => {
    const root = cloneWithSkeleton(scene) as Group;
    root.traverse((node) => {
      const bone = node as Bone;
      if ((bone as Bone).isBone && ARM_POSE[bone.name]) {
        const [x, y, z] = ARM_POSE[bone.name];
        bone.rotation.x += x;
        bone.rotation.y += y;
        bone.rotation.z += z;
      }
      node.castShadow = true;
    });
    root.updateMatrixWorld(true);

    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const scale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
    root.scale.setScalar(scale);
    root.position.y = -box.min.y * scale;
    return root;
  }, [scene]);

  return <primitive object={figure} name="human-figure" />;
}

if (typeof window !== "undefined") {
  useGLTF.preload(AVATARS.female);
  useGLTF.preload(AVATARS.male);
}
