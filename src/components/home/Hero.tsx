import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";
import heroBg from "@/assets/images/home-hero-bg.jpg";
import { HALORA_URL } from "@/data/company";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-deep-navy pt-28 pb-20 text-white">
      {/* real photography leads — single restrained overlay */}
      <img src={heroBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/70 to-deep-navy/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep-navy via-deep-navy/35 to-transparent" />

      <Container className="relative">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex max-w-2xl flex-col gap-6">
          <p className="flex items-center gap-3">
            <span className="h-px w-10 bg-aftech-bright" aria-hidden="true" />
            <span className="spec-label text-white/55">PT Aftech Daya Solusindo</span>
          </p>

          <h1 className="font-display font-medium leading-[1.04] tracking-[-0.01em] text-[clamp(40px,5.2vw,76px)]">
            We build the digital and physical world.
          </h1>

          <p className="max-w-xl text-base md:text-lg leading-relaxed text-white/65">
            Aftech is an IT-first engineering company — software, infrastructure and building
            systems. Civil construction and interior work are delivered by our second company,{" "}
            <a href={HALORA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Halora</a>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button to="/projects">Explore Our Work</Button>
            <Button to="/contact" variant="ghost-light">
              Start a Project
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
