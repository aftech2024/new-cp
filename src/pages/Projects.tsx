import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ProjectFilter from "@/components/projects/ProjectFilter";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CtaSection from "@/components/home/CtaSection";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import heroBg from "@/assets/images/hero-bg.jpg";

export default function Projects() {
  const [active, setActive] = useState<Project["category"] | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  return (
    <>
      <Seo
        title="Projects"
        description="Selected technology, mechanical & electrical and integrated projects delivered by Aftech."
        path="/projects"
      />
      <PageHero
        eyebrow="Portfolio"
        title="Selected Works"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Projects" }]}
        backgroundImage={heroBg}
      />
      <Section>
        <Container className="flex flex-col gap-10">
          <ProjectFilter active={active} onChange={setActive} />
          <ProjectGrid projects={filtered} />
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}
