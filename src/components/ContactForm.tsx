import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";

interface FormState {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  location: string;
  timeline: string;
  message: string;
  company_website: string; // honeypot — must stay empty
}

const initialState: FormState = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  projectType: "",
  budgetRange: "",
  location: "",
  timeline: "",
  message: "",
  company_website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact.php";

export default function ContactForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const projectTypeOptions = [
    { value: "Technology", label: t("form.type.technology") },
    { value: "Mechanical & Electrical", label: t("form.type.me") },
    { value: "Integrated Solution", label: t("form.type.integrated") },
    { value: "Other", label: t("form.type.other") },
  ];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = t("form.errName");
    if (!form.email.trim() || !EMAIL_RE.test(form.email)) next.email = t("form.errEmail");
    if (!form.projectType) next.projectType = t("form.errType");
    if (form.message.trim().length < 10) next.message = t("form.errMsg");
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
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setStatus("error");
        setStatusMessage(data?.error ?? t("form.errGeneric"));
        return;
      }

      setStatus("success");
      setStatusMessage(t("form.success"));
      setForm(initialState);
    } catch {
      setStatus("error");
      setStatusMessage(t("form.errNetwork"));
    }
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-aftech-teal outline-none transition-colors";
  const labelClass = "text-sm font-semibold text-ink";
  const errorClass = "text-xs text-red-600 mt-1";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-sm border border-line bg-teal-tint p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-aftech-teal" />
        <p className="text-lg font-semibold">{statusMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* honeypot field — hidden from real users, catches bots */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className={labelClass}>
            {t("form.fullName")}
          </label>
          <input
            id="fullName"
            className={inputClass}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <span id="fullName-error" className={errorClass}>
              {errors.fullName}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="company" className={labelClass}>
            {t("form.company")}
          </label>
          <input id="company" className={inputClass} value={form.company} onChange={(e) => update("company", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            {t("form.email")}
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className={errorClass}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className={labelClass}>
            {t("form.phone")}
          </label>
          <input id="phone" className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className={labelClass}>
            {t("form.projectType")}
          </label>
          <select
            id="projectType"
            className={inputClass}
            value={form.projectType}
            onChange={(e) => update("projectType", e.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "projectType-error" : undefined}
          >
            <option value="">{t("form.selectType")}</option>
            {projectTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <span id="projectType-error" className={errorClass}>
              {errors.projectType}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="budgetRange" className={labelClass}>
            {t("form.budget")}
          </label>
          <input id="budgetRange" className={inputClass} value={form.budgetRange} onChange={(e) => update("budgetRange", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className={labelClass}>
            {t("form.location")}
          </label>
          <input id="location" className={inputClass} value={form.location} onChange={(e) => update("location", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="timeline" className={labelClass}>
            {t("form.timeline")}
          </label>
          <input id="timeline" className={inputClass} value={form.timeline} onChange={(e) => update("timeline", e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
          <label htmlFor="message" className={labelClass}>
            {t("form.message")}
          </label>
        <textarea
          id="message"
          rows={5}
          className={inputClass}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <span id="message-error" className={errorClass}>
            {errors.message}
          </span>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-sm bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {statusMessage}
        </div>
      )}

      <Button type="submit" disabled={status === "submitting"} className="self-start">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("form.sending")}
          </>
        ) : (
          t("form.submit")
        )}
      </Button>
    </form>
  );
}
