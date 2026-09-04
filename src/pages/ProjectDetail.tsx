import { useParams, Navigate } from "react-router-dom";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Gallery from "@/components/ui/Gallery";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CtaSection from "@/components/home/CtaSection";
import { getProjectBySlug, projects } from "@/data/projects";
import projectEnterpriseIt from "@/assets/images/project-enterprise-it.jpg";
import meikartaBg from "@/assets/images/meikarta/meikarta-bg.jpg";

const categoryLabel: Record<string, string> = {
  technology: "Technology",
  me: "Mechanical & Electrical",
  integrated: "Integrated",
};

const heroImageBySlug: Record<string, string> = {
  "fews-camera-installation": projectEnterpriseIt,
  "cctv-access-door-installation": meikartaBg,
};

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <Navigate to="/projects" replace />;

  const related = projects.filter((p) => p.category === project.category && p.id !== project.id).slice(0, 2);

  return (
    <>
      <Seo title={project.title} description={project.description} path={`/projects/${project.slug}`} type="article" />
      <PageHero
        eyebrow={categoryLabel[project.category]}
        title={project.title}
        description={project.description}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Projects", to: "/projects" }, { label: project.title }]}
        backgroundImage={heroImageBySlug[project.slug]}
      >
        <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">Client</dt>
            <dd className="mt-1 font-semibold">{project.client}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">Location</dt>
            <dd className="mt-1 font-semibold">{project.location}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">Status</dt>
            <dd className="mt-1 font-semibold capitalize">{project.status ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/50">Category</dt>
            <dd className="mt-1 font-semibold">{categoryLabel[project.category]}</dd>
          </div>
        </dl>
      </PageHero>

      <Section>
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <SectionHeading eyebrow="Overview" title="Project overview." description={project.description} />
          <div>
            <h3 className="font-display font-bold text-xl mb-4">Scope of Work</h3>
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

      <Section tone="tint">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Gallery" title="Project gallery." />
          <Gallery items={project.gallery} title={project.title} />
        </Container>
      </Section>

      {related.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-10">
            <SectionHeading eyebrow="Related" title="More in this capability." />
            <ProjectGrid projects={related} />
          </Container>
        </Section>
      )}

      <CtaSection />
    </>
  );
}
