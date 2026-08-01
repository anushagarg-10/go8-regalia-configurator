import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/universities", () => {
  it("returns all eight universities as JSON", async () => {
    const response = GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(8);
    for (const item of body) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        shortName: expect.any(String),
        location: expect.any(String),
        officialSource: expect.stringMatching(/^https:\/\//),
      });
    }
  });
});
