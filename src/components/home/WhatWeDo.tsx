import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { AftechMark, HaloraMark } from "@/components/ui/CompanyMark";
import { services } from "@/data/services";
import { HALORA_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeServices } from "@/i18n/localize";
import { clipReveal, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import haloraBg from "@/assets/images/halora-bg.jpg";

const haloraTagKeys = ["terms.civil", "terms.warehouse", "terms.fitout", "terms.furniture"];

/**
 * A photo that wipes in once; the card around it carries the company, so the
 * photo carries no label. The frame is what gets watched for visibility and
 * the image inside it is what gets clipped: a target clipped to zero height
 * never reads as in view on narrow screens, so the wipe would not start.
 */
function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} className="aspect-[4/3] overflow-hidden">
      <motion.img
        variants={clipReveal}
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
      />
    </motion.div>
  );
}

/**
 * The three practices, photographed. Aftech's two sit on navy, Halora's on
 * its linen, so the company split reads from the colour alone; the Halora
 * card is the only one that leaves the site, hence its ↗.
 */
export default function WhatWeDo() {
  const { t } = useLanguage();
  const coreServices = localizeServices(services, t).filter((s) => s.slug !== "integrated-solutions");

  return (
    <Section tone="dark">
      <Container className="flex flex-col gap-12">
        <SectionHeading index="03" eyebrow={t("wwd.eyebrow")} title={t("wwd.title")} description={t("wwd.desc")} tone="dark" brand="aftech" />

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
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-primary-navy transition-colors hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aftech-bright"
              >
                {service.image && <Photo src={service.image} alt={service.imageAlt ?? service.title} />}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="flex items-center gap-2 text-sm text-white/65">
                    <AftechMark className="h-4 w-auto" /> Aftech
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-white/65">{service.shortStatement}</p>
                  <p className="mt-auto border-t border-white/10 pt-4 text-sm text-white/65">
                    {service.capabilities.slice(0, 4).join(" · ")}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    {service.title}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}

          <motion.div variants={staggerItem}>
            <a
              href={HALORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-halora-bronze/40 bg-halora-linen text-ink transition-colors hover:border-halora-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halora-bronze"
            >
              <Photo src={haloraBg} alt={t("wwd.haloraAlt")} />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="flex items-center gap-2 text-sm text-ink/70">
                  <HaloraMark className="h-4 w-4" /> Halora · {t("wwd.secondCompany")}
                </span>
                <h3 className="font-display text-xl font-bold">{t("wwd.haloraTitle")}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{t("wwd.haloraDesc")}</p>
                <p className="mt-auto border-t border-halora-bronze/25 pt-4 text-sm text-ink/70">
                  {haloraTagKeys.map((key) => t(key)).join(" · ")}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-halora-deep">
                  Halora
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
