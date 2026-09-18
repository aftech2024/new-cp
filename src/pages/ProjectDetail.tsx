import { useParams, Navigate } from "react-router-dom";
import { ArrowUpRight, Globe } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
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
      >
        <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">{t("pd.client")}</dt>
            <dd className="mt-1 font-semibold">{project.client}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">{t("pd.location")}</dt>
            <dd className="mt-1 font-semibold">{project.location}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">{t("pd.status")}</dt>
            <dd className="mt-1 font-semibold capitalize">
              {project.status ? t(`status.${project.status}`, project.status) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">{t("pd.category")}</dt>
            <dd className="mt-1 font-semibold">{t(categoryKey[project.category] ?? project.category)}</dd>
          </div>
        </dl>
        {project.liveUrl && (
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-pro bg-white px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-deep-navy transition-all duration-300 hover:bg-aftech-bright hover:text-deep-navy"
            >
              <Globe className="h-4 w-4" />
              {t("pd.liveDemo")}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <span className="font-mono text-[11px] tracking-wide text-white/50">{t("pd.liveNote")}</span>
          </div>
        )}
      </PageHero>

      <Section>
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <SectionHeading eyebrow={t("pd.overview")} title={t("pd.overviewTitle")} description={project.description} />
          <div>
            <h3 className="font-display font-bold text-xl mb-4">{t("pd.scope")}</h3>
            <ul className="flex flex-col gap-2">
              {project.scope.map((item) => (
                <li key={item} className="rounded-sm border border-line bg-white px-4 py-3 text-sm font-medium">
                  {item}
                </li>
              ))}
            </ul>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 flex items-center gap-4 rounded-pro border border-aftech/25 bg-aftech/5 p-4 transition-colors hover:border-aftech hover:bg-aftech/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pro bg-aftech text-white">
                  <Globe className="h-5 w-5" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-aftech">
                    {t("pd.livePlatform")}
                  </span>
                  <span className="truncate text-sm font-semibold text-ink group-hover:text-aftech">
                    {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-aftech" />
              </a>
            )}
          </div>
        </Container>
      </Section>

      {project.slug === "photogrammetry" && <PhotogrammetryShowcase variant="embedded" liveUrl={project.liveUrl} />}

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
