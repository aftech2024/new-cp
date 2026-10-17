import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CtaSection from "@/components/home/CtaSection";
import HaloraTeaser from "@/components/home/HaloraTeaser";
import { values } from "@/data/company";
import { projects } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeProjects } from "@/i18n/localize";
import aboutHero from "@/assets/images/datacenter/cabinet-fitout.jpg";

const engagementKeys = [
  { no: "01", titleKey: "about.eng.s1.t", descKey: "about.eng.s1.d" },
  { no: "02", titleKey: "about.eng.s2.t", descKey: "about.eng.s2.d" },
  { no: "03", titleKey: "about.eng.s3.t", descKey: "about.eng.s3.d" },
];

export default function About() {
  const { t } = useLanguage();
  // Four is enough to show range; the projects page carries the rest.
  const proofProjects = localizeProjects(
    projects.filter((p) => p.featured && !p.client?.includes("[") && !p.location?.includes("[")).slice(0, 4),
    t,
  );
  const engagementSteps = engagementKeys.map((step) => ({
    no: step.no,
    title: t(step.titleKey),
    desc: t(step.descKey),
  }));

  return (
    <>
      <Seo title={t("about.seo.title")} description={t("about.seo.desc")} path="/about" />
      <PageHero
        eyebrow={t("about.hero.eyebrow")}
        title={t("about.hero.title")}
        description={t("about.hero.desc")}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("com.about") }]}
        backgroundImage={aboutHero}
      />

      <Section>
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <SectionHeading
            eyebrow={t("about.ov.eyebrow")}
            title={t("about.ov.title")}
            description={t("about.ov.desc")}
          />
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="font-display font-bold text-xl mb-2">{t("about.ov.vision")}</h3>
              <p className="text-muted">{t("about.ov.visionBody")}</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl mb-2">{t("about.ov.mission")}</h3>
              <p className="text-muted">{t("about.ov.missionBody")}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="tint">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow={t("about.val.eyebrow")} title={t("about.val.title")} />
          </div>
          <ul className="flex flex-col">
            {values.map((value) => (
              <li key={value} className="grid gap-1 border-t border-ink/10 py-5 last:border-b sm:grid-cols-[12rem_1fr] sm:gap-6">
                <h3 className="text-lg font-semibold text-ink">{t(`about.value.${value}`, value)}</h3>
                <p className="text-sm leading-relaxed text-muted sm:pt-1">{t(`about.valueDesc.${value}`)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={t("about.eng.eyebrow")}
              title={t("about.eng.title")}
              description={t("about.eng.desc")}
            />
            <LinkArrow to="/contact" className="shrink-0 text-aftech-strong">
              {t("about.eng.start")}
            </LinkArrow>
          </div>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {engagementSteps.map((step) => (
              <li key={step.no} className="flex flex-col gap-3 border-t-2 border-aftech-strong pt-5">
                <span className="font-display text-sm font-semibold text-aftech-strong">{step.no}</span>
                <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
                <p className="max-w-[42ch] text-sm leading-relaxed text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="tint">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeading
              eyebrow={t("about.proof.eyebrow")}
              title={t("about.proof.title")}
              description={t("about.proof.desc")}
            />
            <LinkArrow to="/projects">{t("com.viewAllProjects")}</LinkArrow>
          </div>
          <ProjectGrid projects={proofProjects} />
        </Container>
      </Section>

      <HaloraTeaser />
      <CtaSection />
    </>
  );
}
