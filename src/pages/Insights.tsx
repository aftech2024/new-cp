import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import InsightCard from "@/components/insights/InsightCard";
import CtaSection from "@/components/home/CtaSection";
import { insights } from "@/data/insights";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeInsights } from "@/i18n/localize";

export default function Insights() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t("insPage.seo.title")} description={t("insPage.seo.desc")} path="/insights" />
      <PageHero
        eyebrow={t("insPage.hero.eyebrow")}
        title={t("insPage.hero.title")}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("com.insights") }]}
      />
      <Section>
        <Container>
          {localizeInsights(insights, t).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}
