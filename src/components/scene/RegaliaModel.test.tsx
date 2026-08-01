import { describe, expect, it } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import type { Mesh, MeshStandardMaterial, Object3D } from "three";
import RegaliaModel from "./RegaliaModel";
import { getRegaliaView } from "@/lib/regalia";

async function renderView(universityId: string, level: "bachelor" | "phd") {
  const view = getRegaliaView(universityId, level);
  if (!view) throw new Error(`No view for ${universityId}/${level}`);
  const renderer = await ReactThreeTestRenderer.create(<RegaliaModel view={view} />);
  return renderer;
}

function findByName(root: Object3D, name: string): Object3D | undefined {
  return root.getObjectByName(name);
}

describe("RegaliaModel", () => {
  it("mounts without throwing for every university and degree level", async () => {
    const ids = ["anu", "usyd", "unimelb", "uq", "uwa", "adelaide", "monash", "unsw"] as const;
    for (const id of ids) {
      for (const level of ["bachelor", "phd"] as const) {
        const renderer = await renderView(id, level);
        const model = findByName(renderer.scene.instance, "regalia-model");
        expect(model, `${id}/${level}`).toBeDefined();
        await renderer.unmount();
      }
    }
  });

  it("renders the gown in the university's gown colour", async () => {
    const renderer = await renderView("anu", "phd");
    const gownBody = findByName(renderer.scene.instance, "gown-body") as Mesh;
    expect(gownBody).toBeDefined();
    const material = gownBody.material as MeshStandardMaterial;
    expect(`#${material.color.getHexString()}`).toBe("#1a3f8a");
  });

  it("renders the hood base and accent trim colours", async () => {
    const renderer = await renderView("monash", "bachelor");
    const band = findByName(renderer.scene.instance, "hood-band") as Mesh;
    const bandMaterial = band.material as MeshStandardMaterial;
    expect(`#${bandMaterial.color.getHexString()}`).toBe("#40b5ad");
  });

  it("omits the cap entirely for Melbourne bachelors", async () => {
    const renderer = await renderView("unimelb", "bachelor");
    expect(findByName(renderer.scene.instance, "cap")).toBeUndefined();
    expect(findByName(renderer.scene.instance, "hood-binding")).toBeDefined();
  });

  it("renders a trencher board for trencher caps and a brim for bonnets", async () => {
    const trencher = await renderView("uq", "bachelor");
    expect(findByName(trencher.scene.instance, "cap-board")).toBeDefined();
    expect(findByName(trencher.scene.instance, "cap-brim")).toBeUndefined();

    const bonnet = await renderView("uq", "phd");
    expect(findByName(bonnet.scene.instance, "cap-brim")).toBeDefined();
    expect(findByName(bonnet.scene.instance, "cap-board")).toBeUndefined();
  });
});
