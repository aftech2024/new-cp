/**
 * Post-build SEO pass.
 *
 * Vite emits one index.html whose <head> is identical for every URL, so a
 * crawler's first fetch of /about, /contact or any project page sees the
 * homepage's title and description. Search engines do render JavaScript, but
 * that happens on a later, slower pass and the first impression is what gets
 * indexed initially.
 *
 * This writes a real HTML file per route with its own title, description,
 * canonical, Open Graph tags and structured data, then regenerates sitemap.xml
 * from the same data the app renders. Apache serves those files directly —
 * the SPA rewrite only fires when no file or directory matches — and React
 * takes over as usual once it boots.
 *
 * Runs via `vite build --ssr` so it can import the app's data modules through
 * the same aliases the app uses, keeping the two from drifting apart.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { services } from "../src/data/services";
import { projects } from "../src/data/projects";
import { insights } from "../src/data/insights";
import { isQuoteOnly, products, YEARLY_MONTHS } from "../src/data/products";
import { company, locations, capabilityMatrix, values, HALORA_URL, WHATSAPP_URL } from "../src/data/company";
import { BLOG_DATA_PATH, type BlogEdition, type BlogIndexEntry } from "../src/data/blog";

// Canonical host is the bare domain; .htaccess redirects www to it. Normalise
// so a stray "www." in the environment cannot contradict that redirect.
const SITE_URL = (process.env.VITE_SITE_URL || "https://aftech.co.id")
  .replace(/\/$/, "")
  .replace("://www.", "://");
const SITE_NAME = process.env.VITE_SITE_NAME || company.legalName;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const DIST = resolve(process.cwd(), "dist");

interface Route {
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  /** Sitemap priority; also the rough order of importance on the site. */
  priority: string;
  /** Extra structured data for this page. */
  jsonLd?: object[];
  /** Advertise the blog's RSS feed. */
  feed?: boolean;
}

const staticRoutes: Route[] = [
  {
    path: "/",
    title: `${SITE_NAME} | Technology, Engineering & Construction`,
    description:
      "PT Aftech Daya Solusindo has spent over 5 years delivering technology, engineering and mechanical & electrical solutions, with civil construction and interior work delivered through our second company, Halora.",
    type: "website",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About",
    description:
      "PT Aftech Daya Solusindo is a technology-first company also delivering mechanical & electrical capability, with civil and interior work delivered through our second company Halora.",
    type: "website",
    priority: "0.8",
  },
  {
    path: "/services",
    title: "Services",
    description: "Technology, mechanical & electrical and integrated solutions from PT Aftech Daya Solusindo.",
    type: "website",
    priority: "0.8",
  },
  {
    path: "/products",
    title: "Produk",
    description:
      "Aplikasi siap pakai dari Aftech: kontrol biaya proyek konstruksi, manajemen portofolio proyek, ERP, MRV karbon biru, fotogrametri drone, dan pertanian cerdas.",
    type: "website",
    priority: "0.8",
  },
  {
    path: "/projects",
    title: "Projects",
    description: "Selected technology, mechanical & electrical and integrated projects delivered by Aftech.",
    type: "website",
    priority: "0.8",
  },
  {
    path: "/insights",
    title: "Insights",
    description: "Perspectives on technology, engineering, construction and business from the Aftech team.",
    type: "website",
    priority: "0.6",
  },
  {
    path: "/contact",
    title: "Contact",
    description:
      "Tell us what you are building. Our team will help identify the right technology, engineering or construction approach.",
    type: "website",
    priority: "0.7",
  },
];

const serviceRoutes: Route[] = services.map((s) => ({
  path: `/services/${s.slug}`,
  title: s.title,
  description: s.shortStatement,
  type: "website",
  priority: "0.7",
}));

const projectRoutes: Route[] = projects.map((p) => ({
  path: `/projects/${p.slug}`,
  title: p.title,
  description: p.description,
  type: "article",
  priority: "0.6",
}));

