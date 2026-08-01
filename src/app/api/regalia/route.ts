import { getRegaliaView, isDegreeLevel, DEGREE_LEVELS } from "@/lib/regalia";

/**
 * GET /api/regalia?university=<id>&level=<bachelor|phd>
 * Returns the fully resolved regalia configuration (colours as hex) for one
 * university and degree level.
 */
export function GET(request: Request): Response {
  const url = new URL(request.url);
  const universityId = url.searchParams.get("university");
  const level = url.searchParams.get("level");

  if (!universityId || !level) {
    return Response.json(
      { error: "Both 'university' and 'level' query parameters are required." },
      { status: 400 },
    );
  }

  if (!isDegreeLevel(level)) {
    return Response.json(
      { error: `Invalid degree level '${level}'. Expected one of: ${DEGREE_LEVELS.join(", ")}.` },
      { status: 400 },
    );
  }

  const view = getRegaliaView(universityId, level);
  if (!view) {
    return Response.json(
      { error: `Unknown university id '${universityId}'.` },
      { status: 404 },
    );
  }

  return Response.json(view);
}
