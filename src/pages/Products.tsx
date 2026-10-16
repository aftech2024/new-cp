import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ProductCard from "@/components/products/ProductCard";
import CtaSection from "@/components/home/CtaSection";
import { products } from "@/data/products";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Products() {
  const { t } = useLanguage();
  // Products with their own page lead the list.
  const ordered = [...products].sort((a, b) => Number(Boolean(b.page)) - Number(Boolean(a.page)));

  return (
    <>
      <Seo title={t("prod.hub.seo.title")} description={t("prod.hub.seo.desc")} path="/products" />
      <PageHero
        eyebrow={t("prod.hub.eyebrow")}
        title={t("prod.hub.title")}
        description={t("prod.hub.desc")}
        breadcrumb={[{ label: t("com.home"), to: "/" }, { label: t("nav.products") }]}
      />
      <Section>
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-6 lg:grid-cols-2"
          >
            {ordered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </motion.div>
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}
