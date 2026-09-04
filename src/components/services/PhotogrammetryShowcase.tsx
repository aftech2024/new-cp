import { motion } from "framer-motion";
import { Plane, Cog, Map, Boxes, Mountain, FileBarChart } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import droneImage from "@/assets/images/drone-photogrammetry.jpg";

const pipeline = [
  { icon: Plane, code: "P.01", label: "Flight & Capture" },
  { icon: Cog, code: "P.02", label: "Structure from Motion" },
  { icon: Boxes, code: "P.03", label: "Point Cloud 3D" },
  { icon: Map, code: "P.04", label: "Orthomosaic" },
  { icon: Mountain, code: "P.05", label: "DSM / DTM" },
  { icon: FileBarChart, code: "P.06", label: "Volume Report" },
];

const outputs = [
  {
    title: "Orthomosaic Map",
    desc: "A distortion-free aerial map of the entire site — measure distances and areas directly.",
  },
  {
    title: "Point Cloud 3D",
    desc: "Millions of geo-referenced points for elevation, structures, and as-built checks.",
  },
  {
    title: "DSM / DTM",
    desc: "Surface and terrain models that reveal cut, fill, and drainage behavior.",
  },
  {
    title: "Cut-Fill & Progress Report",
    desc: "Earthwork volumes and period-to-period change, ready for site meetings.",
  },
];

/**
 * Flagship showcase — drone photogrammetry processing pipeline,
 * from flight to site intelligence the project team can act on.
 */
export default function PhotogrammetryShowcase() {
  return (
    <Section tone="dark" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-dark opacity-60" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            index="F.01"
            eyebrow="Flagship — Drone Photogrammetry"
            title="From flight to site intelligence."
            description="We fly the site and turn overlapping aerial photos into terrain models, maps, and volume reports the project team can act on the same day."
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
              alt="Drone photogrammetry — from aerial capture to 3D terrain model"
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>

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
          Request a demo flight
        </LinkArrow>
      </Container>
    </Section>
  );
}
