import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import BrowserFrame from "./BrowserFrame";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Product, ProductPage } from "@/data/products";

const STEP_MS = 7000;

/**
 * Module tabs beside a screenshot that changes with them. It advances on its
 * own (the active tab's bar shows the timing) until the visitor picks a tab;
 * hovering or focusing pauses it, and it stays put for reduced motion.
 */
export default function ModuleTour({ product, page }: { product: Product; page: ProductPage }) {
  const { lang, t } = useLanguage();
  const modules = page.modules;
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
  }, []);

  // On narrow screens the tabs scroll sideways; keep the active one in view
  // without moving the page itself.
  useEffect(() => {
    const list = tabsRef.current;
    const tab = list?.children[index] as HTMLElement | undefined;
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - 24, behavior: "smooth" });
  }, [index]);

  const active = modules[index];
  const pick = (i: number) => {
    setIndex(i);
    setAuto(false);
  };

  return (
    <Section tone="tint" className="overflow-hidden">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow={t("prod.tour.eyebrow")} title={page.modulesTitle[lang]} />

        <div
          className="grid gap-8 lg:grid-cols-12 lg:gap-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            ref={tabsRef}
            role="tablist"
            aria-label={t("prod.tour.eyebrow")}
            aria-orientation="vertical"
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {modules.map((m, i) => {
              const selected = i === index;
              return (
                <button
                  key={m.name.en}
                  type="button"
                  role="tab"
                  id={`tour-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="tour-panel"
                  onClick={() => pick(i)}
                  className={`relative shrink-0 overflow-hidden rounded-md border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aftech lg:px-5 lg:py-4 ${
                    selected ? "border-ink/15 bg-white" : "border-transparent text-ink/70 hover:bg-white/60 hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs font-semibold ${selected ? "text-ink" : "text-muted"}`}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="whitespace-nowrap font-display font-bold lg:whitespace-normal">{m.name[lang]}</span>
                  </span>
                  {selected && (
                    <span className="mt-2 hidden text-sm leading-relaxed text-muted lg:block">{m.summary[lang]}</span>
                  )}
                  {selected && auto && (
                    <span
                      key={index}
                      aria-hidden="true"
                      className="tour-progress absolute inset-x-0 bottom-0 h-0.5 bg-[rgb(var(--accent))]"
                      style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() => setIndex((i) => (i + 1) % modules.length)}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${index}`} className="lg:col-span-8">
            <BrowserFrame host={product.appHost}>
              <div className="relative aspect-[2400/1326] bg-off-white">
                {modules.map((m, i) => (
                  <img
                    key={m.name.en}
                    src={m.image}
                    alt={i === index ? `${product.shortName}, ${m.name[lang]}` : ""}
                    aria-hidden={i !== index}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
                      i === index ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
            </BrowserFrame>

            <p className="mt-6 text-muted lg:hidden">{active.summary[lang]}</p>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
              {active.points.map((point) => (
                <li key={point.en} className="flex items-start gap-2.5 border-t border-ink/15 pt-3 text-sm font-medium text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-aftech" aria-hidden="true" />
                  {point[lang]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
