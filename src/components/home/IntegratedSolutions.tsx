import { motion } from "framer-motion";
import { Building2, DraftingCompass, ServerCog } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const solutions = [
  {
    no: "S.01",
    icon: Building2,
    title: "Smart Building",
    problem: "IT, security and building systems procured separately.",
    parts: ["IT", "Network", "Security", "Electrical", "BMS"],
    owner: "Aftech lead · Halora support",
    warm: false,
  },
  {
    no: "S.02",
    icon: DraftingCompass,
    title: "Digital Construction",
    problem: "Site progress invisible to management.",
    parts: ["Drone Survey", "Data", "PM", "Engineering", "Civil"],
    owner: "Aftech + Halora joint",
    warm: true,
  },
  {
    no: "S.03",
    icon: ServerCog,
    title: "Enterprise Infrastructure",
    problem: "Fragmented servers, network and security.",
    parts: ["Server", "Network", "Cloud", "Security", "Monitoring"],
    owner: "Aftech lead",
    warm: false,
  },
];

export default function IntegratedSolutions() {
  return (
    <Section tone="tint" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-light opacity-60" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            index="04"
            eyebrow="Integrated solutions"
            title="One partner. Multiple capabilities."
            description="Programs that combine Aftech technology with Halora construction — scoped once, managed once, handed over once."
            brand="aftech"
          />
          <LinkArrow to="/services/integrated-solutions">See Integrated Solutions</LinkArrow>
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
