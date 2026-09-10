import Seo from "@/components/Seo";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t("nf.seo.title")} description={t("nf.seo.desc")} path="/404" />
      <div className="min-h-[80vh] flex items-center bg-deep-navy text-white">
        <Container className="flex flex-col items-start gap-8">
          <span className="font-display text-sm text-teal-bright tracking-[0.2em] uppercase">404</span>
          <h1 className="font-display font-extrabold text-[clamp(40px,6vw,80px)] leading-[1.02] max-w-2xl">
            {t("nf.title")}
          </h1>
          <Button to="/">{t("nf.back")}</Button>
        </Container>
      </div>
    </>
  );
}
