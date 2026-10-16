import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Minus } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { isQuoteOnly, planLabel, YEARLY_MONTHS, type Pricing, type PricingTier } from "@/data/products";

type Billing = "monthly" | "yearly";

const rupiah = (amount: number) => new Intl.NumberFormat("id-ID").format(Math.round(amount));

/** Monthly-equivalent price for the chosen billing period. */
function perMonth(tier: PricingTier, billing: Billing): number | null {
  if (tier.monthly === null) return null;
  return billing === "yearly" ? (tier.monthly * YEARLY_MONTHS) / 12 : tier.monthly;
}

/**
 * Plans with published prices, or a single sales-quoted offer when none has a
 * price. The featured plan is set dark because it is the one built for the
 * page's main audience (teams running several projects or entities); it
 * carries no popularity badge, since there is no sales data behind one.
 */
export default function PricingTable({
  pricing,
  onChoose,
}: {
  pricing: Pricing;
  /** Called with the plan label (tier and billing period) so the demo form can note it. */
  onChoose: (plan: string) => void;
}) {
  const { lang, t } = useLanguage();
  const [billing, setBilling] = useState<Billing>("yearly");
  const [compareOpen, setCompareOpen] = useState(false);
  const billingLabel = t(`prod.pricing.${billing}`);
  const quoteOnly = isQuoteOnly(pricing);

  return (
    <Section id="pricing" tone="tint" className="scroll-mt-24 overflow-hidden">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading
          eyebrow={t("prod.pricing.eyebrow")}
          title={t(quoteOnly ? "prod.pricing.quoteTitle" : "prod.pricing.title")}
          description={t(quoteOnly ? "prod.pricing.quoteDesc" : "prod.pricing.desc")}
          align="center"
        />

        {quoteOnly ? (
          pricing.tiers.map((tier) => <QuoteOffer key={tier.name.en} tier={tier} onChoose={onChoose} />)
        ) : (
          <>
            <div
              role="radiogroup"
              aria-label={t("prod.pricing.billing")}
              className="inline-flex items-center rounded-pro bg-white p-1 ring-1 ring-line"
            >
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  role="radio"
                  aria-checked={billing === b}
                  onClick={() => setBilling(b)}
                  className={`relative rounded-[3px] px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
                    billing === b ? "text-white" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {billing === b && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-[3px] bg-deep-navy"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {t(`prod.pricing.${b}`)}
                    {b === "yearly" && (
                      <span
                        className={`rounded-[3px] px-1.5 py-0.5 text-[11px] font-semibold ${
                          billing === b ? "bg-white/15 text-white" : "bg-aftech-ice text-primary-navy"
                        }`}
                      >
                        {t("prod.pricing.save")}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid w-full gap-5 lg:grid-cols-3"
            >
              {pricing.tiers.map((tier) => {
                const featured = Boolean(tier.featured);
                const price = perMonth(tier, billing);
                const muted = featured ? "text-white/65" : "text-muted";
                return (
                  <motion.div
                    key={tier.name.en}
                    variants={staggerItem}
                    className={`flex flex-col rounded-xl p-7 lg:p-8 ${featured ? "bg-deep-navy text-white" : "bg-white ring-1 ring-line"}`}
                  >
                    <h3 className="font-display text-xl font-bold">{tier.name[lang]}</h3>
                    <p className={`mt-2 text-sm leading-relaxed lg:min-h-[4.5rem] ${muted}`}>{tier.description[lang]}</p>

                    <div className="mt-6 lg:min-h-[88px]">
                      {price !== null && tier.monthly !== null ? (
                        <>
                          <div className="flex items-end gap-2">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={billing}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="font-display text-[40px] font-bold leading-none tracking-tight tabular-nums"
                              >
                                <span className="mr-1 align-top text-lg font-semibold">Rp</span>
                                {rupiah(price)}
                              </motion.span>
                            </AnimatePresence>
                            <span className={`pb-1 text-sm ${muted}`}>{t("prod.pricing.perMonth")}</span>
                          </div>
                          <p className={`mt-2.5 text-xs ${muted}`}>
                            {billing === "yearly" ? (
                              <>
                                <span className="mr-1.5 line-through opacity-70">Rp {rupiah(tier.monthly)}</span>
                                {t("prod.pricing.billedYearlyA")} Rp {rupiah(tier.monthly * YEARLY_MONTHS)} {t("prod.pricing.billedYearlyB")}
                              </>
                            ) : (
                              t("prod.pricing.billedMonthly")
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="block font-display text-[40px] font-bold leading-none tracking-tight">{tier.customPrice?.[lang]}</span>
                          <p className={`mt-2.5 text-xs ${muted}`}>{tier.customNote?.[lang] ?? t("prod.pricing.customSub")}</p>
                        </>
                      )}
                    </div>

                    <Button
                      onClick={() => onChoose(planLabel(tier, lang, billingLabel))}
                      variant={featured ? "primary" : tier.monthly === null ? "dark" : "secondary"}
                      withArrow={false}
                      className="mt-6 w-full"
                    >
                      {tier.cta[lang]}
                    </Button>

                    <dl className={`mt-7 divide-y text-sm ${featured ? "divide-white/10 border-y border-white/10" : "divide-line border-y border-line"}`}>
                      {tier.limits.map((limit) => (
                        <div key={limit.label.en} className="flex items-center justify-between gap-4 py-2.5">
                          <dt className={muted}>{limit.label[lang]}</dt>
                          <dd className="text-right font-semibold">{limit.value[lang]}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-7 flex-1">
                      {tier.includesFrom && <p className="mb-3 text-sm font-semibold">{tier.includesFrom[lang]}</p>}
                      <ul className="flex flex-col gap-2.5 text-sm">
                        {tier.features.map((feature) => (
                          <li key={feature.en} className="flex items-start gap-3">
                            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-aftech-bright" : "text-aftech"}`} aria-hidden="true" />
                            <span className={featured ? "text-white/85" : "text-ink/85"}>{feature[lang]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted">
          {pricing.notes.map((note) => (
            <li key={note.en} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-aftech" aria-hidden="true" />
              {note[lang]}
            </li>
          ))}
        </ul>

        {pricing.compare.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setCompareOpen((v) => !v)}
              aria-expanded={compareOpen}
              aria-controls="pricing-compare"
              className="inline-flex items-center gap-2 rounded-pro border border-ink/20 bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/50"
            >
              {compareOpen ? t("prod.pricing.compareHide") : t("prod.pricing.compare")}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${compareOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            <AnimatePresence initial={false}>
              {compareOpen && (
                <motion.div
                  id="pricing-compare"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full overflow-hidden"
                >
                  <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-line">
                    <table className="w-full min-w-[680px] border-collapse text-sm">
                      <caption className="sr-only">{t("prod.pricing.compare")}</caption>
                      <thead>
                        <tr>
                          <th scope="col" className="sticky left-0 z-10 w-[38%] bg-white px-6 py-5 text-left font-display text-base font-bold">
                            {t("prod.pricing.feature")}
                          </th>
                          {pricing.tiers.map((tier) => {
                            const price = perMonth(tier, billing);
                            return (
                              <th
                                key={tier.name.en}
                                scope="col"
                                className={`px-4 py-5 text-center align-bottom ${tier.featured ? "bg-aftech-ice" : ""}`}
                              >
                                <span className="block font-display text-base font-bold">{tier.name[lang]}</span>
                                <span className="mt-1 block text-xs font-normal text-muted tabular-nums">
                                  {price !== null ? `Rp ${rupiah(price)} ${t("prod.pricing.perMonth")}` : tier.customPrice?.[lang]}
                                </span>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      {pricing.compare.map((group) => (
                        <tbody key={group.group.en}>
                          <tr>
                            <th
                              colSpan={pricing.tiers.length + 1}
                              scope="colgroup"
                              className="bg-off-white px-6 py-3 text-left text-xs font-semibold text-muted"
                            >
                              {group.group[lang]}
                            </th>
                          </tr>
                          {group.rows.map((row) => (
                            <tr key={row.label.en} className="border-t border-line">
                              <th scope="row" className="sticky left-0 z-10 bg-white px-6 py-3.5 text-left font-medium text-ink/80">
                                {row.label[lang]}
                              </th>
                              {row.values.map((value, i) => (
                                <td
                                  key={pricing.tiers[i]?.name.en ?? i}
                                  className={`px-4 py-3.5 text-center ${pricing.tiers[i]?.featured ? "bg-aftech-ice/50" : ""}`}
                                >
                                  {value === true ? (
                                    <>
                                      <Check className="mx-auto h-4 w-4 text-aftech" aria-hidden="true" />
                                      <span className="sr-only">{t("prod.pricing.included")}</span>
                                    </>
                                  ) : value === false ? (
                                    <>
                                      <Minus className="mx-auto h-4 w-4 text-ink/25" aria-hidden="true" />
                                      <span className="sr-only">{t("prod.pricing.notIncluded")}</span>
                                    </>
                                  ) : (
                                    <span className="font-semibold text-ink">{value[lang]}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      ))}
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Container>
    </Section>
  );
}

/** The single offer of a product sold only through a sales quote: no billing toggle, no comparison. */
function QuoteOffer({ tier, onChoose }: { tier: PricingTier; onChoose: (plan: string) => void }) {
  const { lang, t } = useLanguage();

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid w-full max-w-5xl overflow-hidden rounded-xl bg-white ring-1 ring-line lg:grid-cols-5"
    >
      <div className="flex flex-col gap-5 bg-deep-navy p-8 text-white lg:col-span-2 lg:p-10">
        <h3 className="font-display text-xl font-bold">{tier.name[lang]}</h3>
        <p className="text-sm leading-relaxed text-white/65">{tier.description[lang]}</p>
        <div className="mt-2">
          <span className="block font-display text-[40px] font-bold leading-none tracking-tight">{tier.customPrice?.[lang]}</span>
          <p className="mt-2.5 text-xs text-white/65">{tier.customNote?.[lang] ?? t("prod.pricing.customSub")}</p>
        </div>
        <Button onClick={() => onChoose(planLabel(tier, lang, ""))} withArrow={false} className="mt-auto w-full">
          {tier.cta[lang]}
        </Button>
      </div>

      <div className="flex flex-col gap-7 p-8 lg:col-span-3 lg:p-10">
        <dl className="divide-y divide-line border-y border-line text-sm">
          {tier.limits.map((limit) => (
            <div key={limit.label.en} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted">{limit.label[lang]}</dt>
              <dd className="text-right font-semibold">{limit.value[lang]}</dd>
            </div>
          ))}
        </dl>
        <div>
          {tier.includesFrom && <p className="mb-3 text-sm font-semibold">{tier.includesFrom[lang]}</p>}
          <ul className="grid gap-2.5 text-sm sm:grid-cols-2">
            {tier.features.map((feature) => (
              <li key={feature.en} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-aftech" aria-hidden="true" />
                <span className="text-ink/85">{feature[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
