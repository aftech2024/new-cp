/**
 * "Kabar Teknologi" — a twice-weekly tech news briefing.
 *
 * Editions live in src/content/blog/editions/<date>.json, written by
 * scripts/blog/run.ts (see .github/workflows/blog.yml). They are not bundled:
 * scripts/prerender.ts copies them to dist/blog-data/ and the pages fetch them,
 * so the bundle stays the same size however many editions accumulate.
 *
 * Kept free of build-time globals: scripts/blog/ imports it under plain Node.
 */

export const BLOG_CATEGORIES = ["ai", "software", "cloud", "security", "iot", "drone"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/** Where scripts/prerender.ts publishes the edition data. */
export const BLOG_DATA_PATH = "/blog-data";

export interface BlogSource {
  name: string;
  url: string;
  publishedAt: string;
}

export interface BlogItem {
  category: BlogCategory;
  headline: string;
  summary: string;
  whyItMatters: string;
  source: BlogSource;
}

export interface BlogEdition {
  slug: string;
  /** Publication date in Asia/Jakarta, YYYY-MM-DD. */
  date: string;
  title: string;
  description: string;
  items: BlogItem[];
  /** Optional comment from the Aftech team — only ever written by a person. */
  aftechNote: string | null;
  meta: {
    model: string;
    generatedAt: string;
    /** True when the edition could only be published through a reviewed pull request. */
    reviewed: boolean;
  };
}

export interface BlogIndexEntry {
  slug: string;
  date: string;
  title: string;
  description: string;
  categories: BlogCategory[];
  itemCount: number;
}

export function editionSlug(date: string): string {
  return `kabar-teknologi-${date}`;
}

/** "Senin, 19 Oktober 2026" / "Monday, October 19, 2026" — dates are calendar days, so format them in UTC. */
export function formatEditionDate(date: string, lang: "id" | "en", weekday = true): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    timeZone: "UTC",
    ...(weekday ? { weekday: "long" as const } : {}),
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
