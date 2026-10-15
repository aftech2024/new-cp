import { Link } from "react-router-dom";
import LinkArrow from "@/components/ui/LinkArrow";
import { formatEditionDate, type BlogIndexEntry } from "@/data/blog";
import { useLanguage } from "@/i18n/LanguageContext";

export default function EditionCard({ edition }: { edition: BlogIndexEntry }) {
  const { t, lang } = useLanguage();
  return (
    <article className="flex flex-col gap-3 border-t border-line py-8">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-aftech-teal">
        {edition.categories.map((c) => t(`blog.cat.${c}`)).join(" · ")}
      </span>
      <h3 className="font-display text-xl font-bold md:text-2xl">
        <Link to={`/blog/${edition.slug}`} className="transition-colors hover:text-aftech-teal">
          {edition.title}
        </Link>
      </h3>
      <p className="text-muted">{edition.description}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted">
          {formatEditionDate(edition.date, lang)} · {edition.itemCount} {t("blog.stories")}
        </span>
        <LinkArrow to={`/blog/${edition.slug}`}>{t("blog.read")}</LinkArrow>
      </div>
    </article>
  );
}
