import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * What a photogrammetry flight hands the project team. Sits on the
 * photogrammetry project page under the scope list, so it names the
 * deliverables rather than repeating the processing steps.
 */
export default function PhotogrammetryShowcase() {
  const { t } = useLanguage();
  const outputs = [0, 1, 2, 3].map((i) => ({ title: t(`photo.out.${i}.t`), desc: t(`photo.out.${i}.d`) }));
  return (
    <Section tone="dark">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow={t("photo.eyebrow")} title={t("photo.title")} tone="dark" />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {outputs.map((o) => (
            <motion.li key={o.title} variants={staggerItem} className="flex flex-col gap-2 border-t border-white/20 pt-5">
              <h3 className="font-semibold text-white">{o.title}</h3>
              <p className="text-sm leading-relaxed text-white/65">{o.desc}</p>
            </motion.li>
          ))}
        </motion.ul>

        <LinkArrow to="/contact" className="w-fit text-white">
          {t("photo.cta")}
        </LinkArrow>
      </Container>
    </Section>
  );
}