// Product pages are written for Indonesian buyers first, so their head uses the Indonesian copy.
const productRoutes: Route[] = products.flatMap((p) =>
  p.page
    ? [
        {
          path: `/products/${p.slug}`,
          title: p.page.seoTitle.id,
          description: p.page.seoDescription.id,
          type: "website" as const,
          priority: "0.8",
          jsonLd: [
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: p.name,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: p.page.seoDescription.id,
              url: `${SITE_URL}/products/${p.slug}`,
              provider: { "@type": "Organization", name: company.legalName, url: SITE_URL },
              ...(isQuoteOnly(p.page.pricing)
                ? {}
                : {
                    offers: p.page.pricing.tiers.flatMap((tier) =>
                      tier.monthly === null
                        ? []
                        : [{ "@type": "Offer", name: tier.name.id, price: tier.monthly, priceCurrency: "IDR", url: `${SITE_URL}/products/${p.slug}#pricing` }],
                    ),
                  }),
            },
          ],
        },
      ]
    : [],
);

const insightRoutes: Route[] = insights.map((i) => ({
  path: `/insights/${i.slug}`,
  title: i.title,
  description: i.excerpt,
  type: "article",
  priority: "0.5",
}));

// "Kabar Teknologi" editions (src/data/blog.ts), newest first. The section only
// exists once the first edition does.
const BLOG_DIR = resolve(process.cwd(), "src/content/blog/editions");
const editions: BlogEdition[] = (existsSync(BLOG_DIR) ? readdirSync(BLOG_DIR) : [])
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(resolve(BLOG_DIR, f), "utf8")) as BlogEdition)
  .sort((a, b) => b.date.localeCompare(a.date));

const BLOG_TITLE = "Kabar Teknologi";
const BLOG_DESCRIPTION =
  "Kabar teknologi pilihan dua kali seminggu — AI, software, cloud, keamanan siber, IoT dan drone — diringkas untuk organisasi di Indonesia.";

function newsArticleJsonLd(edition: BlogEdition) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: edition.title,
    description: edition.description,
    datePublished: edition.meta.generatedAt,
    dateModified: edition.meta.generatedAt,
    inLanguage: "id-ID",
    mainEntityOfPage: `${SITE_URL}/blog/${edition.slug}`,
    image: [OG_IMAGE],
    author: { "@type": "Organization", name: company.legalName, url: `${SITE_URL}/` },
    publisher: {
      "@type": "Organization",
      name: company.legalName,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
    citation: edition.items.map((item) => item.source.url),
  };
}

const blogRoutes: Route[] = editions.length
  ? [
      { path: "/blog", title: BLOG_TITLE, description: BLOG_DESCRIPTION, type: "website", priority: "0.6", feed: true },
      ...editions.map(
        (e): Route => ({
          path: `/blog/${e.slug}`,
          title: e.title,
          description: e.description,
          type: "article",
          priority: "0.5",
          feed: true,
          jsonLd: [newsArticleJsonLd(e)],
        }),
      ),
    ]
  : [];

const routes = [...staticRoutes, ...serviceRoutes, ...productRoutes, ...projectRoutes, ...insightRoutes, ...blogRoutes];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Organization details, so Google can tie the site to the real company. */
function organizationJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: company.legalName,
    alternateName: company.shortName,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/favicon.png`,
    image: OG_IMAGE,
    description: staticRoutes[0].description,
    email: company.email,
    telephone: company.phone,
    sameAs: [company.social.instagram, company.social.tiktok],
    address: locations.map((l) => ({
      "@type": "PostalAddress",
      streetAddress: l.address,
      addressCountry: "ID",
    })),
  });
}

function websiteJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: company.shortName,
    url: `${SITE_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  });
}

function breadcrumbJsonLd(route: Route): string | null {
  const segments = route.path.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const items = [{ name: "Home", item: `${SITE_URL}/` }];
  let acc = "";
  for (const segment of segments) {
    acc += `/${segment}`;
    const match = routes.find((r) => r.path === acc);
    items.push({ name: match ? match.title : segment, item: `${SITE_URL}${acc}` });
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  });
}

