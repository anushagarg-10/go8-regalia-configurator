"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { RegaliaView } from "@/lib/regalia";
import RegaliaModel from "./RegaliaModel";

/**
 * Interactive 3D viewer: orbit (drag), zoom (scroll/pinch), rotate.
 */
export default function RegaliaViewer({ view }: { view: RegaliaView }) {
  return (
    <Canvas
      camera={{ position: [1.6, 2.4, 5.8], fov: 40 }}
      className="touch-none"
      aria-label={`3D preview of ${view.university.shortName} ${view.degreeLevel} regalia`}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} />
      <RegaliaModel view={view} />
      <OrbitControls
        target={[0, 1.7, 0]}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI * 0.55}
      />
    </Canvas>
  );
}
