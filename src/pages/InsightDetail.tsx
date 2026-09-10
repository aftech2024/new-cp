import { useParams, Navigate } from "react-router-dom";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { getInsightBySlug } from "@/data/insights";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeInsight } from "@/i18n/localize";

export default function InsightDetail() {
  const { slug = "" } = useParams();
  const { t, lang } = useLanguage();
  const raw = getInsightBySlug(slug);
  const insight = raw ? localizeInsight(raw, t) : undefined;

  if (!insight) return <Navigate to="/insights" replace />;

  const date = new Date(insight.date).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Seo title={insight.title} description={insight.excerpt} path={`/insights/${insight.slug}`} type="article" />
      <PageHero
        eyebrow={insight.category}
        title={insight.title}
        description={`${date} · ${insight.excerpt}`}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("com.insights"), to: "/insights" }, { label: insight.title }]}
      />
      <Section>
        <Container className="max-w-3xl flex flex-col gap-6 text-lg leading-relaxed text-ink/90">
          {insight.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Container>
      </Section>
    </>
  );
}
