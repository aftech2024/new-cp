import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { staggerItem } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Product } from "@/data/products";

/**
 * One product on /products, as a numbered row of the catalogue. Rows alternate
 * the screenshot side so the list reads as an index, not a wall of cards; the
 * short accent rule under the name is the same mark the product page opens with.
 */
export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { lang, t } = useLanguage();
  const style = { "--accent": product.accent } as CSSProperties;
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const pageUrl = product.page ? `/products/${product.slug}` : null;

  const fallbackLink = product.caseStudy
    ? { to: `/projects/${product.caseStudy}`, label: t("prod.card.caseStudy") }
    : product.appUrl
      ? { href: product.appUrl, label: t("prod.card.app") }
      : null;

  const image = product.cover ? (
    <img
      src={product.cover}
      alt=""
      loading="lazy"
      className="aspect-[16/9] w-full object-cover object-left-top transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
    />
  ) : (
    <div className="flex aspect-[16/9] w-full items-center justify-center bg-primary-navy">
      <span className="font-display text-3xl font-bold text-white/90">{product.shortName}</span>
    </div>
  );

  return (
    <motion.li
      variants={staggerItem}
      style={style}
      className="group grid items-center gap-8 border-t border-line py-12 lg:grid-cols-12 lg:gap-14 lg:py-16"
    >
      <div className={`flex flex-col gap-4 lg:col-span-5 ${reversed ? "lg:order-2" : ""}`}>
        <span className="font-mono text-xs text-muted">{number}</span>
        <p className="text-sm text-muted">{product.category[lang]}</p>
        <h2 className="font-display font-extrabold leading-[1.08] tracking-[-0.01em] text-[clamp(26px,2.8vw,38px)]">
          {pageUrl ? (
            <Link to={pageUrl} className="rounded-pro hover:text-aftech focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aftech">
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h2>
        <span className="h-0.5 w-10 bg-[rgb(var(--accent))]" aria-hidden="true" />
        <p className="max-w-md text-base leading-relaxed text-muted md:text-lg">{product.tagline[lang]}</p>

        {pageUrl ? (
          <Link
            to={pageUrl}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-pro font-semibold text-aftech underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aftech"
          >
            {t("prod.card.view")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            <span className="sr-only">: {product.name}</span>
          </Link>
        ) : (
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-sm text-muted">{t("prod.card.soon")}</span>
            {fallbackLink &&
              ("to" in fallbackLink ? (
                <Link to={fallbackLink.to!} className="inline-flex items-center gap-1.5 text-sm font-semibold text-aftech hover:underline">
                  {fallbackLink.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <a
                  href={fallbackLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-aftech hover:underline"
                >
                  {fallbackLink.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
          </div>
        )}
      </div>

      <div className={`overflow-hidden rounded-xl ring-1 ring-line lg:col-span-7 ${reversed ? "lg:order-1" : ""}`}>
        {pageUrl ? (
          <Link to={pageUrl} tabIndex={-1} aria-hidden="true" className="block">
            {image}
          </Link>
        ) : (
          image
        )}
      </div>
    </motion.li>
  );
}
