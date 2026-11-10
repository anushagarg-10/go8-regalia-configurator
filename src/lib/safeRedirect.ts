/**
 * Returns `next` only if it is a same-origin path, otherwise `fallback`.
 *
 * A bare `startsWith("/")` check is not enough: `//evil.com` and
 * `/\evil.com` both start with a slash but browsers treat them as links to
 * another site, which turns a login redirect into an open redirect.
 * Resolving against a fixed base and comparing origins catches those, plus
 * `javascript:` and other scheme tricks.
 */
const BASE = "http://localhost";

export function safeRedirectPath(next: string | null | undefined, fallback = "/studio"): string {
  if (!next || !next.startsWith("/")) return fallback;
  try {
    const url = new URL(next, BASE);
    if (url.origin !== BASE) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
