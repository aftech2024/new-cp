import type { Insight } from "@/types";

export const insights: Insight[] = [
  {
    id: "i1",
    slug: "ai-for-business",
    title: "AI for Business: Where to Start",
    excerpt: "Practical entry points for organizations exploring AI adoption without overhauling existing systems.",
    category: "Technology",
    date: "2026-01-15",
    content: [
      "Adopting AI does not require replacing existing systems overnight. Most organizations get the most value by starting with a narrow, well-defined use case — document processing, support triage, or reporting automation — and expanding from there.",
      "The technical work matters less than the integration work: connecting AI capability to real data and real workflows is usually the harder problem.",
    ],
  },
  {
    id: "i2",
    slug: "digital-transformation-roadmap",
    title: "Building a Digital Transformation Roadmap",
    excerpt: "A phased approach to modernizing IT infrastructure without disrupting daily operations.",
    category: "Technology",
    date: "2026-01-22",
    content: [
      "A transformation roadmap should sequence changes by risk and dependency, not by ambition. Infrastructure and network foundations typically need to be stable before applications and automation layers are added.",
      "Phasing also protects continuity — teams can keep operating while the underlying systems evolve.",
    ],
  },
  {
    id: "i3",
    slug: "smart-building-basics",
    title: "What Makes a Building 'Smart'",
    excerpt: "Smart building capability is less about gadgets and more about how systems talk to each other.",
    category: "Engineering",
    date: "2026-02-03",
    content: [
      "A smart building connects electrical, network, security and HVAC systems so they can be monitored and controlled together, rather than as isolated systems managed by separate teams.",
      "The payoff is operational: faster fault detection, lower energy waste, and better data for facility decisions.",
    ],
  },
  {
    id: "i4",
    slug: "cost-control-construction-projects",
    title: "Cost Control on Construction Projects",
    excerpt: "Where budgets typically slip on construction and civil works, and how disciplined execution prevents it.",
    category: "Construction",
    date: "2026-02-14",
    content: [
      "Most cost overruns trace back to scope changes made without re-costing, or to procurement timelines that weren't aligned with the construction schedule.",
      "Disciplined change control and early procurement planning are unglamorous but effective levers for cost control.",
    ],
  },
];

export function getInsightBySlug(slug: string) {
  return insights.find((i) => i.slug === slug);
}
