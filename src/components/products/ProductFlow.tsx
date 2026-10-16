import type { CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { ProductPage } from "@/data/products";

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_DELAY = 0.16;

// The thread draws in once and the stages follow it in order, so the chain reads left to right.
const lineX: Variants = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.4, ease: EASE } } };
const lineY: Variants = { hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 1.4, ease: EASE } } };
const step = (i: number): Variants => ({
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.15 + i * STEP_DELAY, ease: EASE } },
});

/** The product's data flow as a chain of stages joined by one thread, as many stages as the product really has. */
export default function ProductFlow({ flow }: { flow: ProductPage["flow"] }) {
  const { lang, t } = useLanguage();
  const columns = flow.steps.length;

  return (
    <section className="border-y border-line bg-white py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={t("prod.flow.eyebrow")} title={flow.title[lang]} />
          </div>
          <p className="text-base leading-relaxed text-muted md:text-lg lg:col-span-5 lg:self-end">{flow.description[lang]}</p>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative">
          {/* desktop: one horizontal thread from the first node's centre to the last */}
          <div
            className="absolute left-6 top-6 hidden h-px bg-line lg:block"
            style={{ right: `calc((100% - ${columns - 1}rem) / ${columns} - 1.5rem)` }}
            aria-hidden="true"
          >
            <motion.div variants={lineX} className="h-full origin-left bg-ink/40" />
          </div>
          {/* mobile: the same thread, vertical */}
          <div className="absolute bottom-6 left-6 top-6 w-px bg-line lg:hidden" aria-hidden="true">
            <motion.div variants={lineY} className="h-full w-full origin-top bg-ink/40" />
          </div>

          <ol
            className="relative grid gap-8 lg:gap-4 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            style={{ "--cols": columns } as CSSProperties}
          >
            {flow.steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li key={s.name.en} variants={step(i)} className="relative flex gap-5 lg:flex-col lg:gap-5">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-pro bg-white ring-1 ring-ink/15">
                    <Icon className="h-5 w-5 text-ink" aria-hidden="true" />
                  </span>
                  <div className="pt-0.5 lg:pt-0 lg:pr-2">
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-1 font-display text-[17px] font-bold leading-snug">{s.name[lang]}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.detail[lang]}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      </Container>
    </section>
  );
}
