import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { projectTypes } from "@/data/company";

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
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.projectType) next.projectType = "Select a project type.";
    if (form.message.trim().length < 10) next.message = "Message must be at least 10 characters.";
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
        setStatusMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setStatusMessage("Thanks — your inquiry has been sent. Our team will be in touch soon.");
      setForm(initialState);
    } catch {
      setStatus("error");
      setStatusMessage("Could not reach the server. Please try again later.");
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
            Full Name *
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
            Company
          </label>
          <input id="company" className={inputClass} value={form.company} onChange={(e) => update("company", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email *
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
            Phone / WhatsApp
          </label>
          <input id="phone" className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className={labelClass}>
            Project Type *
          </label>
          <select
            id="projectType"
            className={inputClass}
            value={form.projectType}
            onChange={(e) => update("projectType", e.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "projectType-error" : undefined}
          >
            <option value="">Select project type</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
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
            Budget Range
          </label>
          <input id="budgetRange" className={inputClass} value={form.budgetRange} onChange={(e) => update("budgetRange", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input id="location" className={inputClass} value={form.location} onChange={(e) => update("location", e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="timeline" className={labelClass}>
            Project Timeline
          </label>
          <input id="timeline" className={inputClass} value={form.timeline} onChange={(e) => update("timeline", e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Message *
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
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Submit Inquiry"
        )}
      </Button>
    </form>
  );
}
