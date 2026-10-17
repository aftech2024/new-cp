import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import ImageReveal, { type Motif } from "@/components/ui/ImageReveal";
import thermalMounting from "@/assets/images/fews/fews-thermal-01.jpg";
import conveyorArea from "@/assets/images/fews/fews-thermal-04.jpg";
import atHeight from "@/assets/images/fews/fews-height-01.jpg";
import cameraUnit from "@/assets/images/fews/fews-unit-01.jpg";
import aiFarmCommand from "@/assets/images/integrated/ai-farm/ai-farm-01.jpg";
import eptmsDashboard from "@/assets/images/integrated/eptms/eptms-01.jpg";
import mkPortfolio from "@/assets/images/integrated/mk/mk-02.jpg";
import meDistributionPanel from "@/assets/images/me/me-distribution-panel.jpg";
import mePanelTermination from "@/assets/images/me/me-panel-termination.jpg";
import meConduitFireCable from "@/assets/images/me/me-conduit-fire-cable.jpg";
import meCableTrayInstall from "@/assets/images/me/me-cable-tray-install.jpg";
import meLiftControlOpen from "@/assets/images/me/me-lift-control-open.jpg";
import meLiftControlClosed from "@/assets/images/me/me-lift-control-closed.jpg";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CtaSection from "@/components/home/CtaSection";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { HALORA_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeProjects, localizeService } from "@/i18n/localize";

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

const heroPhotoDefs: Record<string, { src: string; captionKey: string }[]> = {
  technology: [
    { src: thermalMounting, captionKey: "prjData.fews-camera-installation.gal.2" },
    { src: conveyorArea, captionKey: "prjData.fews-camera-installation.gal.5" },
    { src: atHeight, captionKey: "prjData.fews-camera-installation.gal.19" },
    { src: cameraUnit, captionKey: "prjData.fews-camera-installation.gal.7" },
  ],
  "integrated-solutions": [
    { src: aiFarmCommand, captionKey: "prjData.ai-autonomous-farm-kementan.gal.0" },
    { src: eptmsDashboard, captionKey: "prjData.eptms-enterprise-project-management.gal.0" },
    { src: mkPortfolio, captionKey: "prjData.mk-management-construction.gal.1" },
  ],
  "mechanical-electrical": [
    { src: meDistributionPanel, captionKey: "svcData.mechanical-electrical.gal.0" },
    { src: mePanelTermination, captionKey: "svcData.mechanical-electrical.gal.1" },
    { src: meConduitFireCable, captionKey: "svcData.mechanical-electrical.gal.2" },
    { src: meCableTrayInstall, captionKey: "svcData.mechanical-electrical.gal.3" },
    { src: meLiftControlOpen, captionKey: "svcData.mechanical-electrical.gal.4" },
    { src: meLiftControlClosed, captionKey: "svcData.mechanical-electrical.gal.5" },
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
    <figure
      className="flex flex-col gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-pro bg-line">
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
      </div>
      <div className="flex items-start justify-between gap-4">
        <figcaption className="text-sm text-muted" aria-live="polite">
          {photos[index].caption}
        </figcaption>
        <span className="flex shrink-0 items-center gap-2 pt-1.5" role="tablist" aria-label="Photos">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}: ${photo.caption}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
        </span>
      </div>
    </figure>
  );
}

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const { t } = useLanguage();
  const rawService = getServiceBySlug(slug);
  const service = rawService ? localizeService(rawService, t) : undefined;
  if (!service) return <Navigate to="/services" replace />;

  const relatedProjects = projects.filter((p) => p.category === categoryBySlug[service.slug]);
  const heroPhotos: HeroPhoto[] | undefined = heroPhotoDefs[service.slug]?.map((def) => {
    const caption = t(def.captionKey);
    return { src: def.src, alt: caption, caption };
  });

  return (
    <>
      <Seo title={service.title} description={service.shortStatement} path={`/services/${service.slug}`} />
      <PageHero
        title={service.title}
        description={service.intro}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("com.services"), to: "/services" }, { label: service.title }]}
      >
        {service.slug === "integrated-solutions" && (
          <LinkArrow href={HALORA_URL} className="w-fit text-white/85 hover:text-white">
            {t("sd.haloraLink")}
          </LinkArrow>
        )}
      </PageHero>

      <Section>
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <SectionHeading eyebrow={t("sd.capabilities")} title={t("sd.whatDeliver")} />
          <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {service.capabilities.map((item) => (
              <li key={item} className="border-b border-line py-3.5 font-medium text-ink">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="tint">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow={t("sd.process")} title={t("sd.howWork")} />
          <ol className="flex flex-col">
            {service.process.map((step, i) => (
              <li key={step} className="flex items-center gap-4 border-t border-line py-4 first:border-t-0">
                <span className="font-display text-sm font-bold text-aftech-strong">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold">{step}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          {heroPhotos ? (
            <RotatingHero photos={heroPhotos} />
          ) : (
            <ImageReveal motif={motifBySlug[service.slug]} ratio="hero" label={service.title} />
          )}
        </Container>
      </Section>

      {relatedProjects.length > 0 && (
        <Section tone="tint">
          <Container className="flex flex-col gap-10">
            <SectionHeading eyebrow={t("sd.related")} title={t("sd.inCapability")} />
            <ProjectGrid projects={localizeProjects(relatedProjects, t)} />
          </Container>
        </Section>
      )}

      <Section>
        <Container className="flex flex-col gap-10 max-w-3xl">
          <SectionHeading eyebrow={t("sd.faq")} title={t("sd.commonQ")} />
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
