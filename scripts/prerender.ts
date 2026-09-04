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
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { services } from "../src/data/services";
import { projects } from "../src/data/projects";
import { insights } from "../src/data/insights";
import { company, locations } from "../src/data/company";

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
}

const staticRoutes: Route[] = [
  {
    path: "/",
    title: `${SITE_NAME} | Technology, Engineering & Construction`,
    description:
      "PT Aftech Daya Solusindo delivers technology, engineering and mechanical & electrical solutions — with civil construction and interior work delivered through our second company, Halora.",
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

const insightRoutes: Route[] = insights.map((i) => ({
  path: `/insights/${i.slug}`,
  title: i.title,
  description: i.excerpt,
  type: "article",
  priority: "0.5",
}));

const routes = [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...insightRoutes];

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
    sameAs: [company.social.instagram],
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

console.log(`prerender: ${routes.length} routes, sitemap.xml rewritten`);
