import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BrowserFrame from "./BrowserFrame";
import { fadeUp } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Product, ProductPage } from "@/data/products";

/**
 * Product name and promise on the left, the real app on the right with its key
 * facts annotated beneath it like a figure on a drawing sheet. The blueprint
 * grid is the site's engineering-drawing motif and appears in this hero only.
 */
export default function ProductHero({
  product,
  page,
  onDemo,
  onPricing,
}: {
  product: Product;
  page: ProductPage;
  onDemo: () => void;
  onPricing: () => void;
}) {
  const { lang, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-deep-navy pt-32 text-white md:pt-40">
      <div className="pointer-events-none absolute inset-0 blueprint-dark" aria-hidden="true" />

      <Container className="relative">
        <Breadcrumb
          items={[{ label: t("com.home"), to: "/" }, { label: t("nav.products"), to: "/products" }, { label: product.shortName }]}
        />

        <div className="mt-10 grid items-start gap-14 pb-20 lg:grid-cols-12 lg:gap-10 lg:pb-28">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-7 lg:col-span-5 lg:pt-6">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-lg font-semibold text-white">{product.name}</span>
              <span className="text-sm text-white/60">{product.category[lang]}</span>
            </p>
            <span className="h-0.5 w-12 bg-[rgb(var(--accent))]" aria-hidden="true" />

            <h1 className="font-display font-extrabold leading-[1.02] tracking-[-0.02em] text-[clamp(36px,4.4vw,60px)]">
              {page.headline[lang]}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/70 md:text-lg">{page.intro[lang]}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button onClick={onDemo} withArrow={false}>
                {t("prod.cta.demo")}
              </Button>
              <Button onClick={onPricing} variant="ghost-light" withArrow={false}>
                {t("prod.cta.pricing")}
              </Button>
            </div>
            {product.appUrl && (
              <a
                href={product.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-1.5 text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {t("prod.cta.login")}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-7 lg:-mr-16 xl:-mr-32"
          >
            <BrowserFrame host={product.appHost}>
              <img
                src={page.heroImage}
                alt={`${product.name}, ${page.modules[0]?.name[lang] ?? ""}`}
                width={2400}
                height={1326}
                loading="eager"
                className="block w-full"
              />
            </BrowserFrame>

            {/* the screenshot bleeds past the container; the caption stays inside it */}
            <figcaption className="lg:pr-16 xl:pr-32">
              <ol className="mt-6 grid gap-x-8 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-3">
                {page.heroBadges.map((badge, i) => (
                  <li key={badge.value.en} className="flex gap-3">
                    <span className="font-mono text-xs text-white/60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-[15px] font-bold leading-tight text-white">{badge.value[lang]}</span>
                      <span className="text-sm leading-snug text-white/60">{badge.label[lang]}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </figcaption>
          </motion.figure>
        </div>
      </Container>
    </section>
  );
}
