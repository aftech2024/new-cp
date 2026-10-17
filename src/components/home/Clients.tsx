import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { partnerLogos, type PartnerLogo } from "@/data/partners";
import { useLanguage } from "@/i18n/LanguageContext";

const ADVANCE_MS = 4500;

/** Four logos per slide; two on phones, so each one stays large enough to read. */
function useLogosPerSlide() {
  const [perSlide, setPerSlide] = useState(4);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const update = () => setPerSlide(query.matches ? 4 : 2);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return perSlide;
}

/**
 * Logos come in every shape, from a long wordmark to a square badge. Sizing
 * each by the square root of its aspect ratio gives them roughly equal area,
 * so a wide wordmark doesn't shout over a compact mark. `--logo-k` (set on the
 * track per breakpoint) is the height of a square logo.
 */
function Logo({ logo }: { logo: PartnerLogo }) {
  const [scale, setScale] = useState(0.6);
  return (
    <img
      src={logo.src}
      alt={logo.name}
      title={logo.name}
      onLoad={(e) => {
        const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
        if (w && h) setScale(1 / Math.sqrt(w / h));
      }}
      style={{ "--logo-s": scale } as CSSProperties}
      className="h-[clamp(20px,calc(var(--logo-k)*var(--logo-s)),80px)] w-auto max-w-full object-contain"
    />
  );
}

/**
 * Client and partner logos in one row, a slide of four at a time, in their
 * own colours. The row moves on by itself, stops while a pointer or keyboard
 * focus is on it, and stays put for anyone who has asked for reduced motion;
 * the arrows on either side move it by hand.
 */
export default function Clients() {
  const { t } = useLanguage();
  const perSlide = useLogosPerSlide();
  const slides = useMemo(() => {
    const groups: PartnerLogo[][] = [];
    for (let i = 0; i < partnerLogos.length; i += perSlide) groups.push(partnerLogos.slice(i, i + perSlide));
    return groups;
  }, [perSlide]);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const current = Math.min(slide, Math.max(count - 1, 0));

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setSlide((current + 1) % count), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [current, paused, count]);

  const go = (to: number) => setSlide((to + count) % count);

  const arrowClass =
    "flex h-10 w-8 shrink-0 items-center justify-center text-ink/25 transition-colors hover:text-ink/70 sm:w-10";

  return (
    <Section tone="light" className="border-t border-line">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow={t("cli.eyebrow")} title={t("cli.title")} brand="aftech" />

        {partnerLogos.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">{t("cli.empty")}</p>
        ) : (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t("cli.title")}
            className="flex items-center gap-2 [--logo-k:56px] sm:gap-6 sm:[--logo-k:64px] lg:[--logo-k:72px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {count > 1 && (
              <button type="button" onClick={() => go(current - 1)} aria-label={t("cli.prev")} className={arrowClass}>
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}
            <div className="min-w-0 flex-1 overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-premium"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {slides.map((group, i) => (
                  <div
                    key={i}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${t("cli.slide")} ${i + 1} / ${count}`}
                    aria-hidden={i !== current}
                    className="w-full shrink-0"
                  >
                    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-10">
                      {group.map((logo) => (
                        <li key={logo.src} className="flex h-24 items-center justify-center sm:h-28">
                          <Logo logo={logo} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            {count > 1 && (
              <button type="button" onClick={() => go(current + 1)} aria-label={t("cli.next")} className={arrowClass}>
                <ChevronRight className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
