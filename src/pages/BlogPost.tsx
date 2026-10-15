import { useParams, Navigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import LinkArrow from "@/components/ui/LinkArrow";
import CtaSection from "@/components/home/CtaSection";
import { formatEditionDate } from "@/data/blog";
import { useBlogEdition } from "@/hooks/useBlog";
import { useLanguage } from "@/i18n/LanguageContext";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const { t, lang } = useLanguage();
  const state = useBlogEdition(slug);

  if (state.status === "error" && state.notFound) return <Navigate to="/blog" replace />;
  if (state.status !== "ready") {
    return (
      <Section>
        <Container className="max-w-3xl pt-16">
          <p className="text-muted">{state.status === "loading" ? t("blog.loading") : t("blog.error")}</p>
        </Container>
      </Section>
    );
  }

  const edition = state.data;
  return (
    <>
      <Seo title={edition.title} description={edition.description} path={`/blog/${edition.slug}`} type="article" />
      <PageHero
        eyebrow={formatEditionDate(edition.date, lang)}
        title={edition.title}
        description={edition.description}
        breadcrumb={[
          { label: t("com.home"), to: "/" },
          { label: t("nav.blog"), to: "/blog" },
          { label: formatEditionDate(edition.date, lang, false) },
        ]}
      />
      <Section>
        <Container>
          <div className="flex max-w-3xl flex-col gap-12">
            {lang === "en" && (
              <p className="rounded-pro border border-line bg-white px-4 py-3 text-sm text-muted">{t("blog.langNote")}</p>
            )}

            <ol className="flex flex-col gap-12">
              {edition.items.map((item, i) => (
                <li key={item.source.url}>
                  <article className="flex flex-col gap-4 border-t border-line pt-8">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
                      <span className="font-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-aftech-teal">{t(`blog.cat.${item.category}`)}</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold leading-snug md:text-3xl">{item.headline}</h2>
                    <p className="text-lg leading-relaxed text-ink/90">{item.summary}</p>
                    <div className="border-l-2 border-aftech-teal pl-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aftech-teal">{t("blog.why")}</p>
                      <p className="mt-1 leading-relaxed text-ink/90">{item.whyItMatters}</p>
                    </div>
                    <p className="text-sm text-muted">
                      {t("blog.source")}:{" "}
                      <a
                        href={item.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-aftech-teal"
                      >
                        {item.source.name}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>{" "}
                      · {formatEditionDate(item.source.publishedAt.slice(0, 10), lang, false)}
                    </p>
                  </article>
                </li>
              ))}
            </ol>

            {edition.aftechNote && (
              <aside className="rounded-pro bg-aftech-ice p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aftech-teal">{t("blog.aftechNote")}</p>
                <p className="mt-2 leading-relaxed text-ink/90">{edition.aftechNote}</p>
              </aside>
            )}

            <footer className="flex flex-col gap-5 border-t border-line pt-8">
              <p className="text-sm text-muted">
                {t("blog.disclosure")}
                {edition.meta.reviewed ? ` ${t("blog.reviewed")}` : ""}
              </p>
              <LinkArrow to="/blog">{t("blog.back")}</LinkArrow>
            </footer>
          </div>
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}
