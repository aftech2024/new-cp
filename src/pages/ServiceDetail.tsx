import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageReveal, { type Motif } from "@/components/ui/ImageReveal";
import thermalMounting from "@/assets/images/fews/fews-thermal-01.jpg";
import conveyorArea from "@/assets/images/fews/fews-thermal-04.jpg";
import atHeight from "@/assets/images/fews/fews-height-01.jpg";
import cameraUnit from "@/assets/images/fews/fews-unit-01.jpg";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CtaSection from "@/components/home/CtaSection";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { HALORA_URL } from "@/data/company";

const motifBySlug: Record<string, Motif> = {
  technology: "technology",
  "mechanical-electrical": "me",
  "integrated-solutions": "integrated",
};

const categoryBySlug: Record<string, string> = {
  technology: "technology",
  "mechanical-electrical": "me",
  "integrated-solutions": "integrated",
};

// Real field photography replaces the generic motif where available.
interface HeroPhoto {
  src: string;
  alt: string;
  caption: string;
}

const heroPhotosBySlug: Record<string, HeroPhoto[]> = {
  technology: [
    {
      src: thermalMounting,
      alt: "Technology delivered in the field — thermal camera mounting, Adipala",
      caption: "Thermal camera mounting — Adipala",
    },
    {
      src: conveyorArea,
      alt: "Coal conveyor monitored area — Adipala",
      caption: "Coal conveyor — monitored area",
    },
    {
      src: atHeight,
      alt: "At-height installation works — Adipala",
      caption: "At-height works — Adipala",
    },
    {
      src: cameraUnit,
      alt: "Camera unit on steel structure — Adipala",
      caption: "Camera unit on steel structure",
    },
  ],
};

function RotatingHero({ photos }: { photos: HeroPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 5500);
    return () => clearInterval(id);
  }, [paused, photos.length]);

  return (
    <div
      className="relative overflow-hidden rounded-pro shadow-card ring-1 ring-ink/15"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {photos.map((photo, i) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={i === index ? photo.alt : ""}
          aria-hidden={i !== index}
          loading="eager"
          className={`aspect-[16/9] w-full object-cover transition-opacity duration-1000 md:aspect-[21/9] ${
            i === index ? "relative opacity-100" : "absolute inset-0 opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/45 to-transparent p-4">
        <span
          key={index}
          className="rounded-pro bg-deep-navy/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm border border-white/15"
        >
          {photos[index].caption}
        </span>
        <span className="flex items-center gap-2" role="tablist" aria-label="Hero photos">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}: ${photo.caption}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/services" replace />;

  const relatedProjects = projects.filter((p) => p.category === categoryBySlug[service.slug]).slice(0, 4);

  return (
    <>
      <Seo title={service.title} description={service.shortStatement} path={`/services/${service.slug}`} />
      <PageHero
        eyebrow={`Service ${service.number}`}
        title={service.title}
        description={service.intro}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: service.title }]}
      >
        {service.slug === "integrated-solutions" && (
          <a
            href={HALORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:border-white/40 transition-colors w-fit"
          >
            Delivered together with Halora, our second company →
          </a>
        )}
      </PageHero>

      <Section>
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <SectionHeading eyebrow="Capabilities" title="What we deliver." />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.capabilities.map((item) => (
              <li key={item} className="rounded-sm border border-line bg-white px-4 py-3 text-sm font-medium">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="tint">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <SectionHeading eyebrow="Process" title="How we work." />
          <ol className="flex flex-col">
            {service.process.map((step, i) => (
              <li key={step} className="flex items-center gap-4 border-t border-line py-4 first:border-t-0">
                <span className="font-display text-sm text-aftech-teal font-bold">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold">{step}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          {heroPhotosBySlug[service.slug] ? (
            <RotatingHero photos={heroPhotosBySlug[service.slug]} />
          ) : (
            <ImageReveal motif={motifBySlug[service.slug]} ratio="hero" label={service.title} />
          )}
        </Container>
      </Section>

      {relatedProjects.length > 0 && (
        <Section tone="tint">
          <Container className="flex flex-col gap-10">
            <SectionHeading eyebrow="Related Work" title="Projects in this capability." />
            <ProjectGrid projects={relatedProjects} />
          </Container>
        </Section>
      )}

      <Section>
        <Container className="flex flex-col gap-10 max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Common questions." />
          <div className="flex flex-col divide-y divide-line border-t border-line">
            {service.faq.map((item) => (
              <div key={item.question} className="py-6">
                <h3 className="font-display font-bold">{item.question}</h3>
                <p className="mt-2 text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
