import { useMemo } from "react";
import {
  CatmullRomCurve3,
  LatheGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";
import type { RegaliaView } from "@/lib/regalia";

/**
 * Stylized boutique-mannequin wearing gown, hood, and cap.
 *
 * The gown is a pleated lathe surface, the hood is a tube swept along a
 * draped V-curve, and fabrics use physically based sheen so the cloth
 * catches light like fabric rather than plastic. Still procedural (no
 * external assets), and still a pure scene graph so it renders headlessly
 * under @react-three/test-renderer.
 */

const MANNEQUIN_COLOR = "#2b2730";
const PLINTH_COLOR = "#e9e1d1";
const DEFAULT_TASSEL = "#2e2a2a";

function FabricMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.78}
      metalness={0}
      sheen={1}
      sheenColor="#ffffff"
      sheenRoughness={0.55}
    />
  );
}

function SilkMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.35}
      metalness={0.05}
      clearcoat={0.5}
      clearcoatRoughness={0.4}
      sheen={0.6}
      sheenColor="#fff6e8"
      sheenRoughness={0.3}
    />
  );
}

function MannequinMaterial() {
  return <meshStandardMaterial color={MANNEQUIN_COLOR} roughness={0.62} metalness={0.08} />;
}

/** Lathe profile of the gown with a radial ripple so the skirt reads as pleated drape. */
function usePleatedGownGeometry() {
  return useMemo(() => {
    const profile: Vector2[] = [
      new Vector2(0.92, 0.55),
      new Vector2(0.8, 0.85),
      new Vector2(0.62, 1.3),
      new Vector2(0.5, 1.75),
      new Vector2(0.44, 2.15),
      new Vector2(0.46, 2.45),
      new Vector2(0.42, 2.7),
      new Vector2(0.3, 2.85),
      new Vector2(0.18, 2.92),
    ];
    const geometry = new LatheGeometry(profile, 128);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      const angle = Math.atan2(z, x);
      // Pleats deepen toward the hem and fade out at the yoke.
      const drape = Math.min(Math.max((2.85 - y) / 2.3, 0), 1);
      const ripple = 1 + 0.02 * drape * Math.sin(angle * 16) + 0.008 * drape * Math.sin(angle * 5 + 1.3);
      positions.setX(i, x * ripple);
      positions.setZ(i, z * ripple);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

function useHoodCurves() {
  return useMemo(() => {
    const vBand = new CatmullRomCurve3([
      new Vector3(-0.3, 2.86, -0.14),
      new Vector3(-0.33, 2.79, 0.12),
      new Vector3(-0.17, 2.54, 0.35),
      new Vector3(0, 2.36, 0.43),
      new Vector3(0.17, 2.54, 0.35),
      new Vector3(0.33, 2.79, 0.12),
      new Vector3(0.3, 2.86, -0.14),
    ]);
    const bindingCurve = new CatmullRomCurve3(
      vBand.getPoints(24).map((p) => new Vector3(p.x * 1.06, p.y - 0.045, p.z * 1.06 + 0.012)),
    );
    return {
      band: new TubeGeometry(vBand, 48, 0.06, 12, false),
      accent: new TubeGeometry(vBand, 48, 0.075, 12, false),
      binding: new TubeGeometry(bindingCurve, 48, 0.02, 10, false),
    };
  }, []);
}

function useTasselGeometry(kind: "trencher" | "bonnet") {
  return useMemo(() => {
    const points =
      kind === "trencher"
        ? [
            new Vector3(0, 3.47, 0),
            new Vector3(0.2, 3.46, 0.1),
            new Vector3(0.33, 3.35, 0.16),
            new Vector3(0.37, 3.12, 0.18),
          ]
        : [
            new Vector3(0.3, 3.38, 0.05),
            new Vector3(0.4, 3.28, 0.1),
            new Vector3(0.45, 3.1, 0.12),
          ];
    return new TubeGeometry(new CatmullRomCurve3(points), 24, 0.015, 8, false);
  }, [kind]);
}

function Mannequin() {
  return (
    <group name="mannequin">
      {/* head */}
      <mesh name="head" position={[0, 3.08, 0]} scale={[1, 1.16, 1.02]} castShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <MannequinMaterial />
      </mesh>
      {/* neck */}
      <mesh position={[0, 2.82, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.11, 0.26, 20]} />
        <MannequinMaterial />
      </mesh>
      {/* chest, visible at the gown's neckline */}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.45, 24]} />
        <MannequinMaterial />
      </mesh>
      {/* legs */}
      <mesh position={[-0.15, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.085, 0.75, 16]} />
        <MannequinMaterial />
      </mesh>
      <mesh position={[0.15, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.085, 0.75, 16]} />
        <MannequinMaterial />
      </mesh>
      {/* plinth */}
      <mesh name="stand" position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.28, 1.36, 0.12, 64]} />
        <meshPhysicalMaterial color={PLINTH_COLOR} roughness={0.32} clearcoat={0.35} clearcoatRoughness={0.3} />
      </mesh>
    </group>
  );
}

