import { useParams, Navigate } from "react-router-dom";
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

const categoryKey: Record<string, string> = {
  technology: "cat.technology",
  me: "cat.me",
  integrated: "cat.integrated",
};

const heroImageBySlug: Record<string, string> = {
  "fews-camera-installation": projectEnterpriseIt,
  "cctv-access-door-installation": meikartaBg,
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
          </div>
        </Container>
      </Section>

      {project.slug === "photogrammetry" && <PhotogrammetryShowcase variant="embedded" />}

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
