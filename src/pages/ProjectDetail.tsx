import { useParams, Navigate } from "react-router-dom";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import LinkArrow from "@/components/ui/LinkArrow";
import Gallery from "@/components/ui/Gallery";
import ProjectGrid from "@/components/projects/ProjectGrid";
import PhotogrammetryShowcase from "@/components/services/PhotogrammetryShowcase";
import CtaSection from "@/components/home/CtaSection";
import { getProjectBySlug, projects } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeProject, localizeProjects } from "@/i18n/localize";
import projectEnterpriseIt from "@/assets/images/project-enterprise-it.jpg";
import meikartaBg from "@/assets/images/meikarta/meikarta-bg.jpg";
import photoOrthomosaic from "@/assets/images/photogrammetry/orthomosaic.jpg";
import meDistributionPanel from "@/assets/images/me/me-distribution-panel.jpg";

const categoryKey: Record<string, string> = {
  technology: "cat.technology",
  me: "cat.me",
  integrated: "cat.integrated",
};

const heroImageBySlug: Record<string, string> = {
  "fews-camera-installation": projectEnterpriseIt,
  "cctv-access-door-installation": meikartaBg,
  photogrammetry: photoOrthomosaic,
  "mechanical-electrical-works": meDistributionPanel,
};

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const { t } = useLanguage();
  const raw = getProjectBySlug(slug);
  const project = raw ? localizeProject(raw, t) : undefined;

  if (!project) return <Navigate to="/projects" replace />;

  const related = localizeProjects(
    projects.filter((p) => p.category === project.category && p.id !== project.id).slice(0, 2),
    t,
  );

  return (
    <>
      <Seo title={project.title} description={project.description} path={`/projects/${project.slug}`} type="article" />
      <PageHero
        eyebrow={t(categoryKey[project.category] ?? project.category)}
        title={project.title}
        description={project.description}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("com.projects"), to: "/projects" }, { label: project.title }]}
        backgroundImage={heroImageBySlug[project.slug]}
        meta={[
          { label: t("pd.client"), value: project.client ?? "" },
          { label: t("pd.location"), value: project.location ?? "" },
          { label: t("pd.status"), value: project.status ? t(`status.${project.status}`, project.status) : "" },
        ].filter((m) => m.value)}
      >
        {project.liveUrl && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button href={project.liveUrl}>{t("pd.liveDemo")}</Button>
            <span className="text-sm text-white/65">{t("pd.liveNote")}</span>
          </div>
        )}
      </PageHero>

      {/* The hero already carries the description, so this section is the scope alone. */}
      <Section>
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow={t("pd.overview")} title={t("pd.scope")} />
          <div className="flex flex-col gap-8">
            <ul className="flex flex-col border-t border-line">
              {project.scope.map((item) => (
                <li key={item} className="border-b border-line py-3.5 font-medium text-ink">
                  {item}
                </li>
              ))}
            </ul>
            {project.liveUrl && (
              <p className="flex flex-col gap-1">
                <span className="text-sm text-muted">{t("pd.livePlatform")}</span>
                <LinkArrow href={project.liveUrl} className="w-fit text-base text-aftech-strong">
                  {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </LinkArrow>
              </p>
            )}
          </div>
        </Container>
      </Section>

      {project.slug === "photogrammetry" && <PhotogrammetryShowcase />}

      <Section tone="tint">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow={t("pd.gallery")} title={t("pd.galleryTitle")} />
          <Gallery items={project.gallery} title={project.title} />
        </Container>
      </Section>

      {related.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-10">
            <SectionHeading eyebrow={t("pd.related")} title={t("pd.moreIn")} />
            <ProjectGrid projects={related} />
          </Container>
        </Section>
      )}

      <CtaSection />
    </>
  );
}
