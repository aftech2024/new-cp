import Seo from "@/components/Seo";
import Hero from "@/components/home/Hero";
import TechnologyCore from "@/components/home/TechnologyCore";
import DigitalToPhysical from "@/components/home/DigitalToPhysical";
import WhatWeDo from "@/components/home/WhatWeDo";
import IntegratedSolutions from "@/components/home/IntegratedSolutions";
import SelectedWorks from "@/components/home/SelectedWorks";
import Capabilities from "@/components/home/Capabilities";
import HaloraTeaser from "@/components/home/HaloraTeaser";
import Clients from "@/components/home/Clients";
import InsightsPreview from "@/components/home/InsightsPreview";
import CtaSection from "@/components/home/CtaSection";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t("home.seo.title")} description={t("home.seo.desc")} path="/" />
      <Hero />
      <TechnologyCore />
      <DigitalToPhysical />
      <WhatWeDo />
      <IntegratedSolutions />
      <SelectedWorks />
      <Capabilities />
      <HaloraTeaser />
      <Clients />
      <InsightsPreview />
      <CtaSection />
    </>
  );
}
