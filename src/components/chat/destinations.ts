import { company, HALORA_URL, WHATSAPP_URL } from "@/data/company";
import { insights } from "@/data/insights";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { localizeInsights, localizeProjects, localizeServices } from "@/i18n/localize";

type T = (key: string, fallback?: string) => string;

export type DestinationIcon = "page" | "contact" | "project" | "service" | "insight" | "live" | "whatsapp" | "external";

export interface Destination {
  href: string;
  title: string;
  /** What kind of place this is, shown above the title ("Project", "Live platform"). */
  kind: string;
  icon: DestinationIcon;
  external: boolean;
}

export function normalizeHref(href: string): string {
  return href.trim().toLowerCase().replace(/[.,;:!?]+$/, "").replace(/\/+$/, "");
}

/** Every place the assistant may send a visitor, keyed by normalized href. */
export function buildDestinations(t: T): Map<string, Destination> {
  const map = new Map<string, Destination>();
  const add = (d: Omit<Destination, "external"> & { external?: boolean }) =>
    map.set(normalizeHref(d.href), { external: false, ...d });

  const page = t("chat.kind.page");
  add({ href: "/about", title: t("chat.page.about"), kind: page, icon: "page" });
  add({ href: "/services", title: t("chat.page.services"), kind: page, icon: "service" });
  add({ href: "/projects", title: t("chat.page.projects"), kind: page, icon: "project" });
  add({ href: "/insights", title: t("chat.page.insights"), kind: page, icon: "insight" });
  add({ href: "/contact", title: t("chat.page.contact"), kind: t("chat.kind.contact"), icon: "contact" });

  for (const s of localizeServices(services, t)) {
    add({ href: `/services/${s.slug}`, title: s.title, kind: t("chat.kind.service"), icon: "service" });
  }
  for (const p of localizeProjects(projects, t)) {
    add({ href: `/projects/${p.slug}`, title: p.title, kind: t("chat.kind.project"), icon: "project" });
    if (p.liveUrl) {
      add({ href: p.liveUrl, title: p.title, kind: t("chat.kind.live"), icon: "live", external: true });
    }
  }
  for (const i of localizeInsights(insights, t)) {
    add({ href: `/insights/${i.slug}`, title: i.title, kind: t("chat.kind.insight"), icon: "insight" });
  }

  add({ href: WHATSAPP_URL, title: `WhatsApp ${company.whatsapp}`, kind: t("chat.kind.whatsapp"), icon: "whatsapp", external: true });
  add({ href: company.social.instagram, title: "Instagram @aftechds", kind: t("chat.kind.external"), icon: "external", external: true });
  add({ href: company.social.tiktok, title: "TikTok @aftechds", kind: t("chat.kind.external"), icon: "external", external: true });
  add({ href: company.social.siplah, title: t("chat.page.siplah"), kind: t("chat.kind.external"), icon: "external", external: true });
  add({ href: HALORA_URL, title: "Halora Galona Adikara", kind: t("chat.kind.external"), icon: "external", external: true });

  return map;
}

const LINK = String.raw`https?:\/\/[^\s)]+|\/(?:about|services|projects|insights|contact)(?:\/[a-z0-9-]+)*`;
// "(…/path)" and " — /path" lose the whole aside; a bare path becomes the page name.
const INLINE_RE = new RegExp(String.raw`\s*\((${LINK})\)|\s+[—–-]\s+(${LINK})|(${LINK})`, "g");

/**
 * The assistant is told to keep paths out of its prose, but if one slips in,
 * lift it into a link card instead of showing a raw "/projects/…" string.
 */
export function liftInlineLinks(text: string, destinations: Map<string, Destination>): { text: string; hrefs: string[] } {
  const hrefs: string[] = [];
  const replaced = text
    .replace(INLINE_RE, (match, inParens: string | undefined, afterDash: string | undefined, bare: string | undefined, offset: number, full: string) => {
      const raw = inParens ?? afterDash ?? bare ?? "";
      // A path glued to a word or domain ("aftech.co.id/contact") is not a site link on its own.
      if (bare && raw.startsWith("/") && /[\w.]/.test(full[offset - 1] ?? "")) return match;
      const token = raw.replace(/[.,;:!?]+$/, "");
      const trailing = raw.slice(token.length);
      const dest = destinations.get(normalizeHref(token));
      if (!dest) return match;
      hrefs.push(dest.href);
      return (bare ? dest.title : "") + trailing;
    })
    .replace(/[ \t]+([.,;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ");
  return { text: replaced.trim(), hrefs };
}

/** Reply text without Markdown markers — for the clipboard and read-aloud. */
export function toPlainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
