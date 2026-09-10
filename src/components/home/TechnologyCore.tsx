import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

export default function TechnologyCore() {
  const { t } = useLanguage();
  const capabilities = Array.from({ length: 9 }, (_, i) => ({
    title: t(`tech.c${i}.t`),
    desc: t(`tech.c${i}.d`),
  }));
  return (
    <Section tone="dark">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            index="01"
            eyebrow={t("tech.eyebrow")}
            title={t("tech.title")}
            description={t("tech.desc")}
            tone="dark"
            brand="aftech"
          />
          <LinkArrow to="/services/technology" className="mt-7 text-white">
            {t("tech.explore")}
          </LinkArrow>
        </div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {capabilities.map((c, i) => (
            <motion.li key={c.title} variants={staggerItem}>
              <div className="group flex items-baseline gap-5 border-t border-white/10 py-5 last:border-b">
                <span className="shrink-0 font-mono text-xs text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-white/50">{c.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 self-center text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-aftech-bright" />
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </Section>
  );
}
