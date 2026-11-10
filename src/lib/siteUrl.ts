/**
 * Public base URL for metadata, the sitemap and robots.txt.
 * Netlify sets URL to the site's primary address during builds, so a
 * deploy gets the right links without any manual config.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000";
