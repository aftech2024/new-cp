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

export default function Home() {
  return (
    <>
      <Seo
        title="PT Aftech Daya Solusindo | Technology, Engineering & Construction"
        description="PT Aftech Daya Solusindo delivers technology, engineering and mechanical & electrical solutions — with civil construction and interior work delivered through our second company, Halora."
        path="/"
      />
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
