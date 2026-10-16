import type { CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { ProductPage } from "@/data/products";

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_DELAY = 0.22;

const lineX: Variants = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.8, ease: EASE } } };
const lineY: Variants = { hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 1.8, ease: EASE } } };
const step = (i: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 + i * STEP_DELAY, ease: EASE } },
});

/** The product's data flow as a chain that lights up stage by stage when it scrolls into view. */
export default function ProductFlow({ flow }: { flow: ProductPage["flow"] }) {
  const { lang, t } = useLanguage();
  const columns = flow.steps.length;

  return (
    <Section tone="dark" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-dark" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--accent)/0.08)] blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative flex flex-col gap-16">
        <SectionHeading eyebrow={t("prod.flow.eyebrow")} title={flow.title[lang]} description={flow.description[lang]} tone="dark" />

        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative">
          {/* desktop: horizontal thread from the first node's centre to the last */}
          <div
            className="absolute left-7 top-7 hidden h-px bg-white/10 lg:block"
            style={{ right: `calc((100% - ${columns - 1}rem) / ${columns} - 1.75rem)` }}
            aria-hidden="true"
          >
            <motion.div variants={lineX} className="h-full origin-left bg-gradient-to-r from-[rgb(var(--accent))] to-aftech-bright" />
            <span className="edge-dot absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_3px_rgb(var(--accent))]" />
          </div>
          {/* mobile: vertical thread */}
          <div className="absolute bottom-7 left-7 top-7 w-px bg-white/10 lg:hidden" aria-hidden="true">
            <motion.div variants={lineY} className="h-full w-full origin-top bg-gradient-to-b from-[rgb(var(--accent))] to-aftech-bright" />
          </div>

          <ol
            className="relative grid gap-9 lg:gap-4 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            style={{ "--cols": columns } as CSSProperties}
          >
            {flow.steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li key={s.name.en} variants={step(i)} className="relative flex gap-5 lg:flex-col lg:gap-4">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-deep-navy shadow-[0_0_32px_-6px_rgb(var(--accent)/0.7)] ring-1 ring-[rgb(var(--accent)/0.55)]">
                    <Icon className="h-6 w-6 text-[rgb(var(--accent))]" aria-hidden="true" />
                  </span>
                  <div className="pt-1 lg:pt-0">
                    <span className="font-mono text-[11px] tracking-[0.18em] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-1 font-display text-lg font-bold">{s.name[lang]}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">{s.detail[lang]}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      </Container>
    </Section>
  );
}
