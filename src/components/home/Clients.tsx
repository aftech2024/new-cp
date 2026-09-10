import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Marquee from "@/components/ui/Marquee";
import { partnerLogos } from "@/data/partners";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Clients() {
  const { t } = useLanguage();
  return (
    <Section tone="tint" className="overflow-hidden border-t border-aftech/10">
      <Container className="relative flex flex-col gap-10">
        <SectionHeading
          align="center"
          eyebrow={t("cli.eyebrow")}
          title={t("cli.title")}
          brand="aftech"
        />
        {partnerLogos.length === 0 ? (
          <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-muted">
            {t("cli.empty")}
            <span className="mt-1 block font-mono text-[11px] text-muted/70">
              Taruh file logo di src/assets/images/partner/
            </span>
          </p>
        ) : (
          <Marquee className="py-2">
            {partnerLogos.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.name}
                title={logo.name}
                loading="lazy"
                className="h-11 w-auto max-w-[170px] shrink-0 object-contain opacity-60 mix-blend-multiply grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-14"
              />
            ))}
          </Marquee>
        )}
      </Container>
    </Section>
  );
}
