/**
 * Write one "Kabar Teknologi" edition.
 *
 *   npx tsx scripts/blog/run.ts             write today's edition (Asia/Jakarta date)
 *   npx tsx scripts/blog/run.ts --dry-run   only fetch and list candidate stories (no API key needed)
 *   npx tsx scripts/blog/run.ts --date=2026-10-19 --force
 *
 * Needs ANTHROPIC_API_KEY. BLOG_MODE=auto marks the edition as unreviewed;
 * anything else (the default, "pr") marks it reviewed, because then it can
 * only reach the site through a merged pull request.
 *
 * Exit codes: 0 written (or already exists), 2 not enough good material — the
 * edition is skipped rather than padded — anything else is an error.
 * In GitHub Actions it reports `file`, `date` and `title` as step outputs and,
 * when BLOG_PR_BODY is set, writes a review summary there for the PR.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { editionSlug, type BlogEdition, type BlogItem } from "../../src/data/blog";
import { collectCandidates, type Source, type Candidate } from "./feeds";
import { articleText } from "./web";

const ROOT = process.cwd();
const EDITIONS_DIR = resolve(ROOT, "src/content/blog/editions");
const SOURCES_FILE = resolve(ROOT, "src/content/blog/sources.json");

const MAX_ITEMS = 5;
const MIN_ITEMS = 3;
const MIN_SOURCE_CHARS = 300;
const DAY = 86_400_000;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const now = new Date();
const date =
  args.find((a) => a.startsWith("--date="))?.slice(7) ??
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(now);

function fail(code: number, message: string): never {
  console.error(message);
  process.exit(code);
}

function indonesianDate(isoDate: string): string {
  return new Intl.DateTimeFormat("id-ID", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), max * 0.6)).trimEnd() + "…";
}

/** True when the write-up repeats 10 consecutive words of its source verbatim. */
function copiesSource(writeup: string, source: string): boolean {
  const words = (s: string) => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const sourceWords = words(source);
  const shingles = new Set<string>();
  for (let i = 0; i + 10 <= sourceWords.length; i++) shingles.add(sourceWords.slice(i, i + 10).join(" "));
  const w = words(writeup);
  for (let i = 0; i + 10 <= w.length; i++) if (shingles.has(w.slice(i, i + 10).join(" "))) return true;
  return false;
}

function loadEditions(): BlogEdition[] {
  if (!existsSync(EDITIONS_DIR)) return [];
  return readdirSync(EDITIONS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(resolve(EDITIONS_DIR, f), "utf8")) as BlogEdition)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function githubOutput(values: Record<string, string>) {
  if (!process.env.GITHUB_OUTPUT) return;
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(values)
      .map(([k, v]) => `${k}=${v.replace(/\n/g, " ")}\n`)
      .join(""),
  );
}

