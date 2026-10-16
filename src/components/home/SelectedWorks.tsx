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
    <Section tone="light">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            index="05"
            eyebrow={t("sel.eyebrow")}
            title={t("sel.title")}
            description={t("sel.desc")}
            brand="aftech"
          />
          <LinkArrow to="/projects" className="shrink-0 text-ink">
            {t("sel.viewAll")}
          </LinkArrow>
        </div>
        <ProjectGrid projects={featured} />
        <p className="text-sm text-muted">{t("sel.note")}</p>
      </Container>
    </Section>
  );
}
