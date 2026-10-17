import { useState } from "react";
import { Rss } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import EditionCard from "@/components/blog/EditionCard";
import Button from "@/components/ui/Button";
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
            <div role="group" aria-label={t("blog.filter")} className="flex flex-wrap gap-x-7 gap-y-2 border-b border-line">
              {(["all", ...present] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => {
                    setCategory(c);
                    setVisible(PAGE_SIZE);
                  }}
                  className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors ${
                    category === c ? "border-aftech-strong text-ink" : "border-transparent text-muted hover:text-ink"
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
            // the category tabs already draw the rule above the first edition
            <div className={present.length > 1 ? "[&>article:first-child]:border-t-0 [&>article:first-child]:pt-0" : ""}>
              {shown.map((edition) => (
                <EditionCard key={edition.slug} edition={edition} />
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            {filtered.length > shown.length ? (
              <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                {t("com.loadMore")} ({filtered.length - shown.length} {t("com.more")})
              </Button>
            ) : (
              <span />
            )}
            {editions.length > 0 && (
              <a
                href="/blog/rss.xml"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-aftech-strong"
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
