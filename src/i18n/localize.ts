import type { Insight, Project, Service } from "@/types";

type T = (key: string, fallback?: string) => string;

/** Overlay translated text fields onto a project; falls back to the source data per-field. */
export function localizeProject(p: Project, t: T): Project {
  const b = `prjData.${p.slug}`;
  return {
    ...p,
    title: t(`${b}.title`, p.title),
    description: t(`${b}.desc`, p.description),
    scope: p.scope.map((s, i) => t(`${b}.scope.${i}`, s)),
    gallery: p.gallery.map((g, i) => ({
      ...g,
      caption: g.caption ? t(`${b}.gal.${i}`, g.caption) : g.caption,
    })),
  };
}

export function localizeProjects(list: Project[], t: T): Project[] {
  return list.map((p) => localizeProject(p, t));
}

/** Overlay translated text fields onto a service; falls back to the source data per-field. */
export function localizeService(s: Service, t: T): Service {
  const b = `svcData.${s.slug}`;
  return {
    ...s,
    title: t(`${b}.title`, s.title),
    shortStatement: t(`${b}.short`, s.shortStatement),
    imageAlt: s.imageAlt ? t(`${b}.imageAlt`, s.imageAlt) : s.imageAlt,
    intro: t(`${b}.intro`, s.intro),
    capabilities: s.capabilities.map((c, i) => t(`${b}.cap.${i}`, c)),
    process: s.process.map((step, i) => t(`${b}.proc.${i}`, step)),
    faq: s.faq.map((item, i) => ({
      question: t(`${b}.faq.${i}.q`, item.question),
      answer: t(`${b}.faq.${i}.a`, item.answer),
    })),
    highlights: s.highlights?.map((h, i) => t(`${b}.hl.${i}`, h)),
  };
}

export function localizeServices(list: Service[], t: T): Service[] {
  return list.map((s) => localizeService(s, t));
}

/** Overlay translated text fields onto an insight; falls back to the source data per-field. */
export function localizeInsight(i: Insight, t: T): Insight {
  const b = `insData.${i.slug}`;
  return {
    ...i,
    title: t(`${b}.title`, i.title),
    excerpt: t(`${b}.excerpt`, i.excerpt),
    category: (t(`insCat.${i.category}`, i.category) ?? i.category) as Insight["category"],
    content: i.content.map((p, idx) => t(`${b}.c.${idx}`, p)),
  };
}

export function localizeInsights(list: Insight[], t: T): Insight[] {
  return list.map((i) => localizeInsight(i, t));
}
