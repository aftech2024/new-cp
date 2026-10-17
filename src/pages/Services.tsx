import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
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

      <Section tone="halora" className="border-t border-halora-bronze/20">
        <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t("svc.halora.eyebrow")}
            title={t("svc.halora.title")}
            description={t("svc.halora.desc")}
            brand="halora"
          />
          <Button href={HALORA_URL} variant="halora" className="shrink-0">
            {t("svc.halora.visit")}
          </Button>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
