import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ProjectFilter from "@/components/projects/ProjectFilter";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CtaSection from "@/components/home/CtaSection";
import { projects } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeProjects } from "@/i18n/localize";
import type { Project } from "@/types";
import heroBg from "@/assets/images/hero-bg.jpg";

export default function Projects() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Project["category"] | "all">("all");

  const filtered = useMemo(() => {
    const list = active === "all" ? projects : projects.filter((p) => p.category === active);
    return localizeProjects(list, t);
  }, [active, t]);

  return (
    <>
      <Seo title={t("prj.seo.title")} description={t("prj.seo.desc")} path="/projects" />
      <PageHero
        eyebrow={t("prj.hero.eyebrow")}
        title={t("prj.hero.title")}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("com.projects") }]}
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
