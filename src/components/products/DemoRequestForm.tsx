import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import { planLabel, type Product, type ProductPage } from "@/data/products";

interface FormState {
  fullName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  format: "online" | "onsite";
  plan: string;
  notes: string;
  company_website: string; // honeypot — must stay empty
}

const EMPTY: FormState = {
  fullName: "",
  company: "",
  jobTitle: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  format: "online",
  plan: "",
  notes: "",
  company_website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact.php";
const TIME_SLOTS = ["09.00–12.00 WIB", "13.00–15.00 WIB", "15.00–17.00 WIB"];

/** Tomorrow as YYYY-MM-DD in the visitor's time zone: the earliest a demo can be booked. */
function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA");
}

/**
 * Demo request. The visitor proposes a date and time slot; the request is
 * emailed to the team (public/api/contact.php, kind "demo"), who confirm by
 * WhatsApp or email.
 */
export default function DemoRequestForm({
  product,
  page,
  plan,
}: {
  product: Product;
  page: ProductPage;
  /** Package picked in the pricing table, if any. */
  plan: string;
}) {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (plan) setForm((prev) => ({ ...prev, plan }));
  }, [plan]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = t("prod.form.errRequired");
    if (!form.company.trim()) next.company = t("prod.form.errRequired");
    if (!EMAIL_RE.test(form.email.trim())) next.email = t("prod.form.errEmail");
    if (form.phone.replace(/\D/g, "").length < 8) next.phone = t("prod.form.errPhone");
    if (!form.preferredDate || form.preferredDate < tomorrow()) next.preferredDate = t("prod.form.errDate");
    else if ([0, 6].includes(new Date(`${form.preferredDate}T12:00:00`).getDay())) next.preferredDate = t("prod.form.errWeekend");
    if (!form.preferredTime) next.preferredTime = t("prod.form.errRequired");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, kind: "demo", product: product.name }),
      });
      const data = await res.json().catch(() => null);
      setStatus(res.ok && data?.ok ? "success" : "error");
      if (res.ok && data?.ok) setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-[15px] text-ink shadow-sm placeholder:text-muted/70 focus:border-aftech outline-none transition-colors aria-[invalid=true]:border-red-400";
  const labelClass = "text-sm font-semibold text-ink";
  const field = (key: keyof FormState, label: string, input: ReactNode, hint?: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`demo-${key}`} className={labelClass}>
        {label}
      </label>
      {input}
      {errors[key] ? (
        <span id={`demo-${key}-error`} className="text-sm text-red-600">
          {errors[key]}
        </span>
      ) : (
        hint && <span className="text-xs text-muted">{hint}</span>
      )}
    </div>
  );
  const a11y = (key: keyof FormState) => ({
    id: `demo-${key}`,
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `demo-${key}-error` : undefined,
  });

  return (
    <Section tone="dark" id="demo" className="scroll-mt-24">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeading
            eyebrow={t("prod.demo.eyebrow")}
            title={`${t("prod.demo.titleA")} ${product.shortName} ${t("prod.demo.titleB")}`}
            description={t("prod.demo.desc")}
            tone="dark"
          />
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {[t("prod.demo.p0"), t("prod.demo.p1"), t("prod.demo.p2")].map((text, i) => (
              <li key={text} className="flex gap-4 py-4 text-white/80">
                <span className="font-mono text-xs leading-6 text-white/60">{String(i + 1).padStart(2, "0")}</span>
                {text}
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              {t("prod.demo.whatsapp")}
            </a>
            {product.appUrl && (
              <a
                href={product.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {t("prod.cta.login")}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 text-ink sm:p-8 lg:col-span-7">
          {status === "success" ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center" role="status">
              <CheckCircle2 className="h-12 w-12 text-aftech" />
              <p className="font-display text-xl font-bold">{t("prod.form.successTitle")}</p>
              <p className="max-w-sm text-muted">{t("prod.form.success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <input
                type="text"
                name="company_website"
                value={form.company_website}
                onChange={(e) => update("company_website", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                {field(
                  "fullName",
                  t("prod.form.name"),
                  <input {...a11y("fullName")} autoComplete="name" className={inputClass} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />,
                )}
                {field(
                  "company",
                  t("prod.form.company"),
                  <input {...a11y("company")} autoComplete="organization" className={inputClass} value={form.company} onChange={(e) => update("company", e.target.value)} />,
                )}
                {field(
                  "email",
                  t("prod.form.email"),
                  <input {...a11y("email")} type="email" autoComplete="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} />,
                )}
                {field(
                  "phone",
                  t("prod.form.phone"),
                  <input {...a11y("phone")} type="tel" autoComplete="tel" className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />,
                )}
                {field(
                  "jobTitle",
                  t("prod.form.jobTitle"),
                  <input {...a11y("jobTitle")} autoComplete="organization-title" className={inputClass} value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />,
                )}
                {field(
                  "plan",
                  t("prod.form.plan"),
                  <select {...a11y("plan")} className={inputClass} value={form.plan} onChange={(e) => update("plan", e.target.value)}>
                    <option value="">{t("prod.form.planUnsure")}</option>
                    {page.pricing.tiers.flatMap((tier) =>
                      (tier.monthly === null ? [""] : [t("prod.pricing.monthly"), t("prod.pricing.yearly")]).map((billing) => {
                        const label = planLabel(tier, lang, billing);
                        return (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        );
                      }),
                    )}
                  </select>,
                )}
              </div>

              <fieldset className="grid gap-5 rounded-xl bg-off-white p-5 ring-1 ring-line sm:grid-cols-2">
                <legend className="sr-only">{t("prod.form.schedule")}</legend>
                {field(
                  "preferredDate",
                  t("prod.form.date"),
                  <input
                    {...a11y("preferredDate")}
                    type="date"
                    min={tomorrow()}
                    className={inputClass}
                    value={form.preferredDate}
                    onChange={(e) => update("preferredDate", e.target.value)}
                  />,
                  t("prod.form.dateHint"),
                )}
                {field(
                  "preferredTime",
                  t("prod.form.time"),
                  <select {...a11y("preferredTime")} className={inputClass} value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)}>
                    <option value="">{t("prod.form.timePick")}</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>,
                )}
                <div className="flex flex-col gap-2 sm:col-span-2" role="radiogroup" aria-label={t("prod.form.format")}>
                  <span className={labelClass}>{t("prod.form.format")}</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["online", "onsite"] as const).map((value) => (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border bg-white px-4 py-3 text-sm font-medium transition-colors ${
                          form.format === value ? "border-aftech ring-1 ring-aftech" : "border-gray-200 hover:border-ink/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="demo-format"
                          value={value}
                          checked={form.format === value}
                          onChange={() => update("format", value)}
                          className="accent-[#1479D1]"
                        />
                        {t(`prod.form.${value}`)}
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              {field(
                "notes",
                t("prod.form.notes"),
                <textarea
                  {...a11y("notes")}
                  rows={4}
                  placeholder={t("prod.form.notesPh")}
                  className={inputClass}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />,
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t("prod.form.errSend")}
                </div>
              )}

              <Button type="submit" disabled={status === "submitting"} withArrow={false} className="w-full sm:w-auto sm:self-start">
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("prod.form.sending")}
                  </>
                ) : (
                  t("prod.form.submit")
                )}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
}
