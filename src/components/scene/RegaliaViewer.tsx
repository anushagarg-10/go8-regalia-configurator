"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { DEGREE_LEVEL_LABELS, type RegaliaView } from "@/lib/regalia";
import { DEFAULT_MANNEQUIN, type MannequinConfig } from "@/lib/mannequin";
import RegaliaModel from "./RegaliaModel";

const MIN_DISTANCE = 2.8;
const MAX_DISTANCE = 9.5;
const MIN_POLAR = 0.15;
const MAX_POLAR = Math.PI * 0.55;
/** One arrow-key press turns the camera by this much. */
const ROTATE_STEP = Math.PI / 12; // 15°
const ZOOM_STEP = 0.88;
const DEFAULT_CAMERA: [number, number, number] = [1.7, 2.3, 5.4];
const TARGET: [number, number, number] = [0, 1.7, 0];

/** Pops the model in on selection change and adds a gentle idle bob. */
function AnimatedRig({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state, delta) => {
    const rig = ref.current;
    if (!rig) return;
    rig.scale.setScalar(rig.scale.x + (1 - rig.scale.x) * Math.min(1, delta * 5));
    rig.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.03;
  });
  return (
    <group ref={ref} scale={0.9}>
      {children}
    </group>
  );
}

function toDegrees(radians: number): number {
  return Math.round((((radians * 180) / Math.PI) % 360) + 360) % 360;
}

/**
 * Interactive studio viewer: soft-shadowed three-point lighting, grounded
 * contact shadows, gentle auto-rotate, orbit (drag) and zoom (scroll/pinch).
 *
 * Keyboard: the viewer is focusable; arrow keys orbit, +/- zoom and Home
 * resets. Each step is announced through a polite live region so screen
 * reader users know what changed.
 */
export default function RegaliaViewer({
  view,
  mannequin = DEFAULT_MANNEQUIN,
  autoRotate = true,
  onCanvasReady,
}: {
  view: RegaliaView;
  mannequin?: MannequinConfig;
  /** Turntable motion; the studio exposes a pause control (WCAG 2.2.2). */
  autoRotate?: boolean;
  /** Receives the WebGL canvas element, e.g. for card exports. */
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [announcement, setAnnouncement] = useState("");
  const hintId = useId();
  const label = `3D preview of ${view.university.shortName} ${DEGREE_LEVEL_LABELS[view.degreeLevel]} regalia`;

  function announce() {
    const controls = controlsRef.current;
    if (!controls) return;
    const distance = controls.getDistance();
    const zoom = Math.round(((MAX_DISTANCE - distance) / (MAX_DISTANCE - MIN_DISTANCE)) * 100);
    setAnnouncement(
      `Rotation ${toDegrees(controls.getAzimuthalAngle())} degrees, tilt ${toDegrees(
        controls.getPolarAngle(),
      )} degrees, zoom ${Math.max(0, Math.min(100, zoom))} percent`,
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const controls = controlsRef.current;
    if (!controls) return;
    const azimuth = controls.getAzimuthalAngle();
    const polar = controls.getPolarAngle();

    switch (event.key) {
      case "ArrowLeft":
        controls.setAzimuthalAngle(azimuth - ROTATE_STEP);
        break;
      case "ArrowRight":
        controls.setAzimuthalAngle(azimuth + ROTATE_STEP);
        break;
      case "ArrowUp":
        controls.setPolarAngle(Math.max(MIN_POLAR, polar - ROTATE_STEP));
        break;
      case "ArrowDown":
        controls.setPolarAngle(Math.min(MAX_POLAR, polar + ROTATE_STEP));
        break;
      case "+":
      case "=":
        controls.dollyIn(ZOOM_STEP);
        break;
      case "-":
      case "_":
        controls.dollyOut(ZOOM_STEP);
        break;
      case "Home":
        controls.object.position.set(...DEFAULT_CAMERA);
        controls.target.set(...TARGET);
        break;
      default:
        return;
    }
    // Keep arrow keys from scrolling the page while the viewer has focus.
    event.preventDefault();
    controls.update();
    announce();
  }

  return (
    <div
      role="group"
      aria-roledescription="3D viewer"
      aria-label={label}
      aria-describedby={hintId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-full w-full rounded-t-3xl outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-maroon/60 lg:rounded-l-3xl lg:rounded-tr-none"
    >
      <p id={hintId} className="sr-only">
        Use the left and right arrow keys to rotate, up and down to tilt, plus and minus to zoom,
        and Home to reset the view.
      </p>
      <p aria-live="polite" className="sr-only" data-testid="viewer-announcement">
        {announcement}
      </p>
      <Canvas
        shadows="percentage"
        dpr={[1, 1.75]}
        camera={{ position: DEFAULT_CAMERA, fov: 38 }}
        className="touch-none"
        aria-hidden
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => onCanvasReady?.(gl.domElement)}
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

        <AnimatedRig key={`rig-${view.university.id}-${view.degreeLevel}`}>
          <RegaliaModel view={view} mannequin={mannequin} />
        </AnimatedRig>
        <ContactShadows
          key={`shadows-${view.university.id}-${view.degreeLevel}`}
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
          ref={controlsRef}
          target={TARGET}
          enablePan={false}
          minDistance={MIN_DISTANCE}
          maxDistance={MAX_DISTANCE}
          minPolarAngle={MIN_POLAR}
          maxPolarAngle={MAX_POLAR}
          autoRotate={autoRotate}
          autoRotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
