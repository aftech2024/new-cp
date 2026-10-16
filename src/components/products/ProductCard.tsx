import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { staggerItem } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Product } from "@/data/products";

/**
 * A product on /products. Products with their own page get the wide layout
 * and a link to it; the rest point to their case study (or app) for now.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const hasPage = Boolean(product.page);
  const style = { "--accent": product.accent } as CSSProperties;

  const visual = product.cover ? (
    <img
      src={product.cover}
      alt=""
      loading="lazy"
      className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-deep-navy">
      <div className="pointer-events-none absolute inset-0 blueprint-dark" aria-hidden="true" />
      <span className="relative font-display text-3xl font-bold text-white/90">{product.shortName}</span>
    </div>
  );

  if (hasPage) {
    return (
      <motion.article
        variants={staggerItem}
        style={style}
        className="group relative grid overflow-hidden rounded-2xl bg-deep-navy text-white ring-1 ring-[rgb(var(--accent)/0.35)] lg:col-span-2 lg:grid-cols-12"
      >
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[rgb(var(--accent)/0.2)] blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 p-8 md:p-10 lg:col-span-5">
          <span className="flex items-center gap-2.5">
            <span className="rounded-full bg-[rgb(var(--accent))] px-2 py-0.5 font-mono text-[11px] font-bold text-deep-navy">
              {product.shortName}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">{product.category[lang]}</span>
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight">{product.name}</h2>
          <p className="leading-relaxed text-white/70">{product.tagline[lang]}</p>
          <Link
            to={`/products/${product.slug}`}
            className="mt-auto inline-flex w-fit items-center gap-2 rounded-pro bg-white px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-deep-navy transition-colors hover:bg-[rgb(var(--accent))]"
          >
            {t("prod.card.view")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="relative min-h-[240px] overflow-hidden lg:col-span-7 lg:min-h-[360px]">
          <div className="absolute inset-0 lg:inset-y-8 lg:left-0 lg:right-[-2rem] lg:overflow-hidden lg:rounded-l-xl lg:ring-1 lg:ring-white/10">
            {visual}
          </div>
        </div>
      </motion.article>
    );
  }

  const link = product.caseStudy
    ? { to: `/projects/${product.caseStudy}`, label: t("prod.card.caseStudy") }
    : product.appUrl
      ? { href: product.appUrl, label: t("prod.card.app") }
      : null;

  return (
    <motion.article
      variants={staggerItem}
      style={style}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow duration-300 hover:shadow-card"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line">{visual}</div>
      <div className="flex flex-1 flex-col gap-3 p-7">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))]" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{product.category[lang]}</span>
        </span>
        <h2 className="font-display text-xl font-bold">{product.name}</h2>
        <p className="leading-relaxed text-muted">{product.tagline[lang]}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="rounded-full bg-off-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted ring-1 ring-line">
            {t("prod.card.soon")}
          </span>
          {link &&
            ("to" in link ? (
              <Link to={link.to!} className="inline-flex items-center gap-1.5 text-sm font-semibold text-aftech hover:underline">
                {link.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-aftech hover:underline"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
        </div>
      </div>
    </motion.article>
  );
}
