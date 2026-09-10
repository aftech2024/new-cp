import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { projects } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeProjects } from "@/i18n/localize";

export default function SelectedWorks() {
  const { t } = useLanguage();
  const featured = localizeProjects(
    projects.filter((p) => p.featured),
    t,
  );

  return (
    <Section tone="light" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-light opacity-50" aria-hidden="true" />
      <Container className="relative flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            index="04B"
            eyebrow={t("sel.eyebrow")}
            title={t("sel.title")}
            description={t("sel.desc")}
            brand="aftech"
          />
          <LinkArrow to="/projects">{t("sel.viewAll")}</LinkArrow>
        </div>
        <ProjectGrid projects={featured} />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {t("sel.note")}
        </p>
      </Container>
    </Section>
  );
}
