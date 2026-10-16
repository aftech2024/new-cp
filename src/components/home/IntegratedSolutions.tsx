import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

const solutionKeys = [
  { titleKey: "svcData.integrated-solutions.cap.0", problemKey: "int.s1.problem", ownerKey: "int.s1.owner", parts: ["IT", "Network", "Security", "Electrical", "BMS"], halora: false },
  { titleKey: "svcData.integrated-solutions.cap.1", problemKey: "int.s2.problem", ownerKey: "int.s2.owner", parts: ["Drone Survey", "Data", "PM", "Engineering", "Civil"], halora: true },
  { titleKey: "svcData.integrated-solutions.cap.2", problemKey: "int.s3.problem", ownerKey: "int.s3.owner", parts: ["Server", "Network", "Cloud", "Security", "Monitoring"], halora: false },
] as const;

/**
 * Three programs as a schedule: each row reads problem, what is combined, who
 * leads. Rows that involve Halora carry its bronze in the "who leads" cell.
 */
export default function IntegratedSolutions() {
  const { t } = useLanguage();

  return (
    <Section tone="tint">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="04" eyebrow={t("int.eyebrow")} title={t("int.title")} description={t("int.desc")} brand="aftech" />
          <LinkArrow to="/services/integrated-solutions" className="shrink-0 text-ink">
            {t("int.link")}
          </LinkArrow>
        </div>

        <div>
          <div className="hidden grid-cols-12 gap-8 border-b border-ink pb-3 text-sm font-semibold text-muted lg:grid">
            <span className="col-span-4" aria-hidden="true" />
            <span className="col-span-3">{t("int.col.problem")}</span>
            <span className="col-span-3">{t("int.col.parts")}</span>
            <span className="col-span-2">{t("int.col.owner")}</span>
          </div>
          <motion.ol variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            {solutionKeys.map((s, i) => (
              <motion.li
                key={s.titleKey}
                variants={staggerItem}
                className="grid gap-3 border-b border-ink/15 py-7 lg:grid-cols-12 lg:gap-8"
              >
                <h3 className="flex gap-4 font-display text-2xl font-bold leading-tight lg:col-span-4">
                  <span className="pt-2 font-mono text-xs font-normal text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {t(s.titleKey)}
                </h3>
                <p className="pl-8 text-ink/80 lg:col-span-3 lg:pl-0">
                  <span className="mb-1 block text-xs font-semibold text-muted lg:hidden">{t("int.col.problem")}</span>
                  {t(s.problemKey)}
                </p>
                <p className="pl-8 text-ink/80 lg:col-span-3 lg:pl-0">
                  <span className="mb-1 block text-xs font-semibold text-muted lg:hidden">{t("int.col.parts")}</span>
                  {s.parts.join(" + ")}
                </p>
                <p className="pl-8 text-sm font-semibold text-ink lg:col-span-2 lg:pl-0 lg:pt-0.5">
                  <span className="mb-1 block text-xs font-semibold text-muted lg:hidden">{t("int.col.owner")}</span>
                  <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-[2px] align-baseline ${s.halora ? "bg-halora-bronze" : "bg-aftech"}`} aria-hidden="true" />
                  {t(s.ownerKey)}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Container>
    </Section>
  );
}