function headFor(route: Route): string {
  const fullTitle = route.title.includes(SITE_NAME) ? route.title : `${route.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
  const t = escapeHtml(fullTitle);
  const d = escapeHtml(route.description);

  const blocks = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${route.type}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="id_ID" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ];

  if (route.path === "/") {
    blocks.push(`<script type="application/ld+json">${organizationJsonLd()}</script>`);
    blocks.push(`<script type="application/ld+json">${websiteJsonLd()}</script>`);
  }
  const crumbs = breadcrumbJsonLd(route);
  if (crumbs) blocks.push(`<script type="application/ld+json">${crumbs}</script>`);
  for (const data of route.jsonLd ?? []) {
    blocks.push(`<script type="application/ld+json">${JSON.stringify(data)}</script>`);
  }
  if (route.feed) {
    blocks.push(
      `<link rel="alternate" type="application/rss+xml" title="${BLOG_TITLE} — ${escapeHtml(company.shortName)}" href="${SITE_URL}/blog/rss.xml" />`,
    );
  }

  return blocks.map((line) => `    ${line}`).join("\n");
}

// ---------------------------------------------------------------------------

const template = readFileSync(resolve(DIST, "index.html"), "utf8");

// Strip the tags the template already carries so they are not emitted twice;
// every route supplies its own below.
const stripped = template
  .replace(/\s*<title>[\s\S]*?<\/title>/, "")
  .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "");

if (!stripped.includes("</head>")) {
  throw new Error("dist/index.html has no </head> — cannot inject SEO tags");
}

for (const route of routes) {
  const html = stripped.replace("</head>", `${headFor(route)}\n  </head>`);
  // Flat "<route>.html" rather than "<route>/index.html": a directory would
  // make mod_dir 301 /about to /about/, which contradicts the canonical tag.
  // .htaccess maps the extensionless URL onto these files.
  const target = route.path === "/" ? resolve(DIST, "index.html") : resolve(DIST, `.${route.path}.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html, "utf8");
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(
    (r) =>
      `  <url><loc>${SITE_URL}${r.path === "/" ? "/" : r.path}</loc><lastmod>${today}</lastmod><priority>${r.priority}</priority></url>`,
  ),
  "</urlset>",
  "",
].join("\n");
writeFileSync(resolve(DIST, "sitemap.xml"), sitemap, "utf8");

// ---------------------------------------------------------------------------
// Blog data. The pages fetch these instead of bundling every edition.
// index.json is written even when empty: a missing file would fall through to
// the SPA's index.html and fail to parse as JSON.

const blogDataDir = resolve(DIST, `.${BLOG_DATA_PATH}`);
mkdirSync(blogDataDir, { recursive: true });
const blogIndex: BlogIndexEntry[] = editions.map((e) => ({
  slug: e.slug,
  date: e.date,
  title: e.title,
  description: e.description,
  categories: [...new Set(e.items.map((i) => i.category))],
  itemCount: e.items.length,
}));
writeFileSync(resolve(blogDataDir, "index.json"), JSON.stringify(blogIndex), "utf8");
for (const edition of editions) {
  writeFileSync(resolve(blogDataDir, `${edition.slug}.json`), JSON.stringify(edition), "utf8");
}

if (editions.length) {
  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${BLOG_TITLE} — ${escapeHtml(company.shortName)}</title>`,
    `<link>${SITE_URL}/blog</link>`,
    `<description>${escapeHtml(BLOG_DESCRIPTION)}</description>`,
    "<language>id</language>",
    `<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
    `<lastBuildDate>${new Date(editions[0].meta.generatedAt).toUTCString()}</lastBuildDate>`,
    ...editions.slice(0, 30).map((e) =>
      [
        "<item>",
        `<title>${escapeHtml(e.title)}</title>`,
        `<link>${SITE_URL}/blog/${e.slug}</link>`,
        `<guid isPermaLink="true">${SITE_URL}/blog/${e.slug}</guid>`,
        `<pubDate>${new Date(e.meta.generatedAt).toUTCString()}</pubDate>`,
        `<description>${escapeHtml(`${e.description} — ${e.items.map((i) => i.headline).join(" · ")}`)}</description>`,
        "</item>",
      ].join(""),
    ),
    "</channel>",
    "</rss>",
    "",
  ].join("\n");
  mkdirSync(resolve(DIST, "blog"), { recursive: true });
  writeFileSync(resolve(DIST, "blog", "rss.xml"), rss, "utf8");
}

// ---------------------------------------------------------------------------
// Chat assistant knowledge. public/api/chat.php answers only from this file,
// so it is generated from the same data the pages render and cannot drift.
// src/data/assistant-knowledge.md adds what the pages don't say: how visitors
// phrase their needs, and the FAQ that comes up in chat. It is appended as-is.

const bullet = (items: string[]) => items.map((i) => `- ${i}`).join("\n");

