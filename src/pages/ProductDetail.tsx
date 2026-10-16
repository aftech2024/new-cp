import { useState, type CSSProperties } from "react";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, X, Check } from "lucide-react";
import Seo from "@/components/Seo";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ProductHero from "@/components/products/ProductHero";
import ProductFlow from "@/components/products/ProductFlow";
import ModuleTour from "@/components/products/ModuleTour";
import PricingTable from "@/components/products/PricingTable";
import DemoRequestForm from "@/components/products/DemoRequestForm";
import { getProductBySlug } from "@/data/products";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const { lang, t } = useLanguage();
  const [plan, setPlan] = useState("");
  const product = getProductBySlug(slug);
  const page = product?.page;

  if (!product || !page) return <Navigate to="/products" replace />;

  const bookDemo = () => scrollToSection("demo");

  return (
    <div style={{ "--accent": product.accent } as CSSProperties}>
      <Seo title={page.seoTitle[lang]} description={page.seoDescription[lang]} path={`/products/${product.slug}`} />

      <ProductHero product={product} page={page} onDemo={bookDemo} onPricing={() => scrollToSection("pricing")} />

      {/* highlights strip */}
      <div className="border-b border-line bg-white">
        <Container>
          <motion.dl
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 lg:grid-cols-4"
          >
            {page.highlights.map((h, i) => (
              <motion.div
                key={h.value.en}
                variants={staggerItem}
                className={`flex flex-col gap-1 py-7 lg:px-8 lg:py-9 ${i % 2 === 1 ? "pl-5 border-l border-line" : "pr-5"} ${
                  i > 1 ? "border-t border-line lg:border-t-0" : ""
                } ${i > 0 ? "lg:border-l lg:border-line lg:pl-8" : "lg:pl-0"}`}
              >
                <dt className="order-2 text-sm text-muted">{h.label[lang]}</dt>
                <dd className="order-1 font-display text-xl font-bold text-ink">{h.value[lang]}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </Container>
      </div>

      {/* before / after */}
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow={t("prod.compare.eyebrow")} title={page.compare.title[lang]} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 ring-1 ring-line">
              <p className="spec-label text-muted">
                {t("prod.compare.without")} {product.shortName}
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {page.compare.before.map((item) => (
                  <li key={item.en} className="flex items-start gap-3 text-ink/70">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-200">
                      <X className="h-3 w-3 text-red-500" aria-hidden="true" />
                    </span>
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-deep-navy p-8 text-white ring-1 ring-[rgb(var(--accent)/0.4)]">
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[rgb(var(--accent)/0.18)] blur-3xl"
                aria-hidden="true"
              />
              <p className="spec-label relative text-[rgb(var(--accent))]">
                {t("prod.compare.with")} {product.shortName}
              </p>
              <ul className="relative mt-6 flex flex-col gap-4">
                {page.compare.after.map((item) => (
                  <li key={item.en} className="flex items-start gap-3 text-white/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--accent))]">
                      <Check className="h-3 w-3 text-deep-navy" aria-hidden="true" />
                    </span>
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <ProductFlow flow={page.flow} />

      <ModuleTour product={product} page={page} />

      {/* who it is for */}
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow={t("prod.personas.eyebrow")} title={page.personasTitle[lang]} />
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-6 md:grid-cols-3"
          >
            {page.personas.map((persona) => {
              const Icon = persona.icon;
              return (
                <motion.li
                  key={persona.title.en}
                  variants={staggerItem}
                  className="group flex flex-col gap-4 rounded-2xl bg-white p-8 ring-1 ring-line transition-shadow duration-300 hover:shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-deep-navy">
                    <Icon className="h-6 w-6 text-[rgb(var(--accent))]" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-bold">{persona.title[lang]}</h3>
                  <p className="leading-relaxed text-muted">{persona.text[lang]}</p>
                </motion.li>
              );
            })}
          </motion.ul>
        </Container>
      </Section>

      <PricingTable
        pricing={page.pricing}
        onChoose={(tier) => {
          setPlan(tier);
          bookDemo();
        }}
      />

      <DemoRequestForm product={product} page={page} plan={plan} />

      {/* FAQ */}
      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t("prod.faq.eyebrow")} title={t("prod.faq.title")} />
          </div>
          <div className="flex flex-col divide-y divide-line border-y border-line lg:col-span-8">
            {page.faq.map((item) => (
              <details key={item.question.en} className="group py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {item.question[lang]}
                  <Plus className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="pb-5 pr-10 leading-relaxed text-muted">{item.answer[lang]}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* closing */}
      <section className="relative overflow-hidden bg-deep-navy py-20 text-white md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_85%_50%,rgb(var(--accent)/0.22),transparent_70%)]"
          aria-hidden="true"
        />
        <Container className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-[clamp(28px,3.2vw,44px)]">
              {t("prod.close.title")}
            </h2>
            <p className="mt-4 text-white/65">{t("prod.close.desc")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={bookDemo}>{t("prod.cta.demo")}</Button>
            {product.appUrl && (
              <a
                href={product.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                {t("prod.cta.login")}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
