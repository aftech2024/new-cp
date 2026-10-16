import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

// The layers a project passes through, from digital to built space. Aftech
// owns the first six; Halora builds the last, after one handover.
const LAYERS = ["ai", "software", "data", "network", "building", "engineering", "space"] as const;
const AFTECH_LAYERS = LAYERS.length - 1;

/**
 * The delivery chain as a cross-section, read left to right. Brackets above
 * the columns work like dimension lines on a drawing: they say who is
 * responsible for which span, and the bronze rule marks the handover.
 */
export default function DigitalToPhysical() {
  const { t } = useLanguage();

  return (
    <Section tone="light">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading index="02" eyebrow={t("d2p.eyebrow")} title={t("d2p.title")} brand="aftech" />
          </div>
          <p className="text-base leading-relaxed text-muted md:text-lg lg:col-span-5 lg:self-end">{t("d2p.desc")}</p>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {/* who owns which span, drawn as dimension lines (desktop) */}
          <div
            className="mb-6 hidden lg:grid lg:[grid-template-columns:repeat(var(--aftech),minmax(0,1fr))_minmax(0,1.25fr)]"
            style={{ "--aftech": AFTECH_LAYERS } as CSSProperties}
            aria-hidden="true"
          >
            <span className="flex flex-col gap-2 pr-4" style={{ gridColumn: `span ${AFTECH_LAYERS}` }}>
              <span className="text-sm font-semibold text-aftech-strong">{t("d2p.groupAftech")}</span>
              <span className="h-2 border-x border-t border-aftech" />
            </span>
            <span className="flex flex-col gap-2 pl-4">
              <span className="text-sm font-semibold text-halora-deep">{t("d2p.groupHalora")}</span>
              <span className="h-2 border-x border-t border-halora-bronze" />
            </span>
          </div>

          <ol
            className="grid border-y border-ink/15 lg:[grid-template-columns:repeat(var(--aftech),minmax(0,1fr))_minmax(0,1.25fr)]"
            style={{ "--aftech": AFTECH_LAYERS } as CSSProperties}
          >
            {LAYERS.map((layer, i) => {
              const halora = i === AFTECH_LAYERS;
              return (
                <motion.li
                  key={layer}
                  variants={staggerItem}
                  className={`relative flex gap-4 py-5 lg:flex-col lg:gap-3 lg:px-4 lg:py-7 ${
                    i > 0 ? "border-t border-line lg:border-l lg:border-t-0" : ""
                  } ${halora ? "bg-halora-linen lg:border-l-2 lg:border-l-halora-bronze" : ""} ${i === 0 ? "lg:pl-0" : ""}`}
                >
                  {halora && (
                    <span className="absolute -top-px left-0 right-0 h-0.5 bg-halora-bronze lg:hidden" aria-hidden="true" />
                  )}
                  <span className={`w-6 shrink-0 font-mono text-xs ${halora ? "text-halora-deep" : "text-muted"} ${halora ? "pl-3 lg:pl-0" : ""}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1.5 pr-3 lg:pr-0">
                    {halora && <span className="text-xs font-semibold text-halora-deep">{t("d2p.handoff")}</span>}
                    <span className="font-display text-lg font-bold leading-snug text-ink">{t(`d2p.l.${layer}.t`)}</span>
                    <span className="text-sm leading-relaxed text-muted">{t(`d2p.l.${layer}.d`)}</span>
                    <span className={`text-xs font-semibold lg:hidden ${halora ? "text-halora-deep" : "text-aftech-strong"}`}>
                      {halora ? "Halora" : "Aftech"}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      </Container>
    </Section>
  );
}
