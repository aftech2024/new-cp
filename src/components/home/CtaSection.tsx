import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { AftechMark, HaloraMark } from "@/components/ui/CompanyMark";
import { HALORA_URL } from "@/data/company";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * The closing step on most pages: one question, two tracks. The tracks are
 * split by a single rule rather than boxed, and each is coloured by the
 * company that takes the work.
 */
export default function CtaSection() {
  const { t } = useLanguage();
  const tracks = [
    {
      mark: <AftechMark className="h-5 w-auto" />,
      label: t("cta.aftechTrack"),
      title: t("cta.aftechTitle"),
      desc: t("cta.aftechDesc"),
      button: <Button to="/contact">{t("cta.aftechBtn")}</Button>,
      rule: "border-aftech-bright",
    },
    {
      mark: <HaloraMark className="h-5 w-5" />,
      label: t("cta.haloraTrack"),
      title: t("cta.haloraTitle"),
      desc: t("cta.haloraDesc"),
      button: (
        <Button href={HALORA_URL} variant="halora">
          {t("cta.haloraBtn")}
        </Button>
      ),
      rule: "border-halora-bronze",
    },
  ];

  return (
    <section className="bg-deep-navy py-24 text-white md:py-32">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col gap-5 lg:col-span-5">
          <span className="flex items-center gap-3">
            <span className="h-px w-8 bg-aftech-bright" aria-hidden="true" />
            <span className="text-sm font-semibold text-white/70">{t("cta.eyebrow")}</span>
          </span>
          <h2 className="font-display font-extrabold leading-[1.03] tracking-[-0.02em] text-[clamp(30px,4vw,52px)]">{t("cta.title")}</h2>
          <p className="max-w-md text-base leading-relaxed text-white/70 md:text-lg">{t("cta.desc")}</p>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-10 sm:grid-cols-2 sm:gap-0 lg:col-span-7 lg:self-end"
        >
          {tracks.map((track, i) => (
            <li key={track.title} className={`flex flex-col items-start gap-3 border-t-2 pt-6 ${track.rule} ${i > 0 ? "sm:pl-8" : "sm:pr-8"}`}>
              <span className="flex items-center gap-2 text-sm text-white/70">
                {track.mark} {track.label}
              </span>
              <p className="font-display text-xl font-bold">{track.title}</p>
              <p className="text-sm text-white/65">{track.desc}</p>
              <div className="mt-3">{track.button}</div>
            </li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
