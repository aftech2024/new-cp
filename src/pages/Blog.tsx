import { useState } from "react";
import { Link } from "react-router-dom";
import { Rss } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import LinkArrow from "@/components/ui/LinkArrow";
import CtaSection from "@/components/home/CtaSection";
import { editionTopics, formatEditionDate, formatEditionMonth, type BlogIndexEntry } from "@/data/blog";
import { useBlogEdition, useBlogIndex } from "@/hooks/useBlog";
import { useLanguage } from "@/i18n/LanguageContext";

/** Archive months shown at first; "earlier months" adds as many again. */
const MONTH_STEP = 3;

interface ArchiveMonth {
  key: string;
  editions: BlogIndexEntry[];
}

/** Newest-first editions grouped into calendar months, newest month first. */
function groupByMonth(editions: BlogIndexEntry[]): ArchiveMonth[] {
  const months: ArchiveMonth[] = [];
  for (const edition of editions) {
    const key = edition.date.slice(0, 7);
    if (months.at(-1)?.key !== key) months.push({ key, editions: [] });
    months.at(-1)!.editions.push(edition);
  }
  return months;
}

/**
 * The latest edition opens the page with its headlines; every earlier one is
 * a single row in a month of the archive, so the page grows by a line per
 * edition and only a few months are shown until the reader asks for more.
 */
export default function Blog() {
  const { t } = useLanguage();
  const index = useBlogIndex();
  const [monthsShown, setMonthsShown] = useState(MONTH_STEP);

  const [latest, ...older] = index.status === "ready" ? index.data : [];
  const months = groupByMonth(older);
  const hiddenEditions = months.slice(monthsShown).reduce((n, month) => n + month.editions.length, 0);

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
        <Container className="flex flex-col gap-20">
          {index.status === "loading" && <p className="text-muted">{t("blog.loading")}</p>}
          {index.status === "error" && !index.notFound && <p className="text-muted">{t("blog.error")}</p>}
          {index.status !== "loading" && !latest && !(index.status === "error" && !index.notFound) && (
            <p className="text-muted">{t("blog.empty")}</p>
          )}

          {latest && <LatestEdition entry={latest} />}

          {months.length > 0 && (
            <section aria-labelledby="blog-archive" className="flex flex-col gap-10">
              <h2 id="blog-archive" className="font-display text-2xl font-bold md:text-3xl">
                {t("blog.archive")}
              </h2>
              {months.slice(0, monthsShown).map((month) => (
                <MonthOfEditions key={month.key} month={month} />
              ))}
            </section>
          )}

          {latest && (
            <div className="-mt-8 flex flex-wrap items-center justify-between gap-4">
              {hiddenEditions > 0 ? (
                <Button variant="secondary" onClick={() => setMonthsShown((n) => n + MONTH_STEP)}>
                  {t("blog.earlier")} ({hiddenEditions} {t("blog.editions")})
                </Button>
              ) : (
                <span />
              )}
              <a
                href="/blog/rss.xml"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-aftech-strong"
              >
                <Rss className="h-4 w-4" aria-hidden="true" />
                {t("blog.rss")}
              </a>
            </div>
          )}
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}

/** The date is the heading and the headlines are the content; the index's description fills in while they load. */
function LatestEdition({ entry }: { entry: BlogIndexEntry }) {
  const { t, lang } = useLanguage();
  const edition = useBlogEdition(entry.slug);
  const items = edition.status === "ready" ? edition.data.items : [];
  const href = `/blog/${entry.slug}`;

  return (
    <article className="grid gap-8 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-12">
      <div className="flex flex-col items-start gap-3 lg:col-span-4">
        <p className="text-sm font-semibold text-aftech-strong">{t("blog.latest")}</p>
        <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
          <Link to={href} className="transition-colors hover:text-aftech-strong">
            {formatEditionDate(entry.date, lang)}
          </Link>
        </h2>
        <p className="text-muted">
          {entry.itemCount} {t("blog.stories")}
        </p>
        <LinkArrow to={href} className="mt-3 text-ink">
          {t("blog.read")}
        </LinkArrow>
      </div>

      {items.length > 0 ? (
        <ol className="lg:col-span-8">
          {items.map((item) => (
            <li key={item.source.url} className="border-b border-line py-5 first:pt-0 last:border-b-0">
              <Link
                to={href}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aftech"
              >
                <span className="block text-sm font-semibold text-aftech-strong">{t(`blog.cat.${item.category}`)}</span>
                <span className="mt-1.5 block font-display text-lg font-semibold leading-snug transition-colors group-hover:text-aftech-strong md:text-xl">
                  {item.headline}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-lg leading-relaxed text-muted lg:col-span-8">{entry.description}</p>
      )}
    </article>
  );
}

function MonthOfEditions({ month }: { month: ArchiveMonth }) {
  const { t, lang } = useLanguage();
  const weekday = (date: string) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { timeZone: "UTC", weekday: "short" });

  return (
    <div className="grid gap-3 lg:grid-cols-12 lg:gap-12">
      <h3 className="font-display text-lg font-bold lg:sticky lg:top-28 lg:col-span-4 lg:self-start lg:pt-4">{formatEditionMonth(month.editions[0].date, lang)}</h3>
      <ol className="border-t border-line lg:col-span-8">
        {month.editions.map((edition) => (
          <li key={edition.slug} className="border-b border-line">
            <Link
              to={`/blog/${edition.slug}`}
              className="group grid grid-cols-[3rem_1fr] items-center gap-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aftech sm:grid-cols-[3rem_1fr_auto]"
            >
              <span className="flex flex-col items-center leading-none">
                <span className="text-xs text-muted">{weekday(edition.date)}</span>
                <span className="mt-1 font-display text-2xl font-bold tabular-nums">{Number(edition.date.slice(8))}</span>
              </span>
              <span className="font-semibold leading-snug text-ink transition-colors group-hover:text-aftech-strong">
                {editionTopics(edition.title)}
              </span>
              <span className="hidden text-sm text-muted sm:block">
                {edition.itemCount} {t("blog.stories")}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