function Gown({ view }: { view: RegaliaView }) {
  const gownGeometry = usePleatedGownGeometry();
  const gownHex = view.gown.color.hex;
  const isPhd = view.degreeLevel === "phd";
  // Doctoral gowns with facings/trim get silk front facings; the seed data
  // carries the facing colour via capCordColor for the styles that have one,
  // falling back to the hood accent.
  const showFacings = isPhd && /faced|trimmed/.test(view.gown.style);
  const facingHex = view.cap?.cord?.hex ?? view.hood.accent.hex;
  const sleeveBottom = isPhd ? 0.3 : 0.24;

  return (
    <group name="gown">
      <mesh name="gown-body" geometry={gownGeometry} castShadow receiveShadow>
        <FabricMaterial color={gownHex} />
      </mesh>
      {/* shoulder yoke */}
      <mesh position={[0, 2.8, 0]} scale={[1.18, 0.5, 0.85]} castShadow>
        <sphereGeometry args={[0.42, 28, 28]} />
        <FabricMaterial color={gownHex} />
      </mesh>
      {/* sleeves, hanging close to the body */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.5, 2.18, 0.05]} rotation={[0.06, 0, side * -0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, sleeveBottom, 1.12, 20, 1, true]} />
            <FabricMaterial color={gownHex} />
          </mesh>
          {/* silk cuff band on trimmed doctoral robes */}
          {showFacings && (
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[sleeveBottom - 0.015, sleeveBottom + 0.01, 0.14, 20, 1, true]} />
              <SilkMaterial color={facingHex} />
            </mesh>
          )}
          {/* wrist + hand at the sleeve opening */}
          <mesh position={[0, -0.6, 0.02]}>
            <cylinderGeometry args={[0.045, 0.055, 0.3, 12]} />
            <MannequinMaterial />
          </mesh>
          <mesh position={[0, -0.76, 0.04]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <MannequinMaterial />
          </mesh>
        </group>
      ))}
      {/* doctoral front facings */}
      {showFacings && (
        <>
          <mesh name="gown-facing-left" position={[-0.16, 1.72, 0.58]} rotation={[-0.21, 0, 0.02]} castShadow>
            <boxGeometry args={[0.12, 2.1, 0.045]} />
            <SilkMaterial color={facingHex} />
          </mesh>
          <mesh name="gown-facing-right" position={[0.16, 1.72, 0.58]} rotation={[-0.21, 0, -0.02]} castShadow>
            <boxGeometry args={[0.12, 2.1, 0.045]} />
            <SilkMaterial color={facingHex} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Hood({ view }: { view: RegaliaView }) {
  const { band, accent, binding } = useHoodCurves();
  const colors = view.hood;

  return (
    <group name="hood">
      {/* lining peeking out beneath the band */}
      <mesh name="hood-accent" geometry={accent} position={[0, -0.01, -0.015]} castShadow>
        <SilkMaterial color={colors.accent.hex} />
      </mesh>
      {/* draped V band across the chest */}
      <mesh name="hood-band" geometry={band} castShadow>
        <FabricMaterial color={colors.base.hex} />
      </mesh>
      {colors.binding && (
        <mesh name="hood-binding" geometry={binding} castShadow>
          <SilkMaterial color={colors.binding.hex} />
        </mesh>
      )}
      {/* back drape */}
      <mesh name="hood-drape" position={[0, 2.02, -0.52]} rotation={[2.93, 0, 0]} scale={[1, 1, 0.55]} castShadow>
        <coneGeometry args={[0.4, 1.35, 24]} />
        <FabricMaterial color={colors.base.hex} />
      </mesh>
      <mesh name="hood-lining" position={[0, 1.88, -0.58]} rotation={[2.93, 0, 0]} scale={[1, 1, 0.5]}>
        <coneGeometry args={[0.27, 1, 24]} />
        <SilkMaterial color={colors.accent.hex} />
      </mesh>
    </group>
  );
}

function Trencher({ cap }: { cap: NonNullable<RegaliaView["cap"]> }) {
  const tasselGeometry = useTasselGeometry("trencher");
  const tasselHex = cap.cord?.hex ?? DEFAULT_TASSEL;
  return (
    <>
      {/* skullcap */}
      <mesh position={[0, 3.3, 0]} scale={[1, 0.72, 1]} castShadow>
        <sphereGeometry args={[0.28, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <FabricMaterial color={cap.color.hex} />
      </mesh>
      {/* board, diamond to the front */}
      <mesh name="cap-board" position={[0, 3.46, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.82, 0.035, 0.82]} />
        <FabricMaterial color={cap.color.hex} />
      </mesh>
      <mesh position={[0, 3.49, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
        <SilkMaterial color={tasselHex} />
      </mesh>
      {/* tassel cord + tuft */}
      <mesh geometry={tasselGeometry}>
        <SilkMaterial color={tasselHex} />
      </mesh>
      <mesh position={[0.37, 3.02, 0.18]} castShadow>
        <coneGeometry args={[0.05, 0.18, 12]} />
        <SilkMaterial color={tasselHex} />
      </mesh>
    </>
  );
}

function Bonnet({ cap }: { cap: NonNullable<RegaliaView["cap"]> }) {
  const tasselGeometry = useTasselGeometry("bonnet");
  const tasselHex = cap.cord?.hex ?? DEFAULT_TASSEL;
  return (
    <>
      {/* brim */}
      <mesh name="cap-brim" position={[0, 3.32, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.33, 0.1, 16, 40]} />
        <FabricMaterial color={cap.color.hex} />
      </mesh>
      {/* soft crown */}
      <mesh position={[0, 3.45, 0]} scale={[1, 0.62, 1]} castShadow>
        <sphereGeometry args={[0.3, 28, 28]} />
        <FabricMaterial color={cap.color.hex} />
      </mesh>
      {cap.cord && (
        <mesh name="cap-cord" position={[0, 3.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.022, 12, 40]} />
          <SilkMaterial color={cap.cord.hex} />
        </mesh>
      )}
      {/* hanging tassel */}
      <mesh geometry={tasselGeometry}>
        <SilkMaterial color={tasselHex} />
      </mesh>
      <mesh position={[0.45, 3.0, 0.12]} castShadow>
        <coneGeometry args={[0.045, 0.16, 12]} />
        <SilkMaterial color={tasselHex} />
      </mesh>
    </>
  );
}

function Cap({ view }: { view: RegaliaView }) {
  if (!view.cap) return null;
  const isTrencher = view.cap.style === "trencher";
  return (
    <group name="cap">
      {isTrencher ? <Trencher cap={view.cap} /> : <Bonnet cap={view.cap} />}
    </group>
  );
}

export default function RegaliaModel({ view }: { view: RegaliaView }) {
  return (
    <group name="regalia-model">
      <Mannequin />
      <Gown view={view} />
      <Hood view={view} />
      <Cap view={view} />
    </group>
  );
}