async function main() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(1, `invalid --date: ${date}`);
  const file = resolve(EDITIONS_DIR, `${date}.json`);
  if (existsSync(file) && !force && !dryRun) {
    console.log(`edition ${date} already exists — nothing to do`);
    return;
  }

  // Window: everything since the previous edition, at most 5 days back.
  const previous = loadEditions().filter((e) => e.date < date);
  const lastRun = previous[0] ? new Date(previous[0].meta.generatedAt) : new Date(now.getTime() - 4 * DAY);
  const since = new Date(Math.max(lastRun.getTime(), now.getTime() - 5 * DAY));
  const usedUrls = new Set(previous.slice(0, 20).flatMap((e) => e.items.map((i) => i.source.url)));

  const { sources } = JSON.parse(readFileSync(SOURCES_FILE, "utf8")) as { sources: Source[] };
  const { candidates, report } = await collectCandidates(sources, since, usedUrls);
  console.log(`sources since ${since.toISOString()}:\n  ${report.join("\n  ")}`);
  console.log(`${candidates.length} candidate stories`);

  if (dryRun) {
    for (const c of candidates.slice(0, 40)) console.log(`  ${c.id} [${c.source.name}] ${c.title}`);
    return;
  }
  if (candidates.length < 10) fail(2, "too few new stories in the window — skipping this edition");

  const { selectStories, writeEdition, verifyEdition } = await import("./claude");

  // 1. pick
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const perSource = new Map<string, number>();
  const picks: { candidate: Candidate; category: string }[] = [];
  for (const pick of await selectStories(candidates, now)) {
    const candidate = byId.get(pick.id);
    if (!candidate) continue;
    const count = perSource.get(candidate.source.name) ?? 0;
    if (count >= 2) continue;
    perSource.set(candidate.source.name, count + 1);
    picks.push({ candidate, category: pick.category });
    if (picks.length === MAX_ITEMS + 1) break;
  }
  console.log(`picked: ${picks.map((p) => `${p.candidate.id} ${p.candidate.title}`).join(" | ")}`);

  // 2. source text — the article page (when robots.txt allows it) or the feed's own text, whichever says more
  const stories = [];
  for (const pick of picks) {
    const page = await articleText(pick.candidate.url);
    const text = page.length >= pick.candidate.feedText.length ? page : pick.candidate.feedText;
    if (text.length < MIN_SOURCE_CHARS) {
      console.log(`  drop ${pick.candidate.id}: not enough source text`);
      continue;
    }
    stories.push({ ...pick, text });
  }
  if (stories.length < MIN_ITEMS) fail(2, "not enough readable sources — skipping this edition");
  const textById = new Map(stories.map((s) => [s.candidate.id, s.text]));

  // 3. write, 4. check
  const { edition: draft, model } = await writeEdition(stories);
  const verdicts = await verifyEdition(draft.items, textById);

  const items: BlogItem[] = [];
  for (const item of draft.items) {
    const candidate = byId.get(item.id);
    const source = textById.get(item.id);
    const verdict = verdicts.get(item.id);
    let problem = "";
    if (!candidate || !source) problem = "unknown source id";
    else if (!verdict?.supported) problem = `fact check: ${verdict?.problem || "no verdict"}`;
    else if (copiesSource(`${item.headline} ${item.summary} ${item.whyItMatters}`, source)) problem = "copies source text";
    else if (item.headline.length > 110 || item.summary.length > 520 || item.whyItMatters.length > 330)
      problem = "too long";
    if (problem) {
      console.log(`  drop ${item.id}: ${problem}`);
      continue;
    }
    items.push({
      category: item.category,
      headline: item.headline.trim(),
      summary: item.summary.trim(),
      whyItMatters: item.whyItMatters.trim(),
      // Links come from the feed, never from the model.
      source: { name: candidate!.source.name, url: candidate!.url, publishedAt: candidate!.publishedAt.toISOString() },
    });
    if (items.length === MAX_ITEMS) break;
  }
  if (items.length < MIN_ITEMS) fail(2, `only ${items.length} items passed the checks — skipping this edition`);

  const edition: BlogEdition = {
    slug: editionSlug(date),
    date,
    title: `Kabar Teknologi ${indonesianDate(date)}: ${clip(draft.topics.trim(), 90)}`,
    description: clip(draft.description.trim(), 160),
    items,
    aftechNote: null,
    meta: { model, generatedAt: now.toISOString(), reviewed: process.env.BLOG_MODE !== "auto" },
  };
  writeFileSync(file, JSON.stringify(edition, null, 2) + "\n", "utf8");
  console.log(`wrote ${file} (${items.length} items)`);

  githubOutput({ file: `src/content/blog/editions/${date}.json`, date, title: edition.title });
  if (process.env.BLOG_PR_BODY) {
    const body = [
      `**${edition.title}**`,
      "",
      `> ${edition.description}`,
      "",
      ...items.flatMap((item, i) => [
        `### ${i + 1}. ${item.headline}`,
        `\`${item.category}\` · [${item.source.name}](${item.source.url})`,
        "",
        item.summary,
        "",
        `**Kenapa penting:** ${item.whyItMatters}`,
        "",
      ]),
      "---",
      "**Merge** untuk menerbitkan edisi ini di aftech.co.id/blog. Perlu koreksi? Edit file JSON di PR ini (tab *Files changed* → ⋯ → *Edit file*) lalu merge. **Close** PR untuk membatalkan edisi.",
      "",
      `Model: \`${model}\` · ${items.length} berita · dicek fakta otomatis terhadap teks sumber.`,
    ].join("\n");
    writeFileSync(process.env.BLOG_PR_BODY, body, "utf8");
  }
}

main().catch((error) => fail(1, `blog edition failed: ${(error as Error).stack ?? error}`));
