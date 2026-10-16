import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { partnerLogos } from "@/data/partners";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Client and partner logos, still and all visible at once: a scrolling strip
 * hides half of them at any moment, and these are names worth reading.
 */
export default function Clients() {
  const { t } = useLanguage();
  return (
    <Section tone="light" className="border-t border-line">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={t("cli.eyebrow")} title={t("cli.title")} brand="aftech" />
        </div>
        {partnerLogos.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted lg:col-span-8">{t("cli.empty")}</p>
        ) : (
          <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-4 lg:col-span-8">
            {partnerLogos.map((logo) => (
              <li key={logo.src} className="flex h-24 items-center justify-center border-b border-r border-line bg-white px-6">
                <img
                  src={logo.src}
                  alt={logo.name}
                  title={logo.name}
                  loading="lazy"
                  className="max-h-10 w-auto max-w-[130px] object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
