import { motion } from "framer-motion";
import { Building2, Sofa, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { HaloraMark } from "@/components/ui/CompanyMark";
import { HALORA_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const haloraServiceKeys = [
  { icon: Building2, code: "H.CIV", titleKey: "hal.civ.title", descKey: "hal.civ.desc", tagKeys: ["terms.building", "terms.warehouse", "terms.renovation", "terms.structure"] },
  { icon: Sofa, code: "H.INT", titleKey: "hal.int.title", descKey: "hal.int.desc", tagKeys: ["terms.office", "terms.commercial", "terms.fitout", "terms.furniture"] },
];

export default function HaloraTeaser() {
  const { t } = useLanguage();
  const haloraServices = haloraServiceKeys.map((s) => ({
    ...s,
    title: t(s.titleKey),
    desc: t(s.descKey),
    tags: s.tagKeys.map((k) => t(k)),
  }));
  return (
    <Section tone="halora" className="overflow-hidden">
      {/* architectural drawing backdrop */}
      <div className="pointer-events-none absolute inset-0 halora-drawing" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-halora-bronze/10 blur-3xl" aria-hidden="true" />
      <Container className="relative">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.95fr_1.1fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <span className="flex items-center gap-3">
              <span className="h-px w-8 bg-halora-bronze" aria-hidden="true" />
              <span className="spec-label text-halora-bronze">{t("hal.eyebrow")}</span>
            </span>
            <div className="flex items-center gap-3">
              <HaloraMark className="h-14 w-14" />
              <div>
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink">HALORA</p>
                <p className="font-mono text-[10px] tracking-[0.22em] text-halora-bronze">{t("hal.tag")}</p>
              </div>
            </div>
            <h2 className="font-display font-extrabold leading-[1.04] tracking-[-0.02em] text-[clamp(30px,3.6vw,50px)] text-ink">
              {t("hal.titleA")}<em className="font-medium">{t("hal.titleB")}</em>
            </h2>
            <p className="max-w-md text-base md:text-lg leading-relaxed text-ink/70">
              {t("hal.desc")}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button href={HALORA_URL} variant="halora">
                {t("hal.visit")}
              </Button>
              <Button to="/contact" variant="halora-outline">
                {t("hal.discuss")}
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-4 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
              <span>DWG — HLR/2026</span>
              <span className="h-3 w-px bg-line" />
              <span>Scale — As built</span>
              <span className="hidden sm:inline h-3 w-px bg-line" />
              <span className="hidden sm:inline">Sheet — 06</span>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {haloraServices.map((s) => (
              <motion.a
                key={s.title}
                variants={staggerItem}
                href={HALORA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col gap-4 overflow-hidden rounded-pro border border-line bg-white p-6 shadow-pro transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="halora-hatch pointer-events-none absolute inset-x-0 top-0 h-14 opacity-60" aria-hidden="true" />
                <div className="relative flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-pro bg-deep-navy text-halora-bronze">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="spec-label text-halora-bronze">{s.code}</span>
                </div>
                <h3 className="relative font-display text-lg font-extrabold text-ink">{s.title}</h3>
                <p className="relative text-sm leading-relaxed text-ink/65">{s.desc}</p>
                <div className="relative mt-auto flex flex-wrap gap-1.5 pt-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded border border-line bg-halora-linen px-2 py-1 font-mono text-[10px] tracking-wide text-ink/70">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="relative inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-halora-bronze">
                  {t("hal.open")} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                {/* drawing corner */}
                <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-halora-bronze/50" aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
