"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { RegaliaView } from "@/lib/regalia";
import RegaliaModel from "./RegaliaModel";

/**
 * Interactive studio viewer: soft-shadowed three-point lighting, grounded
 * contact shadows, gentle auto-rotate, orbit (drag) and zoom (scroll/pinch).
 */
export default function RegaliaViewer({ view }: { view: RegaliaView }) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ position: [1.7, 2.3, 5.4], fov: 38 }}
      className="touch-none"
      aria-label={`3D preview of ${view.university.shortName} ${view.degreeLevel} regalia`}
    >
      <hemisphereLight args={["#fdf6ea", "#8a7a66", 0.5]} />
      <ambientLight intensity={0.35} />
      {/* key */}
      <directionalLight
        position={[3.5, 6.5, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />
      {/* fill + rim */}
      <directionalLight position={[-4, 3, -2]} intensity={0.45} />
      <directionalLight position={[0, 4, -5]} intensity={0.65} color="#fff2dd" />

      <RegaliaModel view={view} />
      <ContactShadows
        key={`${view.university.id}-${view.degreeLevel}`}
        frames={1}
        position={[0, -0.11, 0]}
        opacity={0.45}
        scale={7}
        blur={2.4}
        far={3.2}
        resolution={256}
        color="#402332"
      />

      <OrbitControls
        target={[0, 1.7, 0]}
        enablePan={false}
        minDistance={2.8}
        maxDistance={9.5}
        maxPolarAngle={Math.PI * 0.55}
        autoRotate
        autoRotateSpeed={0.7}
      />
    </Canvas>
  );
}
