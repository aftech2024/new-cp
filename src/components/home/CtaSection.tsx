import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { AftechMark, HaloraMark } from "@/components/ui/CompanyMark";
import { HALORA_URL } from "@/data/company";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

export default function CtaSection() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-deep-navy py-24 md:py-32 text-white">
      <div className="pointer-events-none absolute inset-0 blueprint-dark" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-aftech/20 blur-3xl" aria-hidden="true" />
      <Container className="relative flex flex-col items-center gap-10 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col items-center gap-5">
          <span className="spec-label text-aftech-bright">{t("cta.eyebrow")}</span>
          <h2 className="font-display font-extrabold leading-[1.03] tracking-[-0.02em] text-[clamp(32px,5vw,64px)] max-w-3xl">
            {t("cta.title")}
          </h2>
          <p className="max-w-xl text-base md:text-lg text-white/60 leading-relaxed">
            {t("cta.desc")}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="flex flex-col items-start gap-3 rounded-pro border border-aftech/40 bg-aftech/[0.08] p-6 text-left">
            <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-aftech-bright">
              <AftechMark className="h-5 w-auto" /> {t("cta.aftechTrack")}
            </span>
            <p className="font-display text-lg font-bold">{t("cta.aftechTitle")}</p>
            <p className="text-sm text-white/55">{t("cta.aftechDesc")}</p>
            <Button to="/contact" className="mt-1 w-full">{t("cta.aftechBtn")}</Button>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-pro border border-halora-bronze/40 bg-halora-bronze/[0.08] p-6 text-left">
            <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-white/75">
              <HaloraMark className="h-5 w-5" /> {t("cta.haloraTrack")}
            </span>
            <p className="font-display text-lg font-bold">{t("cta.haloraTitle")}</p>
            <p className="text-sm text-white/55">{t("cta.haloraDesc")}</p>
            <Button href={HALORA_URL} variant="halora" className="mt-1 w-full">
              {t("cta.haloraBtn")}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
