import { motion } from "framer-motion";
import { Plane, Cog, Map, Boxes, Mountain, FileBarChart } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import droneImage from "@/assets/images/drone-photogrammetry.jpg";

const pipelineKeys = ["photo.pipe.0", "photo.pipe.1", "photo.pipe.2", "photo.pipe.3", "photo.pipe.4", "photo.pipe.5"];
const pipelineCodes = ["P.01", "P.02", "P.03", "P.04", "P.05", "P.06"];
const pipelineIcons = [Plane, Cog, Boxes, Map, Mountain, FileBarChart];

interface Props {
  /**
   * "lead" opens with its own heading and hero image — for a page that has not
   * introduced photogrammetry yet. "embedded" drops both, for the project
   * detail page whose PageHero already carries the title and description.
   */
  variant?: "lead" | "embedded";
}

/**
 * Drone photogrammetry processing pipeline, from flight to site intelligence
 * the project team can act on.
 */
export default function PhotogrammetryShowcase({ variant = "lead" }: Props) {
  const { t } = useLanguage();
  const pipeline = pipelineKeys.map((key, i) => ({ icon: pipelineIcons[i], code: pipelineCodes[i], label: t(key) }));
  const outputs = [0, 1, 2, 3].map((i) => ({ title: t(`photo.out.${i}.t`), desc: t(`photo.out.${i}.d`) }));
  return (
    <Section tone="dark" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-dark opacity-60" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        {variant === "lead" && (
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <SectionHeading
              index="F.01"
              eyebrow={t("photo.eyebrow")}
              title={t("photo.title")}
              description={t("photo.desc")}
              tone="dark"
              brand="aftech"
            />
            <motion.div
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="overflow-hidden rounded-pro border border-white/12 shadow-card"
            >
              <img
                src={droneImage}
                alt={t("photo.imgAlt")}
                className="aspect-[16/10] w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        )}

        {/* processing pipeline */}
        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-pro border border-white/12 bg-white/10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {pipeline.map((step) => (
            <motion.li
              key={step.code}
              variants={staggerItem}
              className="flex flex-col gap-2.5 bg-deep-navy/95 p-4"
            >
              <step.icon className="h-4 w-4 text-aftech-bright" />
              <span className="spec-label !text-[10px] text-white/35">{step.code}</span>
              <span className="text-sm font-semibold leading-snug text-white">{step.label}</span>
            </motion.li>
          ))}
        </motion.ol>

        {/* deliverables */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {outputs.map((o, i) => (
            <motion.div
              key={o.title}
              variants={staggerItem}
              className="flex flex-col gap-2 rounded-pro border border-white/12 bg-white/[0.04] p-5"
            >
              <span className="font-mono text-[11px] font-bold text-aftech-bright">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-white">{o.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{o.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <LinkArrow to="/contact" className="text-white">
          {t("photo.cta")}
        </LinkArrow>
      </Container>
    </Section>
  );
}
