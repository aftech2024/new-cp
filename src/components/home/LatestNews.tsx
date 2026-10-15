import { Link } from "react-router-dom";
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

function LatestNewsSection() {
  const { t, lang } = useLanguage();
  const index = useBlogIndex();
  if (index.status !== "ready" || index.data.length === 0) return null;

  return (
    <Section tone="tint">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={t("blog.home.eyebrow")} title={t("blog.home.title")} />
          <LinkArrow to="/blog">{t("blog.home.all")}</LinkArrow>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-pro border border-line bg-line md:grid-cols-3">
          {index.data.slice(0, 3).map((edition) => (
            <Link
              key={edition.slug}
              to={`/blog/${edition.slug}`}
              className="group flex flex-col gap-3 bg-white p-6 transition-colors hover:bg-off-white"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-aftech-teal">
                {formatEditionDate(edition.date, lang)}
              </span>
              <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-aftech-teal">
                {edition.title}
              </h3>
              <p className="text-sm text-muted">{edition.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
