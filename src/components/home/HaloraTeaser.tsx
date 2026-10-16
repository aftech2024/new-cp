import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { HaloraMark } from "@/components/ui/CompanyMark";
import { HALORA_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const haloraServiceKeys = [
  { titleKey: "hal.civ.title", descKey: "hal.civ.desc", tagKeys: ["terms.building", "terms.warehouse", "terms.renovation", "terms.structure"] },
  { titleKey: "hal.int.title", descKey: "hal.int.desc", tagKeys: ["terms.office", "terms.commercial", "terms.fitout", "terms.furniture"] },
];

/**
 * Halora, the second company, in its own linen and bronze so it never reads
 * as an Aftech service. Its two practices are columns under one rule, and
 * every link here leaves for Halora's site, so each carries ↗.
 */
export default function HaloraTeaser() {
  const { t } = useLanguage();

  return (
    <Section tone="halora">
      <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-12">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col gap-6 lg:col-span-5">
          <span className="flex items-center gap-3">
            <span className="h-px w-8 bg-halora-bronze" aria-hidden="true" />
            <span className="text-sm font-semibold text-ink/70">{t("hal.eyebrow")}</span>
          </span>
          <div className="flex items-center gap-3">
            <HaloraMark className="h-12 w-12" />
            <p className="font-display text-2xl font-extrabold tracking-tight text-ink">Halora</p>
          </div>
          <h2 className="font-display font-extrabold leading-[1.04] tracking-[-0.02em] text-[clamp(28px,3.2vw,44px)] text-ink">
            {t("hal.titleA")}
            <em className="font-medium">{t("hal.titleB")}</em>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/75 md:text-lg">{t("hal.desc")}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button href={HALORA_URL} variant="halora">
              {t("hal.visit")}
            </Button>
            <Button to="/contact" variant="halora-outline">
              {t("hal.discuss")}
            </Button>
          </div>
        </motion.div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-0 lg:col-span-7"
        >
          {haloraServiceKeys.map((s, i) => (
            <motion.li key={s.titleKey} variants={staggerItem} className={`flex flex-col gap-3 border-t-2 border-halora-bronze pt-6 ${i > 0 ? "sm:pl-8" : "sm:pr-8"}`}>
              <span className="font-mono text-xs text-ink/60">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-xl font-bold text-ink">{t(s.titleKey)}</h3>
              <p className="leading-relaxed text-ink/75">{t(s.descKey)}</p>
              <p className="text-sm text-ink/70">{s.tagKeys.map((k) => t(k)).join(" · ")}</p>
              <a
                href={HALORA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-pro text-sm font-semibold text-ink underline decoration-halora-bronze decoration-2 underline-offset-4 hover:text-halora-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halora-bronze"
              >
                {t("hal.open")}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">: {t(s.titleKey)}</span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </Section>
  );
}
