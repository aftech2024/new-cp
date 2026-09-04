import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceGrid from "@/components/services/ServiceGrid";
import CtaSection from "@/components/home/CtaSection";
import { services } from "@/data/services";
import { HALORA_URL } from "@/data/company";
import servicesHeroBg from "@/assets/images/services-hero-bg.jpg";

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="Technology, mechanical & electrical and integrated solutions from PT Aftech Daya Solusindo."
        path="/services"
      />
      <PageHero
        eyebrow="What We Do"
        title="Capabilities built to work together."
        description="Technology is our core, delivered alongside mechanical & electrical engineering. For civil construction and interior work, our second company Halora takes the lead."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
        backgroundImage={servicesHeroBg}
      />
      <ServiceGrid services={services} />

      <Section tone="tint">
        <Container className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <SectionHeading
            eyebrow="Looking for Civil or Interior?"
            title="That's Halora."
            description="Civil construction and interior fit-out are handled by our second company, Halora — a dedicated team outside of Aftech's IT and engineering scope."
          />
          <a
            href={HALORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-deep-navy text-white px-6 py-3 text-sm font-semibold hover:bg-primary-navy transition-colors"
          >
            Visit Halora ↗
          </a>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
