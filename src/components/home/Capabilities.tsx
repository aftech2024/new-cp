import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { capabilityMatrix, HALORA_URL } from "@/data/company";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

const groupKey: Record<string, string> = {
  Technology: "cap.g.technology",
  Engineering: "cap.g.engineering",
  Construction: "cap.g.construction",
  Space: "cap.g.space",
};

const itemKey: Record<string, string> = {
  Software: "terms.software",
  AI: "terms.ai",
  Infrastructure: "terms.infrastructure",
  Cloud: "terms.cloud",
  Network: "terms.network",
  Cybersecurity: "terms.cybersecurity",
  Mechanical: "terms.mechanical",
  Electrical: "terms.electrical",
  HVAC: "terms.hvac",
  Plumbing: "terms.plumbing",
  "Fire Protection": "terms.fireProtection",
  Civil: "terms.civil",
  Warehouse: "terms.warehouse",
  Renovation: "terms.renovation",
  Interior: "terms.interior",
  "Fit-Out": "terms.fitout",
  Furniture: "terms.furniture",
};

export default function Capabilities() {
  const { t } = useLanguage();
  return (
    <Section tone="navy" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-dark opacity-60" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="05"
            eyebrow={t("cap.eyebrow")}
            title={t("cap.title")}
            description={t("cap.desc")}
            tone="dark"
            brand="aftech"
          />
          <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.16em]">
            <span className="flex items-center gap-1.5 text-white/60"><span className="h-2 w-2 rounded-sm bg-aftech-bright" /> AFTECH</span>
            <span className="flex items-center gap-1.5 text-white/60"><span className="h-2 w-2 rounded-sm bg-halora-bronze" /> HALORA</span>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-pro border border-white/12 bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {capabilityMatrix.map((group, gi) => {
            const isHalora = group.company === "Halora";
            return (
              <motion.div
                key={group.group}
                variants={staggerItem}
                className={`flex flex-col ${isHalora ? "bg-deep-navy/95" : "bg-deep-navy/95"}`}
              >
                <div className={`flex items-center justify-between border-b px-5 py-4 ${isHalora ? "border-halora-bronze/25" : "border-white/10"}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`font-mono text-[11px] font-bold ${isHalora ? "text-halora-bronze" : "text-aftech-bright"}`}>
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
                      {t(groupKey[group.group] ?? group.group, group.group)}
                    </h3>
                  </div>
                  {isHalora ? (
                    <a
                      href={HALORA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-halora-bronze px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white hover:brightness-110 transition"
                    >
                      Halora ↗
                    </a>
                  ) : (
                    <span className="rounded bg-aftech px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                      Aftech
                    </span>
                  )}
                </div>
                <ul className="flex flex-1 flex-col">
                  {group.items.map((item, ii) => (
                    <li
                      key={item}
                      className={`flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3 text-sm last:border-0 ${isHalora ? "text-white/70" : "text-white/70"}`}
                    >
                      {t(itemKey[item] ?? item, item)}
                      <span className={`font-mono text-[10px] ${isHalora ? "text-white/40" : "text-white/25"}`}>
                        {String(ii + 1).padStart(2, "0")}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className={`h-1 ${isHalora ? "bg-halora-bronze" : "bg-gradient-to-r from-aftech to-aftech-bright"}`} aria-hidden="true" />
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