const knowledge = [
  "# Company",
  `${company.legalName} (${company.shortName}). Tagline: "${company.tagline}". ${company.positioning}`,
  staticRoutes[0].description,
  `Experience: ${company.experience}`,
  `Values: ${values.join(", ")}.`,
  `Halora website: ${HALORA_URL}`,
  "",
  "# Capabilities",
  ...capabilityMatrix.map((c) => `- ${c.group} (${c.company}): ${c.items.join(", ")}`),
  "",
  "# Contact",
  `- Email: ${company.email}`,
  `- Office phone: ${company.phone}`,
  `- WhatsApp: ${company.whatsapp} (chat link: ${WHATSAPP_URL})`,
  `- Instagram: ${company.social.instagram}`,
  `- TikTok: ${company.social.tiktok}`,
  `- SIPLah store: ${company.social.siplah}`,
  "- Contact form / start a project: /contact",
  "",
  "# Offices",
  ...locations.map((l) => `- ${l.name} (${l.tag}): ${l.address}`),
  "",
  "# Services",
  ...services.flatMap((s) => [
    `## ${s.title} — /services/${s.slug}`,
    s.intro,
    `Capabilities: ${s.capabilities.join(", ")}.`,
    `Process: ${s.process.join(" → ")}.`,
    ...(s.highlights?.length ? ["Highlights:", bullet(s.highlights)] : []),
    ...s.faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
    "",
  ]),
  "# Products (ready-made applications)",
  ...products.flatMap((p) => [
    `## ${p.name} — ${p.page ? `/products/${p.slug}` : p.caseStudy ? `/projects/${p.caseStudy}` : "/products"}`,
    `${p.category.en}. ${p.tagline.en}`,
    ...(p.page
      ? [
          p.page.intro.en,
          `Modules: ${p.page.modules.map((m) => `${m.name.en} (${m.summary.en})`).join("; ")}`,
          `For: ${p.page.personas.map((x) => x.title.en).join(", ")}.`,
          isQuoteOnly(p.page.pricing)
            ? `Pricing: no published price. Each implementation is quoted by sales — ${p.page.pricing.tiers
                .map((tier) => `${tier.customNote?.en ?? tier.description.en}. Includes: ${tier.features.map((f) => f.en).join(", ")}`)
                .join("; ")}. Point visitors to the demo form or the sales team.`
            : `Plans (prices exclude VAT; yearly billing charges ${YEARLY_MONTHS} months): ${p.page.pricing.tiers
                .map(
                  (tier) =>
                    `${tier.name.en} — ${tier.monthly === null ? "custom price, contact sales" : `Rp ${tier.monthly.toLocaleString("id-ID")} per month`} — ${tier.limits.map((x) => `${x.label.en}: ${x.value.en}`).join(", ")} — ${tier.description.en}`,
                )
                .join("; ")}.`,
          "Demo: visitors book one with the form on the product page (date, time slot, online or in person).",
          ...p.page.faq.map((f) => `Q: ${f.question.en}\nA: ${f.answer.en}`),
        ]
      : ["Product page coming soon; point visitors to the case study or the contact form."]),
    "",
  ]),
  "# Projects",
  ...projects.flatMap((p) => [
    `## ${p.title} — /projects/${p.slug}`,
    [
      p.client && `Client: ${p.client}`,
      p.location && `Location: ${p.location}`,
      p.status && `Status: ${p.status}`,
      p.year && `Year: ${p.year}`,
      p.liveUrl && `Live platform: ${p.liveUrl}`,
    ]
      .filter(Boolean)
      .join(" · "),
    p.description,
    `Scope: ${p.scope.join(", ")}.`,
    "",
  ]),
  "# Insights (articles)",
  ...insights.map((i) => `- ${i.title} — /insights/${i.slug}: ${i.excerpt}`),
  "",
  "# Site pages",
  bullet(staticRoutes.map((r) => `${r.path} — ${r.title}`)),
  "",
  readFileSync(resolve(process.cwd(), "src/data/assistant-knowledge.md"), "utf8").trim(),
  "",
].join("\n");

mkdirSync(resolve(DIST, "api"), { recursive: true });
writeFileSync(resolve(DIST, "api", "chat-knowledge.txt"), knowledge, "utf8");

console.log(
  `prerender: ${routes.length} routes, sitemap.xml rewritten, ${editions.length} blog editions, chat knowledge ${knowledge.length} chars`,
);
