import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import { formatEditionDate } from "@/data/blog";
import { useBlogIndex } from "@/hooks/useBlog";
import { useLanguage } from "@/i18n/LanguageContext";

/** The three latest "Kabar Teknologi" editions; absent until the first one is published. */
export default function LatestNews() {
  return __BLOG_HAS_EDITIONS__ ? <LatestNewsSection /> : null;
}

/**
 * Editions as a list, newest first. A list takes one, two or three entries
 * without leaving empty cells, which a fixed three-column grid did.
 */
function LatestNewsSection() {
  const { t, lang } = useLanguage();
  const index = useBlogIndex();
  if (index.status !== "ready" || index.data.length === 0) return null;

  return (
    <Section tone="tint">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={t("blog.home.eyebrow")} title={t("blog.home.title")} />
          <LinkArrow to="/blog" className="shrink-0 text-ink">
            {t("blog.home.all")}
          </LinkArrow>
        </div>
        <ol className="border-t border-ink">
          {index.data.slice(0, 3).map((edition) => (
            <li key={edition.slug} className="border-b border-ink/15">
              <Link
                to={`/blog/${edition.slug}`}
                className="group grid gap-3 py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aftech md:grid-cols-12 md:gap-8"
              >
                <span className="text-sm font-semibold text-ink/70 md:col-span-3 md:pt-1">{formatEditionDate(edition.date, lang)}</span>
                <span className="flex flex-col gap-2 md:col-span-8">
                  <span className="font-display text-xl font-bold leading-snug text-ink transition-colors group-hover:text-aftech md:text-2xl">
                    {edition.title}
                  </span>
                  <span className="leading-relaxed text-muted">{edition.description}</span>
                </span>
                <ArrowRight
                  className="hidden h-5 w-5 self-center justify-self-end text-ink/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-aftech md:col-span-1 md:block"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
