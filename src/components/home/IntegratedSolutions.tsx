import { motion } from "framer-motion";
import { Building2, DraftingCompass, ServerCog } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

const solutionKeys = [
  { no: "S.01", icon: Building2, titleKey: "svcData.integrated-solutions.cap.0", problemKey: "int.s1.problem", ownerKey: "int.s1.owner", parts: ["IT", "Network", "Security", "Electrical", "BMS"], warm: false },
  { no: "S.02", icon: DraftingCompass, titleKey: "svcData.integrated-solutions.cap.1", problemKey: "int.s2.problem", ownerKey: "int.s2.owner", parts: ["Drone Survey", "Data", "PM", "Engineering", "Civil"], warm: true },
  { no: "S.03", icon: ServerCog, titleKey: "svcData.integrated-solutions.cap.2", problemKey: "int.s3.problem", ownerKey: "int.s3.owner", parts: ["Server", "Network", "Cloud", "Security", "Monitoring"], warm: false },
] as const;

export default function IntegratedSolutions() {
  const { t } = useLanguage();
  const solutions = solutionKeys.map((s) => ({
    ...s,
    title: t(s.titleKey),
    problem: t(s.problemKey),
    owner: t(s.ownerKey),
  }));
  return (
    <Section tone="tint" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-light opacity-60" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            index="04"
            eyebrow={t("int.eyebrow")}
            title={t("int.title")}
            description={t("int.desc")}
            brand="aftech"
          />
          <LinkArrow to="/services/integrated-solutions">{t("int.link")}</LinkArrow>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {solutions.map((s) => (
            <motion.article
              key={s.title}
              variants={staggerItem}
              className={`flex flex-col rounded-pro border bg-white shadow-pro transition-shadow hover:shadow-card ${s.warm ? "border-halora-bronze/35" : "border-line"}`}
            >
              <div className={`flex items-center justify-between border-b px-6 py-3.5 ${s.warm ? "border-halora-bronze/25 bg-halora-linen" : "border-line bg-off-white"}`}>
                <span className={`spec-label ${s.warm ? "text-halora-bronze" : "text-aftech"}`}>{s.no}</span>
                <s.icon className={`h-4 w-4 ${s.warm ? "text-halora-bronze" : "text-aftech"}`} />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.problem}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
                  {s.parts.map((part, i) => (
                    <span key={part} className="flex items-center gap-1.5">
                      {i > 0 && <span className={`text-xs font-bold ${s.warm ? "text-halora-bronze" : "text-aftech"}`}>+</span>}
                      <span className={`rounded border px-2 py-1 font-mono text-[11px] font-medium ${s.warm ? "border-halora-bronze/30 bg-halora-linen text-halora-bronze" : "border-aftech/25 bg-aftech-ice text-aftech"}`}>
                        {part}
                      </span>
                    </span>
                  ))}
                </div>
                <p className={`mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.16em] ${s.warm ? "text-halora-bronze" : "text-aftech"}`}>
                  {s.owner}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
