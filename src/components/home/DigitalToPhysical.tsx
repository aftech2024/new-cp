import { motion } from "framer-motion";
import { ArrowDown, ArrowLeftRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

interface Node {
  code: string;
  label: string;
  owner: "aftech" | "halora";
  edgeToNext?: string;
  handoff?: boolean;
}

// Ontology model: Aftech owns digital + engineering layers;
// Halora executes the built-space layer. One handoff edge.
const nodes: Node[] = [
  { code: "D.01", label: "AI", owner: "aftech", edgeToNext: "models" },
  { code: "D.02", label: "SOFTWARE", owner: "aftech", edgeToNext: "runs on" },
  { code: "D.03", label: "DATA", owner: "aftech", edgeToNext: "carries" },
  { code: "D.04", label: "NETWORK", owner: "aftech", edgeToNext: "controls" },
  { code: "E.01", label: "BUILDING SYSTEM", owner: "aftech", edgeToNext: "verified by" },
  { code: "E.02", label: "ENGINEERING", owner: "aftech", edgeToNext: "hand off", handoff: true },
  { code: "P.01", label: "SPACE", owner: "halora" },
];

function NodeCard({ node }: { node: Node }) {
  const isAftech = node.owner === "aftech";
  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-pro border bg-white px-2 py-4 shadow-pro transition-shadow hover:shadow-card ${
        isAftech ? "border-aftech/30" : "border-halora-bronze/40"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isAftech ? "bg-aftech" : "bg-halora-bronze"}`} aria-hidden="true" />
      <span className={`spec-label !text-[10px] ${isAftech ? "text-aftech" : "text-halora-bronze"}`}>{node.code}</span>
      <span className="text-center font-display text-[13px] font-extrabold leading-tight tracking-wide text-ink">
        {node.label}
      </span>
      <span
        className={`rounded px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-white ${
          isAftech ? "bg-aftech" : "bg-halora-bronze"
        }`}
      >
        {isAftech ? "Aftech" : "Halora"}
      </span>
    </div>
  );
}

function Edge({ label, handoff, delay }: { label: string; handoff?: boolean; delay: number }) {
  if (handoff) {
    return (
      <div className="flex w-14 shrink-0 flex-col items-center gap-1" aria-hidden="true">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-halora-bronze">{label}</span>
        <span className="relative h-px w-full bg-halora-bronze/60">
          <span className="edge-dot absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-halora-bronze" style={{ animationDelay: `${delay}s` }} />
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-halora-bronze/50 bg-halora-linen text-halora-bronze">
          <ArrowLeftRight className="h-3 w-3" />
        </span>
      </div>
    );
  }
  return (
    <div className="flex w-8 shrink-0 flex-col items-center gap-1 pt-7" aria-hidden="true">
      <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.08em] text-muted">{label}</span>
      <span className="relative h-px w-full bg-aftech/40">
        <span className="edge-dot absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-aftech" style={{ animationDelay: `${delay}s` }} />
      </span>
    </div>
  );
}

export default function DigitalToPhysical() {
  return (
    <Section tone="light" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-light" aria-hidden="true" />
      <Container className="relative flex flex-col items-center gap-10 text-center">
        <SectionHeading
          align="center"
          index="02"
          eyebrow="Delivery ontology — one graph"
          title="From digital intelligence to physical infrastructure."
          description="Every layer mapped as one connected graph. Aftech owns digital and engineering; Halora executes built space — a single handoff, no gaps."
          brand="aftech"
        />
        <p className="-mt-6 font-mono text-[10px] tracking-[0.2em] text-muted" aria-hidden="true">
          ONTOLOGY://AFTECH.DELIVERY-GRAPH — V1.0
        </p>

        {/* desktop ontology graph */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="hidden w-full max-w-6xl items-stretch lg:flex"
        >
          {nodes.map((node, i) => (
            <motion.div key={node.code} variants={staggerItem} className="flex min-w-0 flex-1 items-stretch">
              <NodeCard node={node} />
              {node.edgeToNext && <Edge label={node.edgeToNext} handoff={node.handoff} delay={i * 0.35} />}
            </motion.div>
          ))}
        </motion.div>

        {/* mobile stack */}
        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex w-full max-w-sm flex-col items-stretch gap-1.5 lg:hidden"
        >
          {nodes.map((s) => {
            const warm = s.owner === "halora";
            return (
              <motion.li key={s.code} variants={staggerItem} className="flex flex-col items-center gap-1.5">
                {s.handoff && (
                  <span className="flex items-center gap-1.5 rounded-full border border-halora-bronze/40 bg-halora-linen px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-halora-bronze">
                    <ArrowLeftRight className="h-3 w-3" /> Handoff to Halora
                  </span>
                )}
                <span className={`flex w-full items-center justify-between rounded-pro border px-4 py-3 ${warm ? "border-halora-bronze/35 bg-halora-linen text-ink" : "border-aftech/25 bg-white text-ink"}`}>
                  <span className="font-display text-sm font-extrabold tracking-wide">{s.label}</span>
                  <span className={`spec-label !text-[10px] ${warm ? "text-halora-bronze" : "text-aftech"}`}>{s.code}</span>
                </span>
                <ArrowDown className={`h-4 w-4 ${warm ? "text-halora-bronze" : "text-aftech"}`} aria-hidden="true" />
              </motion.li>
            );
          })}
        </motion.ol>

        <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] tracking-[0.16em] text-muted">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-aftech" /> AFTECH · DIGITAL + ENGINEERING</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-halora-bronze" /> HALORA · BUILT SPACE</span>
        </div>
      </Container>
    </Section>
  );
}
