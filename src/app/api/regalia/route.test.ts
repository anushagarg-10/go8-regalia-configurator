import { describe, expect, it } from "vitest";
import { GET } from "./route";

function request(params: Record<string, string>): Request {
  const url = new URL("http://localhost/api/regalia");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url);
}

describe("GET /api/regalia", () => {
  it("returns the resolved regalia view for a valid selection", async () => {
    const response = GET(request({ university: "monash", level: "bachelor" }));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.university.id).toBe("monash");
    expect(body.degreeLevel).toBe("bachelor");
    expect(body.hood.base.hex).toBe("#40b5ad");
    expect(body.notes).toBeTruthy();
  });

  it("returns cap: null for Melbourne bachelors", async () => {
    const response = GET(request({ university: "unimelb", level: "bachelor" }));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.cap).toBeNull();
  });

  it("400s when parameters are missing", async () => {
    const missingBoth = GET(new Request("http://localhost/api/regalia"));
    expect(missingBoth.status).toBe(400);

    const missingLevel = GET(request({ university: "anu" }));
    expect(missingLevel.status).toBe(400);
    const body = await missingLevel.json();
    expect(body.error).toMatch(/required/i);
  });

  it("400s on an invalid degree level", async () => {
    const response = GET(request({ university: "anu", level: "masters" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/invalid degree level/i);
  });

  it("404s on an unknown university", async () => {
    const response = GET(request({ university: "oxford", level: "phd" }));
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toMatch(/unknown university/i);
  });
});
