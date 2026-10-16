import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Minus } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { planLabel, YEARLY_MONTHS, type Pricing, type PricingTier } from "@/data/products";

type Billing = "monthly" | "yearly";

const rupiah = (amount: number) => new Intl.NumberFormat("id-ID").format(Math.round(amount));

/** Monthly-equivalent price for the chosen billing period. */
function perMonth(tier: PricingTier, billing: Billing): number | null {
  if (tier.monthly === null) return null;
  return billing === "yearly" ? (tier.monthly * YEARLY_MONTHS) / 12 : tier.monthly;
}

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

  return (
    <Section id="pricing" tone="tint" className="scroll-mt-24 overflow-hidden">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading eyebrow={t("prod.pricing.eyebrow")} title={t("prod.pricing.title")} description={t("prod.pricing.desc")} align="center" />

        <div
          role="radiogroup"
          aria-label={t("prod.pricing.billing")}
          className="inline-flex items-center rounded-full bg-white p-1 shadow-pro ring-1 ring-line"
        >
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={billing === b}
              onClick={() => setBilling(b)}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
                billing === b ? "text-white" : "text-ink/65 hover:text-ink"
              }`}
            >
              {billing === b && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-full bg-deep-navy"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {t(`prod.pricing.${b}`)}
                {b === "yearly" && (
                  <span className="rounded-full bg-[rgb(var(--accent))] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-deep-navy">
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
          className="grid w-full gap-6 pt-2 lg:grid-cols-3"
        >
          {pricing.tiers.map((tier) => {
            const featured = Boolean(tier.featured);
            const price = perMonth(tier, billing);
            const muted = featured ? "text-white/60" : "text-muted";
            return (
              <motion.div
                key={tier.name.en}
                variants={staggerItem}
                className={`relative flex flex-col rounded-2xl p-7 lg:p-8 ${
                  featured
                    ? "bg-deep-navy text-white shadow-[0_40px_90px_-40px_rgba(4,17,29,0.85)] ring-2 ring-[rgb(var(--accent))]"
                    : "bg-white shadow-pro ring-1 ring-line"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[rgb(var(--accent))] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-deep-navy">
                    {t("prod.pricing.popular")}
                  </span>
                )}

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
                      <span className="block font-display text-[40px] font-bold leading-none tracking-tight">
                        {tier.customPrice?.[lang]}
                      </span>
                      <p className={`mt-2.5 text-xs ${muted}`}>{t("prod.pricing.customSub")}</p>
                    </>
                  )}
                </div>

                <Button
                  onClick={() => onChoose(planLabel(tier, lang, billingLabel))}
                  variant={featured ? "primary" : tier.monthly === null ? "dark" : "secondary"}
                  className="mt-6 w-full"
                >
                  {tier.cta[lang]}
                </Button>

                <dl
                  className={`mt-7 divide-y rounded-xl text-sm ring-1 ${
                    featured ? "divide-white/10 bg-white/[0.04] ring-white/10" : "divide-line bg-off-white ring-line"
                  }`}
                >
                  {tier.limits.map((limit) => (
                    <div key={limit.label.en} className="flex items-center justify-between gap-4 px-4 py-2.5">
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
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-[rgb(var(--accent))]" : "text-aftech"}`}
                          aria-hidden="true"
                        />
                        <span className={featured ? "text-white/85" : "text-ink/85"}>{feature[lang]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted">
          {pricing.notes.map((note) => (
            <li key={note.en} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-aftech" aria-hidden="true" />
              {note[lang]}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setCompareOpen((v) => !v)}
          aria-expanded={compareOpen}
          aria-controls="pricing-compare"
          className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink shadow-pro transition-colors hover:border-ink/30"
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
              <div className="overflow-x-auto rounded-2xl bg-white shadow-pro ring-1 ring-line">
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
                            className={`px-4 py-5 text-center align-bottom ${tier.featured ? "bg-[rgb(var(--accent)/0.1)]" : ""}`}
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
                          className="bg-off-white px-6 py-3 text-left font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
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
                              className={`px-4 py-3.5 text-center ${pricing.tiers[i]?.featured ? "bg-[rgb(var(--accent)/0.06)]" : ""}`}
                            >
                              {value === true ? (
                                <>
                                  <Check className="mx-auto h-4 w-4 text-aftech" aria-hidden="true" />
                                  <span className="sr-only">{t("prod.pricing.included")}</span>
                                </>
                              ) : value === false ? (
                                <>
                                  <Minus className="mx-auto h-4 w-4 text-ink/20" aria-hidden="true" />
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
      </Container>
    </Section>
  );
}
