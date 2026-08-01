import { listUniversities } from "@/lib/regalia";

/**
 * GET /api/universities
 * Returns summary records for all Go8 universities.
 *
 * Currently backed by the local seed data via src/lib/regalia.ts; swapping
 * in Supabase later only changes that data-access layer, not this route's
 * contract or its consumers.
 */
export function GET(): Response {
  return Response.json(listUniversities());
}
