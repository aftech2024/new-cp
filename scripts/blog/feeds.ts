/**
 * Read the source feeds (RSS 2.0 or Atom) and turn them into a de-duplicated
 * list of candidate stories published inside the edition's window.
 */
import { XMLParser } from "fast-xml-parser";
import type { BlogCategory } from "../../src/data/blog";
import { fetchText, stripHtml } from "./web";

export interface Source {
  name: string;
  url: string;
  category: BlogCategory | null;
  weight: number;
}

export interface Candidate {
  id: string;
  source: Source;
  title: string;
  url: string;
  publishedAt: Date;
  /** Short description for the selection step. */
  snippet: string;
  /** Whatever full text the feed itself carries — a fallback when the page can't be read. */
  feedText: string;
}

const MAX_PER_SOURCE = 6;
const MAX_CANDIDATES = 150;

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text" });

function asArray<T>(value: T | T[] | undefined): T[] {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

function text(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return text(value[0]);
  if (typeof value === "object" && "#text" in value) return text((value as Record<string, unknown>)["#text"]);
  return "";
}

function atomLink(value: unknown): string {
  const links = asArray(value as Record<string, string> | Record<string, string>[]);
  const alternate = links.find((l) => !l["@_rel"] || l["@_rel"] === "alternate") ?? links[0];
  return alternate?.["@_href"] ?? text(value);
}

/** Drop tracking parameters and fragments so the same story compares equal. */
export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw.trim());
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_|ref$|src$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return raw.trim();
  }
}

function titleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

interface RawItem {
  title: string;
  url: string;
  publishedAt: Date | null;
  summary: string;
  content: string;
}

function parseFeed(xml: string): RawItem[] {
  const doc = parser.parse(xml);
  if (doc.rss?.channel) {
    return asArray(doc.rss.channel.item).map((item: Record<string, unknown>) => ({
      title: stripHtml(text(item.title)),
      url: text(item.link) || text(item.guid),
      publishedAt: new Date(text(item.pubDate) || text(item["dc:date"])),
      summary: text(item.description),
      content: text(item["content:encoded"]),
    }));
  }
  if (doc.feed) {
    return asArray(doc.feed.entry).map((entry: Record<string, unknown>) => ({
      title: stripHtml(text(entry.title)),
      url: atomLink(entry.link),
      publishedAt: new Date(text(entry.published) || text(entry.updated)),
      summary: text(entry.summary),
      content: text(entry.content),
    }));
  }
  if (doc["rdf:RDF"]) {
    return asArray(doc["rdf:RDF"].item).map((item: Record<string, unknown>) => ({
      title: stripHtml(text(item.title)),
      url: text(item.link),
      publishedAt: new Date(text(item["dc:date"])),
      summary: text(item.description),
      content: "",
    }));
  }
  throw new Error("not an RSS or Atom feed");
}

/**
 * Stories from every source published after `since`, newest and most
 * trusted first. Sources that fail are reported and skipped.
 */
export async function collectCandidates(
  sources: Source[],
  since: Date,
  excludeUrls: Set<string>,
): Promise<{ candidates: Candidate[]; report: string[] }> {
  const report: string[] = [];
  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        const items = parseFeed(await fetchText(source.url))
          .filter((i) => i.title && i.url && i.publishedAt && !Number.isNaN(i.publishedAt.getTime()))
          .filter((i) => i.publishedAt! > since && i.publishedAt! <= new Date(Date.now() + 3600_000))
          .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime())
          .slice(0, MAX_PER_SOURCE);
        report.push(`${source.name}: ${items.length}`);
        return items.map((i) => ({ source, item: i }));
      } catch (error) {
        report.push(`${source.name}: FAILED (${(error as Error).message})`);
        return [];
      }
    }),
  );

  const seenUrls = new Set(excludeUrls);
  const seenTitles = new Set<string>();
  const candidates: Candidate[] = [];
  const ranked = results
    .flat()
    .sort(
      (a, b) =>
        b.source.weight - a.source.weight || b.item.publishedAt!.getTime() - a.item.publishedAt!.getTime(),
    );
  for (const { source, item } of ranked) {
    const url = normalizeUrl(item.url);
    const key = titleKey(item.title);
    if (seenUrls.has(url) || seenTitles.has(key)) continue;
    seenUrls.add(url);
    seenTitles.add(key);
    candidates.push({
      id: `c${candidates.length + 1}`,
      source,
      title: item.title,
      url,
      publishedAt: item.publishedAt!,
      snippet: stripHtml(item.summary || item.content).slice(0, 280),
      feedText: stripHtml(item.content || item.summary).slice(0, 6000),
    });
    if (candidates.length === MAX_CANDIDATES) break;
  }
  return { candidates, report: report.sort() };
}
