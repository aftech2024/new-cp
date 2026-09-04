import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { projects } from "@/data/projects";

export default function SelectedWorks() {
  const featured = projects.filter((p) => p.featured);

  return (
    <Section tone="light" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-light opacity-50" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            index="04B"
            eyebrow="Portfolio — Aftech delivery"
            title="Selected Works"
            description="Technology, engineering and integrated programs — documented with scope, systems and outcomes."
            brand="aftech"
          />
          <LinkArrow to="/projects">View All Projects</LinkArrow>
        </div>
        <ProjectGrid projects={featured} />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          * Civil & interior portfolio lives with Halora — our second company.
        </p>
      </Container>
    </Section>
  );
}
