import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceGrid from "@/components/services/ServiceGrid";
import CtaSection from "@/components/home/CtaSection";
import { services } from "@/data/services";
import { HALORA_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeServices } from "@/i18n/localize";
import servicesHeroBg from "@/assets/images/services-hero-bg.jpg";

export default function Services() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t("svc.seo.title")} description={t("svc.seo.desc")} path="/services" />
      <PageHero
        eyebrow={t("svc.hero.eyebrow")}
        title={t("svc.hero.title")}
        description={t("svc.hero.desc")}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("com.services") }]}
        backgroundImage={servicesHeroBg}
      />
      <ServiceGrid services={localizeServices(services, t)} />

      <Section tone="tint">
        <Container className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <SectionHeading
            eyebrow={t("svc.halora.eyebrow")}
            title={t("svc.halora.title")}
            description={t("svc.halora.desc")}
          />
          <a
            href={HALORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-deep-navy text-white px-6 py-3 text-sm font-semibold hover:bg-primary-navy transition-colors"
          >
            {t("svc.halora.visit")}
          </a>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
