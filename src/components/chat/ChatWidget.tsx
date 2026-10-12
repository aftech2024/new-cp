import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ChevronRight,
  FileText,
  Globe,
  Layers,
  MessageSquareText,
  MonitorPlay,
  RotateCcw,
  X,
} from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import logo from "@/assets/images/logo-aftech.png";
import { WHATSAPP_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildDestinations, liftInlineLinks, normalizeHref, type Destination, type DestinationIcon } from "./destinations";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  links?: string[];
}

// Mirror the limits in public/api/chat.php so the UI stops before the server refuses.
const MAX_CHARS = 500;
const MAX_TURNS = 10;
const MAX_CARDS = 3;
const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/api/chat.php";

const SUGGESTIONS = ["chat.suggest.services", "chat.suggest.projects", "chat.suggest.start"];

const isSmallScreen = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

function Avatar({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-full bg-white p-1 ring-1 ring-line`}>
      <img src={logo} alt="" className="h-full w-full object-contain" />
    </span>
  );
}

const ICONS: Record<Exclude<DestinationIcon, "whatsapp">, typeof Briefcase> = {
  page: FileText,
  contact: MessageSquareText,
  project: Briefcase,
  service: Layers,
  insight: BookOpen,
  live: MonitorPlay,
  external: Globe,
};

function DestinationCard({ dest, onNavigate }: { dest: Destination; onNavigate: () => void }) {
  const Icon = dest.icon === "whatsapp" ? null : ICONS[dest.icon];
  const body = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md ${
          dest.icon === "whatsapp" ? "bg-[#25D366]/10 text-[#128C4A]" : "bg-aftech-ice text-aftech"
        }`}
      >
        {dest.image ? (
          <img src={dest.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : Icon ? (
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <WhatsAppIcon className="h-5 w-5" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-medium text-aftech">{dest.kind}</span>
        <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink">{dest.title}</span>
      </span>
      {dest.external ? (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-aftech" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-aftech" />
      )}
    </>
  );
  const className =
    "group flex items-center gap-3 rounded-lg bg-white p-2 pr-3 ring-1 ring-line transition hover:ring-aftech/50 hover:shadow-pro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech";

  return dest.external ? (
    <a href={dest.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link to={dest.href} onClick={onNavigate} className={className}>
      {body}
    </Link>
  );
}

export default function ChatWidget() {
  const { t, lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const destinations = useMemo(() => buildDestinations(t), [t]);
  const userTurns = messages.filter((m) => m.role === "user").length;
  const atLimit = ended || userTurns >= MAX_TURNS;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, sending, error, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    // On phones, focusing would throw the keyboard over the greeting before it is read.
    if (!isSmallScreen()) inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Grow the textarea with its content, up to about four lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input, open]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || sending || atLimit) return;

    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setError("");
    setSending(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content: c }) => ({ role, content: c })), lang }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const code: string = data?.error ?? "generic";
        if (code === "conversation_limit") setEnded(true);
        // Drop the unanswered question so the history still alternates for the next try.
        setMessages(messages);
        setInput(content);
        setError(t(`chat.err.${code}`, t("chat.err.generic")));
        return;
      }

      const links = Array.isArray(data.links) ? data.links.filter((l: unknown): l is string => typeof l === "string") : [];
      setMessages([...history, { role: "assistant", content: data.reply, links }]);
      if (data.remaining === 0) setEnded(true);
    } catch {
      setMessages(messages);
      setInput(content);
      setError(t("chat.err.generic"));
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  function reset() {
    setMessages([]);
    setInput("");
    setError("");
    setEnded(false);
  }

  // A page opened from the chat would sit hidden behind the sheet on a phone.
  function handleNavigate() {
    if (isSmallScreen()) setOpen(false);
  }

  function renderAssistant(m: ChatMessage) {
    const lifted = liftInlineLinks(m.content, destinations);
    const seen = new Set<string>();
    const cards: Destination[] = [];
    for (const href of [...(m.links ?? []), ...lifted.hrefs]) {
      const dest = destinations.get(normalizeHref(href));
      if (!dest || seen.has(dest.href)) continue;
      seen.add(dest.href);
      cards.push(dest);
    }
    return (
      <>
        <div className="whitespace-pre-line break-words rounded-xl rounded-tl-sm bg-white px-4 py-3 text-[14px] leading-relaxed text-ink ring-1 ring-line/70">
          {lifted.text}
        </div>
        {cards.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {cards.slice(0, MAX_CARDS).map((dest) => (
              <DestinationCard key={dest.href} dest={dest} onNavigate={handleNavigate} />
            ))}
          </div>
        )}
      </>
    );
  }

  const nearLimit = input.length > MAX_CHARS - 100;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("chat.title")}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-[5.5rem] z-30 flex max-h-[min(640px,calc(100dvh-7.5rem))] flex-col overflow-hidden rounded-xl bg-white shadow-[0_32px_80px_-24px_rgba(4,17,29,0.55)] ring-1 ring-deep-navy/10 sm:inset-x-auto sm:right-6 sm:w-[400px]"
          >
            {/* Header — a faint drafting grid ties it to the engineering side of the brand. */}
            <div className="relative shrink-0 overflow-hidden bg-deep-navy px-5 py-4 text-white">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(46,168,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(46,168,255,0.09)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_left,black,transparent_75%)]"
              />
              <div className="relative flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                  <img src={logo} alt="" className="h-full w-full object-contain" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-display text-[22px] leading-none">{t("chat.title")}</span>
                  <span className="flex items-center gap-1.5 text-xs text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    {t("chat.subtitle")}
                  </span>
                </div>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label={t("chat.reset")}
                    title={t("chat.reset")}
                    className="rounded-md p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("chat.close")}
                  className="rounded-md p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex flex-1 flex-col gap-4 overflow-y-auto bg-off-white px-4 py-5" aria-live="polite">
              <div className="flex items-start gap-2.5">
                <Avatar />
                <div className="flex max-w-[85%] flex-col gap-2">
                  <div className="rounded-xl rounded-tl-sm bg-white px-4 py-3 text-[14px] leading-relaxed text-ink ring-1 ring-line/70">
                    {t("chat.greeting")}
                  </div>
                  {messages.length === 0 && (
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTIONS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => void send(t(key))}
                          className="group flex items-center justify-between gap-3 rounded-lg bg-white px-3.5 py-2.5 text-left text-[13px] text-ink ring-1 ring-line transition hover:text-aftech hover:ring-aftech/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech"
                        >
                          {t(key)}
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-aftech" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={i}
                    className="ml-auto max-w-[80%] whitespace-pre-line break-words rounded-xl rounded-tr-sm bg-aftech px-4 py-2.5 text-[14px] leading-relaxed text-white"
                  >
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2.5">
                    <Avatar />
                    <div className="flex max-w-[85%] flex-1 flex-col gap-2">{renderAssistant(m)}</div>
                  </div>
                ),
              )}

              {sending && (
                <div className="flex items-start gap-2.5" role="status" aria-label={t("chat.typing")}>
                  <Avatar />
                  <div className="flex items-center gap-1 rounded-xl rounded-tl-sm bg-white px-4 py-3.5 ring-1 ring-line/70">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 rounded-full bg-aftech/60 motion-safe:animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="flex items-start gap-2 text-xs leading-snug text-red-600">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              )}

              {atLimit && (
                <div className="flex flex-col gap-3 rounded-xl bg-white p-4 text-[13px] leading-relaxed text-ink ring-1 ring-line">
                  <p>{t("chat.limitReached")}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-aftech px-3.5 py-2 text-xs font-medium text-white transition hover:bg-[#0F6BBE]"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" /> {t("chat.whatsappCta")}
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium text-ink ring-1 ring-line transition hover:text-aftech hover:ring-aftech/50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> {t("chat.reset")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="shrink-0 border-t border-line bg-white px-3 pb-2.5 pt-3">
              <div className="flex items-end gap-2 rounded-xl bg-off-white py-1.5 pl-3.5 pr-1.5 ring-1 ring-line transition focus-within:bg-white focus-within:ring-2 focus-within:ring-aftech/40">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  maxLength={MAX_CHARS}
                  disabled={atLimit}
                  placeholder={t("chat.placeholder")}
                  aria-label={t("chat.placeholder")}
                  className="max-h-28 flex-1 resize-none self-center bg-transparent py-1.5 text-[14px] text-ink outline-none placeholder:text-muted focus-visible:outline-none disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={sending || atLimit || !input.trim()}
                  aria-label={t("chat.send")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aftech text-white transition hover:bg-[#0F6BBE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech focus-visible:ring-offset-2 disabled:bg-line disabled:text-muted"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
                </button>
              </div>
              <div className="flex items-start justify-between gap-3 px-1 pt-2 text-[11px] leading-snug text-muted">
                <p>
                  {t("chat.disclaimer")}{" "}
                  <Link to="/contact" onClick={handleNavigate} className="text-aftech underline-offset-2 hover:underline">
                    {t("chat.contactLink")}
                  </Link>
                  .
                </p>
                {nearLimit && (
                  <span className="shrink-0 tabular-nums">
                    {input.length}/{MAX_CHARS}
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t("chat.close") : t("chat.open")}
        className={`fixed bottom-5 right-4 z-30 flex h-14 items-center rounded-full bg-deep-navy text-white shadow-[0_12px_32px_-12px_rgba(4,17,29,0.7)] ring-1 ring-white/20 transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright focus-visible:ring-offset-2 sm:right-6 ${
          open ? "w-14 justify-center" : "gap-3 pl-2 pr-2 sm:pr-5"
        }`}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5">
              <img src={logo} alt="" className="h-full w-full object-contain" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-deep-navy" aria-hidden="true" />
            </span>
            <span className="hidden text-sm font-medium sm:inline">{t("chat.launcher")}</span>
          </>
        )}
      </button>
    </>
  );
}
