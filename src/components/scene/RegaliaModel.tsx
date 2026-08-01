import type { RegaliaView } from "@/lib/regalia";

/**
 * Stylized mannequin wearing gown, hood, and cap, built from simple
 * primitives with flat-ish shading. Deliberately non-photorealistic:
 * this is a product configurator, and colours are the point.
 *
 * Pure scene graph (no Canvas/controls) so it can be rendered headlessly
 * by @react-three/test-renderer.
 */

const MANNEQUIN_COLOR = "#cfc8bf";
const STAND_COLOR = "#d8d8dc";
const DEFAULT_TASSEL = "#2b2b2b";

interface MaterialProps {
  color: string;
}

function FabricMaterial({ color }: MaterialProps) {
  return <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} flatShading />;
}

function Mannequin() {
  return (
    <group name="mannequin">
      {/* head */}
      <mesh name="head" position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <FabricMaterial color={MANNEQUIN_COLOR} />
      </mesh>
      {/* neck */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.22, 16]} />
        <FabricMaterial color={MANNEQUIN_COLOR} />
      </mesh>
      {/* lower legs, visible below the gown hem */}
      <mesh position={[-0.16, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.8, 12]} />
        <FabricMaterial color="#3a3a3f" />
      </mesh>
      <mesh position={[0.16, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.8, 12]} />
        <FabricMaterial color="#3a3a3f" />
      </mesh>
      {/* shoes */}
      <mesh position={[-0.16, 0.05, 0.08]}>
        <boxGeometry args={[0.16, 0.1, 0.4]} />
        <FabricMaterial color="#26262b" />
      </mesh>
      <mesh position={[0.16, 0.05, 0.08]}>
        <boxGeometry args={[0.16, 0.1, 0.4]} />
        <FabricMaterial color="#26262b" />
      </mesh>
      {/* display stand */}
      <mesh name="stand" position={[0, -0.04, 0]}>
        <cylinderGeometry args={[1.25, 1.35, 0.08, 48]} />
        <FabricMaterial color={STAND_COLOR} />
      </mesh>
    </group>
  );
}

function Gown({ view }: { view: RegaliaView }) {
  const gownHex = view.gown.color.hex;
  // Doctoral gowns with facings/trim get front facing strips; the seed data
  // encodes the facing colour via capCordColor (or falls back to the hood
  // accent) for the styles that have one.
  const showFacings =
    view.degreeLevel === "phd" &&
    /faced|trimmed/.test(view.gown.style);
  const facingHex = view.cap?.cord?.hex ?? view.hood.accent.hex;

  return (
    <group name="gown">
      {/* main robe: flares from shoulders to hem */}
      <mesh name="gown-body" position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.36, 0.88, 2.15, 24]} />
        <FabricMaterial color={gownHex} />
      </mesh>
      {/* shoulders */}
      <mesh position={[0, 2.78, 0]} scale={[1.15, 0.55, 0.8]}>
        <sphereGeometry args={[0.42, 20, 20]} />
        <FabricMaterial color={gownHex} />
      </mesh>
      {/* sleeves */}
      <mesh position={[-0.62, 2.2, 0]} rotation={[0, 0, 0.42]}>
        <cylinderGeometry args={[0.12, 0.2, 1.1, 14]} />
        <FabricMaterial color={gownHex} />
      </mesh>
      <mesh position={[0.62, 2.2, 0]} rotation={[0, 0, -0.42]}>
        <cylinderGeometry args={[0.12, 0.2, 1.1, 14]} />
        <FabricMaterial color={gownHex} />
      </mesh>
      {showFacings && (
        <>
          <mesh name="gown-facing-left" position={[-0.15, 1.78, 0.56]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.1, 2.0, 0.04]} />
            <FabricMaterial color={facingHex} />
          </mesh>
          <mesh name="gown-facing-right" position={[0.15, 1.78, 0.56]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.1, 2.0, 0.04]} />
            <FabricMaterial color={facingHex} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Hood({ view }: { view: RegaliaView }) {
  const { base, accent, binding } = view.hood;
  return (
    <group name="hood">
      {/* neckband */}
      <mesh name="hood-band" position={[0, 2.76, 0.04]} rotation={[1.35, 0, 0]}>
        <torusGeometry args={[0.3, 0.055, 12, 32]} />
        <FabricMaterial color={base.hex} />
      </mesh>
      {/* accent trim on the neckband */}
      <mesh name="hood-accent" position={[0, 2.72, 0.07]} rotation={[1.35, 0, 0]}>
        <torusGeometry args={[0.31, 0.028, 12, 32]} />
        <FabricMaterial color={accent.hex} />
      </mesh>
      {binding && (
        <mesh name="hood-binding" position={[0, 2.68, 0.09]} rotation={[1.35, 0, 0]}>
          <torusGeometry args={[0.315, 0.018, 12, 32]} />
          <FabricMaterial color={binding.hex} />
        </mesh>
      )}
      {/* back drape */}
      <mesh name="hood-drape" position={[0, 2.15, -0.45]} rotation={[2.95, 0, 0]}>
        <coneGeometry args={[0.34, 1.15, 16]} />
        <FabricMaterial color={base.hex} />
      </mesh>
      {/* lining peeking out of the drape */}
      <mesh name="hood-lining" position={[0, 1.95, -0.53]} rotation={[2.95, 0, 0]}>
        <coneGeometry args={[0.22, 0.85, 16]} />
        <FabricMaterial color={accent.hex} />
      </mesh>
    </group>
  );
}

function Trencher({ view }: { view: NonNullable<RegaliaView["cap"]> }) {
  const tasselHex = view.cord?.hex ?? DEFAULT_TASSEL;
  return (
    <>
      {/* skullcap */}
      <mesh position={[0, 3.28, 0]}>
        <cylinderGeometry args={[0.25, 0.27, 0.14, 20]} />
        <FabricMaterial color={view.color.hex} />
      </mesh>
      {/* board */}
      <mesh name="cap-board" position={[0, 3.38, 0]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.75, 0.035, 0.75]} />
        <FabricMaterial color={view.color.hex} />
      </mesh>
      {/* button */}
      <mesh position={[0, 3.41, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
        <FabricMaterial color={tasselHex} />
      </mesh>
      {/* tassel */}
      <mesh position={[0.17, 3.36, 0.17]} rotation={[0.35, 0, -0.35]}>
        <cylinderGeometry args={[0.012, 0.012, 0.32, 8]} />
        <FabricMaterial color={tasselHex} />
      </mesh>
      <mesh position={[0.26, 3.24, 0.26]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <FabricMaterial color={tasselHex} />
      </mesh>
    </>
  );
}

function Bonnet({ view }: { view: NonNullable<RegaliaView["cap"]> }) {
  return (
    <>
      {/* brim */}
      <mesh name="cap-brim" position={[0, 3.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.09, 12, 32]} />
        <FabricMaterial color={view.color.hex} />
      </mesh>
      {/* soft crown */}
      <mesh position={[0, 3.42, 0]} scale={[1, 0.65, 1]}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <FabricMaterial color={view.color.hex} />
      </mesh>
      {view.cord && (
        <mesh name="cap-cord" position={[0, 3.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.022, 10, 32]} />
          <FabricMaterial color={view.cord.hex} />
        </mesh>
      )}
    </>
  );
}

function Cap({ view }: { view: RegaliaView }) {
  if (!view.cap) return null;
  const isTrencher = view.cap.style === "trencher";
  return (
    <group name="cap">
      {isTrencher ? <Trencher view={view.cap} /> : <Bonnet view={view.cap} />}
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
