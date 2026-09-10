import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [showAllWork, setShowAllWork] = useState(false);
  const proofProjects = localizeProjects(
    projects.filter((p) => p.featured && !p.client?.includes("[") && !p.location?.includes("["))
    , t,
  );
  const INITIAL_WORK_COUNT = 3;
  const visibleWork = showAllWork ? proofProjects : proofProjects.slice(0, INITIAL_WORK_COUNT);
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
            {values.map((value, i) => (
              <li key={value} className="flex items-baseline gap-5 border-t border-ink/10 py-5 last:border-b">
                <span className="shrink-0 font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{t(`about.value.${value}`, value)}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    {t(`about.valueDesc.${value}`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow={t("about.eng.eyebrow")}
              title={t("about.eng.title")}
              description={t("about.eng.desc")}
            />
            <LinkArrow to="/contact" className="mt-7">
              {t("about.eng.start")}
            </LinkArrow>
          </div>
          <ol className="flex flex-col gap-px overflow-hidden rounded-pro border border-line bg-line">
            {engagementSteps.map((step) => (
              <li key={step.no} className="flex gap-5 bg-white p-6 md:p-7">
                <span className="font-display text-2xl font-semibold text-aftech">{step.no}</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.desc}</p>
                </div>
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
          <ProjectGrid projects={visibleWork} />
          {proofProjects.length > INITIAL_WORK_COUNT && (
            <div className="flex flex-col items-center gap-4 border-t border-line pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {t("com.showing")} {visibleWork.length} {t("com.of")} {proofProjects.length} {t("com.projectsCount")}
              </p>
              <div
                className="h-1 w-48 overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-valuenow={visibleWork.length}
                aria-valuemin={0}
                aria-valuemax={proofProjects.length}
                aria-label="Projects shown"
              >
                <div
                  className="h-full rounded-full bg-aftech transition-all duration-500"
                  style={{ width: `${(visibleWork.length / proofProjects.length) * 100}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAllWork((v) => !v)}
                aria-expanded={showAllWork}
                className="group inline-flex items-center gap-2 rounded-full border border-deep-navy bg-deep-navy px-6 py-3 text-sm font-semibold text-white shadow-pro transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                {showAllWork
                  ? t("com.showLess")
                  : `${t("com.loadMore")} (${proofProjects.length - visibleWork.length} ${t("com.more")})`}
                {showAllWork ? (
                  <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                )}
              </button>
            </div>
          )}
        </Container>
      </Section>

      <HaloraTeaser />
      <CtaSection />
    </>
  );
}
