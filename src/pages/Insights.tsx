import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import InsightCard from "@/components/insights/InsightCard";
import CtaSection from "@/components/home/CtaSection";
import { insights } from "@/data/insights";

export default function Insights() {
  return (
    <>
      <Seo
        title="Insights"
        description="Perspectives on technology, engineering, construction and business from the Aftech team."
        path="/insights"
      />
      <PageHero
        eyebrow="Insights"
        title="Aftech Insights"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Insights" }]}
      />
      <Section>
        <Container>
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}
