import { useState, type CSSProperties } from "react";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Seo from "@/components/Seo";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
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

/**
 * Product landing page. The story runs problem, flow, proof (the module tour),
 * fit, price, questions, then the demo request, which is also where the page
 * ends: dark sections only open and close it.
 */
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

      {/* highlights: the four facts that set the product apart, read as one spec row */}
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
                className={`flex flex-col gap-1 py-7 lg:px-8 lg:py-9 ${i % 2 === 1 ? "border-l border-line pl-5" : "pr-5"} ${
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

      {/* before / after: each row pairs a problem with what changes, so they are read side by side */}
      <Section>
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t("prod.compare.eyebrow")} title={page.compare.title[lang]} />
          </div>
          <div className="lg:col-span-8">
            <div className="hidden grid-cols-2 gap-10 border-b border-ink pb-3 md:grid">
              <p className="text-sm font-semibold text-muted">
                {t("prod.compare.without")} {product.shortName}
              </p>
              <p className="text-sm font-semibold text-ink">
                {t("prod.compare.with")} {product.shortName}
              </p>
            </div>
            <motion.ol variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              {page.compare.before.map((before, i) => {
                const after = page.compare.after[i];
                return (
                  <motion.li
                    key={before.en}
                    variants={staggerItem}
                    className="grid gap-3 border-b border-line py-6 md:grid-cols-2 md:gap-10"
                  >
                    <p className="flex gap-4 text-muted">
                      <span className="font-mono text-xs leading-7 text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="mb-1 block text-xs font-semibold text-muted md:hidden">
                          {t("prod.compare.without")} {product.shortName}
                        </span>
                        {before[lang]}
                      </span>
                    </p>
                    {after && (
                      <p className="flex gap-4 font-medium text-ink md:pl-0">
                        <span className="font-mono text-xs leading-7 text-transparent md:hidden" aria-hidden="true">
                          00
                        </span>
                        <span>
                          <span className="mb-1 block text-xs font-semibold text-ink md:hidden">
                            {t("prod.compare.with")} {product.shortName}
                          </span>
                          {after[lang]}
                        </span>
                      </p>
                    )}
                  </motion.li>
                );
              })}
            </motion.ol>
          </div>
        </Container>
      </Section>

      <ProductFlow flow={page.flow} />

      <ModuleTour product={product} page={page} />

      {/* who it is for: three audiences as an editorial list, not icon cards */}
      <section className="bg-white py-20 md:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow={t("prod.personas.eyebrow")} title={page.personasTitle[lang]} />
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-10 md:grid-cols-3 md:gap-0"
          >
            {page.personas.map((persona, i) => (
              <motion.li
                key={persona.title.en}
                variants={staggerItem}
                className={`flex flex-col gap-3 border-t border-ink pt-6 md:pr-8 ${i > 0 ? "md:pl-8" : ""}`}
              >
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-xl font-bold">{persona.title[lang]}</h3>
                <p className="leading-relaxed text-muted">{persona.text[lang]}</p>
              </motion.li>
            ))}
          </motion.ul>
        </Container>
      </section>

      <PricingTable
        pricing={page.pricing}
        onChoose={(tier) => {
          setPlan(tier);
          bookDemo();
        }}
      />

      {/* FAQ sits before the demo form, so questions are answered before someone books */}
      <section className="bg-white py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t("prod.faq.eyebrow")} title={t("prod.faq.title")} />
          </div>
          <div className="flex flex-col divide-y divide-line border-y border-line lg:col-span-8">
            {page.faq.map((item) => (
              <details key={item.question.en} className="group py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-pro py-4 font-display text-lg font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aftech [&::-webkit-details-marker]:hidden">
                  {item.question[lang]}
                  <Plus className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="pb-5 pr-10 leading-relaxed text-muted">{item.answer[lang]}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <DemoRequestForm product={product} page={page} plan={plan} />
    </div>
  );
}
