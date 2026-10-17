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
      className="h-[clamp(22px,calc(var(--logo-k)*var(--logo-s)),88px)] w-auto max-w-full object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
    />
  );
}

/**
 * Client and partner logos in one row, a slide of four at a time. The row
 * moves on by itself, stops while a pointer or keyboard focus is on it, and
 * stays put for anyone who has asked for reduced motion; the arrows and the
 * slide markers move it by hand.
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

  return (
    <Section tone="light" className="border-t border-line">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={t("cli.eyebrow")} title={t("cli.title")} brand="aftech" />
          {count > 1 && (
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${t("cli.slide")} ${i + 1} / ${count}`}
                    aria-current={i === current}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "w-6 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/50"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(current - 1)}
                  aria-label={t("cli.prev")}
                  className="flex h-10 w-10 items-center justify-center rounded-pro border border-line text-ink transition-colors hover:border-aftech-strong hover:text-aftech-strong"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(current + 1)}
                  aria-label={t("cli.next")}
                  className="flex h-10 w-10 items-center justify-center rounded-pro border border-line text-ink transition-colors hover:border-aftech-strong hover:text-aftech-strong"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        {partnerLogos.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">{t("cli.empty")}</p>
        ) : (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t("cli.title")}
            className="overflow-hidden [--logo-k:62px] sm:[--logo-k:76px] lg:[--logo-k:92px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div
              className="flex transition-transform duration-700 ease-premium"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((group, i) => (
                <div
                  key={i}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${count}`}
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
        )}
      </Container>
    </Section>
  );
}
