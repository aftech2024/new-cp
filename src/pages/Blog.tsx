import { useState } from "react";
import { ChevronDown, Rss } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import EditionCard from "@/components/blog/EditionCard";
import CtaSection from "@/components/home/CtaSection";
import { BLOG_CATEGORIES, type BlogCategory } from "@/data/blog";
import { useBlogIndex } from "@/hooks/useBlog";
import { useLanguage } from "@/i18n/LanguageContext";

const PAGE_SIZE = 10;

export default function Blog() {
  const { t } = useLanguage();
  const index = useBlogIndex();
  const [category, setCategory] = useState<BlogCategory | "all">("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const editions = index.status === "ready" ? index.data : [];
  const present = BLOG_CATEGORIES.filter((c) => editions.some((e) => e.categories.includes(c)));
  const filtered = category === "all" ? editions : editions.filter((e) => e.categories.includes(category));
  const shown = filtered.slice(0, visible);

  return (
    <>
      <Seo title={t("blog.seo.title")} description={t("blog.seo.desc")} path="/blog" />
      <PageHero
        eyebrow={t("blog.hero.eyebrow")}
        title={t("blog.hero.title")}
        description={t("blog.hero.desc")}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("nav.blog") }]}
      />
      <Section>
        <Container className="flex flex-col gap-8">
          {present.length > 1 && (
            <div role="group" aria-label={t("blog.filter")} className="flex flex-wrap gap-2">
              {(["all", ...present] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => {
                    setCategory(c);
                    setVisible(PAGE_SIZE);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    category === c
                      ? "border-deep-navy bg-deep-navy text-white"
                      : "border-line bg-white text-ink hover:border-deep-navy"
                  }`}
                >
                  {c === "all" ? t("blog.cat.all") : t(`blog.cat.${c}`)}
                </button>
              ))}
            </div>
          )}

          {index.status === "loading" && <p className="text-muted">{t("blog.loading")}</p>}
          {index.status === "error" && !index.notFound && <p className="text-muted">{t("blog.error")}</p>}
          {index.status !== "loading" && editions.length === 0 && !(index.status === "error" && !index.notFound) && (
            <p className="text-muted">{t("blog.empty")}</p>
          )}

          {shown.length > 0 && (
            <div>
              {shown.map((edition) => (
                <EditionCard key={edition.slug} edition={edition} />
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            {filtered.length > shown.length ? (
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="group inline-flex items-center gap-2 rounded-full border border-deep-navy bg-deep-navy px-6 py-3 text-sm font-semibold text-white shadow-pro transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                {t("com.loadMore")} ({filtered.length - shown.length} {t("com.more")})
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            ) : (
              <span />
            )}
            {editions.length > 0 && (
              <a
                href="/blog/rss.xml"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-aftech-teal"
              >
                <Rss className="h-4 w-4" aria-hidden="true" />
                {t("blog.rss")}
              </a>
            )}
          </div>
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}
