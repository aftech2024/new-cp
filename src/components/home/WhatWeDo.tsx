import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageReveal from "@/components/ui/ImageReveal";
import { AftechMark, HaloraMark } from "@/components/ui/CompanyMark";
import { services } from "@/data/services";
import { HALORA_URL } from "@/data/company";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import haloraBg from "@/assets/images/halora-bg.jpg";

export default function WhatWeDo() {
  const coreServices = services.filter((s) => s.slug !== "integrated-solutions");

  return (
    <Section tone="dark" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-dark opacity-70" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="03"
            eyebrow="What we do — two companies"
            title="Two companies. One accountable partner."
            description="Aftech delivers technology and engineering directly. Civil construction and interior work are delivered by our second company, Halora."
            tone="dark"
            brand="aftech"
          />
          <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.16em]">
            <span className="flex items-center gap-1.5 rounded-pro bg-white/5 border border-white/10 px-2.5 py-1.5 text-white/80">
              <AftechMark className="h-4 w-auto" /> AFTECH ×2
            </span>
            <span className="flex items-center gap-1.5 rounded-pro bg-white/5 border border-white/10 px-2.5 py-1.5 text-white/80">
              <HaloraMark className="h-4 w-4" /> HALORA ×1
            </span>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {coreServices.map((service) => (
            <motion.div key={service.slug} variants={staggerItem}>
              <Link
                to={`/services/${service.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-pro border border-white/12 bg-[#0A1F33]/90 transition-all hover:border-aftech-bright/50 hover:shadow-glow"
              >
                <ImageReveal
                  motif={service.slug === "technology" ? "technology" : "me"}
                  ratio="service"
                  label={service.title}
                />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 spec-label text-aftech-bright">
                      <AftechMark className="h-4 w-auto" /> AFTECH / {service.number}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-aftech-bright" />
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{service.shortStatement}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {service.capabilities.slice(0, 3).map((c) => (
                      <span key={c} className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] tracking-wide text-white/55">
                        {c}
                      </span>
                    ))}
                    <span className="rounded border border-aftech/30 bg-aftech/10 px-2 py-1 font-mono text-[10px] tracking-wide text-aftech-bright">
                      +{service.capabilities.length - 3} more
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Halora — warm architectural card */}
          <motion.div variants={staggerItem}>
            <a
              href={HALORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-pro border border-halora-bronze/40 bg-halora-linen text-ink transition-all hover:shadow-[0_16px_48px_-16px_rgba(183,121,31,0.5)]"
            >
              <ImageReveal src={haloraBg} ratio="service" label="Halora — Civil & Interior" />
              <div className="relative flex flex-1 flex-col gap-3 p-6">
                <div className="halora-hatch pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
                <div className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HaloraMark className="h-5 w-5" />
                    <span className="spec-label text-halora-bronze">HALORA / 03</span>
                    <span className="rounded-full bg-halora-bronze px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                      Second company
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-halora-bronze transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="relative font-display text-xl font-extrabold">Civil & Interior</h3>
                <p className="relative text-sm leading-relaxed text-ink/70">
                  Building construction, renovation, office and commercial interiors — everything outside IT, delivered by Halora.
                </p>
                <div className="relative mt-auto flex flex-wrap gap-1.5 pt-2">
                  {["Civil", "Warehouse", "Fit-Out", "Furniture"].map((c) => (
                    <span key={c} className="rounded border border-halora-bronze/30 bg-white px-2 py-1 font-mono text-[10px] tracking-wide text-ink/70">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
