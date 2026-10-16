import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BrowserFrame from "./BrowserFrame";
import { fadeUp } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Product, ProductPage } from "@/data/products";

// Where each badge sits on the screenshot's edges on large screens, clear of the figures.
const BADGE_SPOTS = [
  "lg:absolute lg:-left-12 lg:top-[56%]",
  "lg:absolute lg:-bottom-10 lg:left-[20%]",
  "lg:absolute lg:-bottom-10 lg:right-[14%] xl:right-[30%]",
];

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
    <section className="relative overflow-hidden bg-deep-navy pt-32 pb-24 text-white md:pt-40 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 blueprint-dark" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 right-[-12%] h-[620px] w-[620px] rounded-full bg-[rgb(var(--accent)/0.2)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 left-[-14%] h-[480px] w-[480px] rounded-full bg-aftech/20 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <Breadcrumb
          items={[{ label: t("com.home"), to: "/" }, { label: t("nav.products"), to: "/products" }, { label: product.shortName }]}
        />

        <div className="mt-10 grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-6 lg:col-span-5">
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-4 backdrop-blur-sm">
              <span className="rounded-full bg-[rgb(var(--accent))] px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide text-deep-navy">
                {product.shortName}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">{product.category[lang]}</span>
            </span>

            <h1 className="font-display font-extrabold leading-[1.02] tracking-[-0.02em] text-[clamp(36px,4.6vw,62px)]">
              {page.headline[lang]}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/70 md:text-lg">{page.intro[lang]}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={onDemo}>{t("prod.cta.demo")}</Button>
              <Button onClick={onPricing} variant="ghost-light" withArrow={false}>
                {t("prod.cta.pricing")}
              </Button>
            </div>
            {product.appUrl && (
              <a
                href={product.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
              >
                {t("prod.cta.login")}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-7 lg:-mr-24 xl:-mr-48"
          >
            <BrowserFrame host={product.appHost}>
              <img
                src={page.heroImage}
                alt={`${product.name} — ${page.modules[0]?.name[lang] ?? ""}`}
                width={2400}
                height={1328}
                loading="eager"
                className="block w-full"
              />
            </BrowserFrame>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:block">
              {page.heroBadges.map((badge, i) => (
                <motion.li
                  key={badge.value.en}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className={`${BADGE_SPOTS[i] ?? ""} lg:max-w-[250px]`}
                >
                  <div
                    className="product-float flex items-start gap-3 rounded-lg bg-white/95 px-4 py-3 text-ink shadow-[0_18px_40px_-16px_rgba(4,17,29,0.6)] ring-1 ring-ink/5 backdrop-blur"
                    style={{ animationDelay: `${i * -2}s` }}
                  >
                    <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-[rgb(var(--accent))]" aria-hidden="true" />
                    <span className="flex flex-col">
                      <span className="font-display text-[15px] font-bold leading-tight">{badge.value[lang]}</span>
                      <span className="mt-0.5 text-xs leading-snug text-muted">{badge.label[lang]}</span>
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
