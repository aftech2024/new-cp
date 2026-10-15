/**
 * Polite HTTP for the blog pipeline: a clear User-Agent, timeouts, robots.txt
 * for article pages, and HTML → plain text good enough to ground a summary.
 */

export const USER_AGENT = "Mozilla/5.0 (compatible; AftechNewsBot/1.0; +https://aftech.co.id/blog)";
const BOT_TOKEN = "aftechnewsbot";

export async function fetchText(url: string, timeoutMs = 20000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "*/*" },
      redirect: "follow",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

const robotsCache = new Map<string, Promise<string[]>>();

/** Disallow rules that apply to us (our own group if present, else "*"). */
async function disallowRules(origin: string): Promise<string[]> {
  let cached = robotsCache.get(origin);
  if (!cached) {
    cached = fetchText(`${origin}/robots.txt`, 10000)
      .then((body) => {
        const groups: { agents: string[]; disallow: string[] }[] = [];
        let current: { agents: string[]; disallow: string[] } | null = null;
        for (const raw of body.split(/\r?\n/)) {
          const line = raw.replace(/#.*/, "").trim();
          const match = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
          if (!match) continue;
          const [, field, value] = match;
          const key = field.toLowerCase();
          if (key === "user-agent") {
            if (!current || current.disallow.length > 0) {
              current = { agents: [], disallow: [] };
              groups.push(current);
            }
            current.agents.push(value.toLowerCase());
          } else if (key === "disallow" && current && value) {
            current.disallow.push(value);
          }
        }
        const ours = groups.find((g) => g.agents.some((a) => a.includes(BOT_TOKEN)));
        return (ours ?? groups.find((g) => g.agents.includes("*")))?.disallow ?? [];
      })
      .catch(() => []); // no robots.txt (or unreachable) means no restrictions
    robotsCache.set(origin, cached);
  }
  return cached;
}

export async function robotsAllows(url: string): Promise<boolean> {
  const { origin, pathname, search } = new URL(url);
  const path = pathname + search;
  for (const rule of await disallowRules(origin)) {
    const pattern = new RegExp(
      "^" + rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"),
    );
    if (pattern.test(path)) return false;
  }
  return true;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

export function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|figure|figcaption)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The article's paragraphs as plain text, or "" when the page is blocked by
 * robots.txt, unreachable, or has too little text (paywall, script-rendered).
 */
export async function articleText(url: string, maxChars = 6000): Promise<string> {
  if (!(await robotsAllows(url))) return "";
  let html: string;
  try {
    html = await fetchText(url);
  } catch {
    return "";
  }
  const scope =
    html.match(/<article[\s\S]*<\/article>/i)?.[0] ?? html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? html;
  const paragraphs = [...scope.matchAll(/<p[\s>][\s\S]*?<\/p>/gi)]
    .map((m) => stripHtml(m[0]))
    .filter((p) => p.length >= 40);
  return paragraphs.join("\n").slice(0, maxChars);
}
