import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowUp,
  Briefcase,
  Check,
  ChevronRight,
  Copy,
  History,
  ImageIcon,
  Layers,
  MapPin,
  Maximize2,
  MessageSquareText,
  Mic,
  Minimize2,
  Plus,
  Square,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import AgentIcon from "./AgentIcon";
import DestinationList from "./DestinationList";
import HistoryPanel from "./HistoryPanel";
import Markdown from "./Markdown";
import { buildDestinations, liftInlineLinks, normalizeHref, toPlainText, type Destination } from "./destinations";
import { deleteConversation, loadHistory, saveConversation } from "./history";
import { ImageError, prepareImage, useDictation, useSpeaker } from "./media";
import { newId, type ChatMessage, type Conversation } from "./types";
import { useIsMobile, useSheetViewport } from "./useMobileSheet";

// Mirror the limits in public/api/chat.php so the UI stops before the server refuses.
const MAX_CHARS = 500;
const MAX_TURNS = 10;
const MAX_CARDS = 3;
const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/api/chat.php";
const FEEDBACK_ENDPOINT = "/api/chat-feedback.php";

const SUGGESTIONS = [
  { key: "chat.suggest.services", icon: Layers },
  { key: "chat.suggest.projects", icon: Briefcase },
  { key: "chat.suggest.start", icon: MessageSquareText },
  { key: "chat.suggest.offices", icon: MapPin },
];

// The engineering-drawing grid behind the welcome heading — the one decorative moment.
const DRAFTING_GRID =
  "[background-image:linear-gradient(rgba(46,168,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(46,168,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright";

function HeaderButton({ label, onClick, children, active = false }: { label: string; onClick: () => void; children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-white/[0.06] hover:text-white sm:h-9 sm:w-9 ${focusRing} ${
        active ? "bg-white/[0.06] text-white" : "text-white/60"
      }`}
    >
      {children}
    </button>
  );
}

// Aftech blues travelling around a border while the composer waits for input.
const GLOW_GRADIENT = "conic-gradient(from 0deg, #1479D1, #2EA8FF, #A5DEFF, #2EA8FF, #1479D1)";

/**
 * A rotating conic gradient, clipped by its parent's rounded overflow to read
 * as a moving border. It spins inside a square half again as wide as the box,
 * so the rotation never exposes a corner. Still under reduced motion.
 */
function Glow({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="absolute inset-0 motion-safe:animate-[spin_5s_linear_infinite]" style={{ background: GLOW_GRADIENT }} />
    </span>
  );
}

function RingButton({
  label,
  onClick,
  children,
  type = "button",
  disabled = false,
  glowing,
  pressed,
  alert = false,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  glowing: boolean;
  pressed?: boolean;
  alert?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`group/ring relative h-11 w-11 shrink-0 overflow-hidden rounded-full p-[1.5px] transition disabled:opacity-40 ${focusRing}`}
    >
      <span aria-hidden="true" className="absolute inset-0" style={{ background: GLOW_GRADIENT }} />
      <Glow active={glowing} />
      <span
        className={`relative flex h-full w-full items-center justify-center rounded-full text-white transition-colors ${
          alert ? "bg-red-500" : "bg-navy-800 group-hover/ring:bg-navy-700"
        }`}
      >
        {children}
      </span>
    </button>
  );
}

function ActionButton({
  label,
  onClick,
  children,
  pressed,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/[0.06] hover:text-white/85 disabled:pointer-events-none disabled:opacity-25 sm:h-8 sm:w-8 ${focusRing} ${
        pressed ? "text-aftech-bright" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default function ChatWidget() {
  const { t, lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const locale = lang === "id" ? "id-ID" : "en-GB";

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [convId, setConvId] = useState(newId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dictationBase = useRef("");

  const sheet = useSheetViewport(open && isMobile);
  const destinations = useMemo(() => buildDestinations(t), [t]);
  const speaker = useSpeaker(lang);
  const dictation = useDictation(
    lang,
    useCallback((text: string) => setInput((dictationBase.current ? `${dictationBase.current} ${text}` : text).slice(0, MAX_CHARS)), []),
    useCallback(() => setError(t("chat.err.mic")), [t]),
  );

  const userTurns = messages.filter((m) => m.role === "user").length;
  const atLimit = ended || userTurns >= MAX_TURNS;
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
  const wide = expanded && !isMobile;

  const messageCount = messages.length;
  const lastRole = messages[messageCount - 1]?.role;
  const lastQuestionId = [...messages].reverse().find((m) => m.role === "user")?.id;
  // Keyed on the message count, not the array, so rating an answer never scrolls.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const behavior = reduceMotion ? "auto" : "smooth";
    if (lastRole === "assistant" && !sending && lastQuestionId) {
      // Bring the visitor's question to the top so a long answer reads from its first line.
      const question = list.querySelector(`[data-msg="${lastQuestionId}"]`) as HTMLElement | null;
      if (question) {
        list.scrollTo({ top: question.offsetTop - 16, behavior });
        return;
      }
    }
    list.scrollTo({ top: list.scrollHeight, behavior });
  }, [messageCount, lastRole, lastQuestionId, sending, error, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    // On phones, focusing would throw the keyboard over the welcome screen before it is read.
    if (!isMobile) inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (historyOpen) setHistoryOpen(false);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, historyOpen, isMobile]);

  const stopSpeaking = speaker.stop;
  useEffect(() => {
    if (!open) stopSpeaking();
  }, [open, stopSpeaking]);

  // Grow the textarea with its content, up to about five lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input, open, expanded]);

  useEffect(() => {
    if (messages.some((m) => m.role === "user")) saveConversation(convId, messages, t("chat.imageAttached"));
  }, [convId, messages, t]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    const image = attachment;
    if ((!content && !image) || sending || atLimit) return;
    if (dictation.listening) dictation.stop();

    const userMessage: ChatMessage = { id: newId(), role: "user", content, at: Date.now(), ...(image ? { image } : {}) };
    const previous = messages;
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setAttachment(null);
    setError("");
    setSending(true);

    const restore = (message: string) => {
      // Drop the unanswered question so the history still alternates for the next try.
      setMessages(previous);
      setInput(content);
      setAttachment(image);
      setError(message);
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: next.map((m, i) => {
            const isLast = i === next.length - 1;
            return {
              role: m.role,
              content: m.content,
              ...(isLast && m.image ? { image: { media_type: "image/jpeg", data: m.image.split(",")[1] ?? "" } } : {}),
              ...(!isLast && (m.image || m.hadImage) ? { hadImage: true } : {}),
            };
          }),
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const code: string = data?.error ?? "generic";
        if (code === "conversation_limit") setEnded(true);
        restore(t(`chat.err.${code}`, t("chat.err.generic")));
        return;
      }

      const strings = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []);
      setMessages([
        ...next,
        { id: newId(), role: "assistant", content: data.reply, at: Date.now(), links: strings(data.links), followups: strings(data.followups) },
      ]);
      if (data.remaining === 0) setEnded(true);
    } catch {
      restore(t("chat.err.generic"));
    } finally {
      setSending(false);
    }
  }

  function startNew() {
    speaker.stop();
    setConvId(newId());
    setMessages([]);
    setInput("");
    setAttachment(null);
    setError("");
    setEnded(false);
    setHistoryOpen(false);
  }

  function openHistory() {
    setHistory(loadHistory());
    setHistoryOpen(true);
  }

  function openConversation(c: Conversation) {
    speaker.stop();
    setConvId(c.id);
    setMessages(c.messages);
    setInput("");
    setAttachment(null);
    setError("");
    setEnded(false);
    setHistoryOpen(false);
  }

  function removeConversation(id: string) {
    setHistory(deleteConversation(id));
    if (id === convId) {
      setConvId(newId());
      setMessages([]);
    }
  }

  async function attachFile(file: File) {
    try {
      setAttachment(await prepareImage(file));
      setError("");
    } catch (err) {
      setError(t(`chat.err.${err instanceof ImageError ? err.code : "image_type"}`));
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same photo be picked again after removing it
    if (file) void attachFile(file);
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
    if (file) {
      e.preventDefault();
      void attachFile(file);
    }
  }

  function toggleMic() {
    if (dictation.listening) {
      dictation.stop();
      return;
    }
    dictationBase.current = input.trim();
    setError("");
    dictation.start();
  }

  async function copy(m: ChatMessage) {
    try {
      await navigator.clipboard.writeText(toPlainText(m.content));
      setCopiedId(m.id);
      window.setTimeout(() => setCopiedId((current) => (current === m.id ? null : current)), 1600);
    } catch {
      /* clipboard blocked — nothing useful to tell the visitor */
    }
  }

  function rate(m: ChatMessage, rating: "up" | "down") {
    if (m.rating) return;
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, rating } : x)));
    const index = messages.findIndex((x) => x.id === m.id);
    const question = [...messages.slice(0, index)].reverse().find((x) => x.role === "user")?.content ?? "";
    void fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, lang, question, answer: m.content }),
    }).catch(() => {});
  }

  // A page opened from the chat would sit hidden behind a full-screen or wide panel.
  function handleNavigate() {
    if (isMobile || expanded) {
      setOpen(false);
      setExpanded(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // On phones Enter inserts a newline; the send button is right there.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && !isMobile) {
      e.preventDefault();
      void send(input);
    }
  }

  const formatTime = (at: number) => new Date(at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const nearLimit = input.length > MAX_CHARS - 100;
  const showMic = dictation.supported && (dictation.listening || (!input.trim() && !attachment));
  // Nothing typed yet: the composer glows to invite a first question.
  const idle = !input.trim() && !attachment && !sending && !atLimit && !dictation.listening;
  const column = wide ? "mx-auto w-full max-w-2xl" : "w-full";
  const bodyText = "text-[15px] leading-[1.65] sm:text-[14px]";

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
    const speaking = speaker.speakingId === m.id;
    const isLatest = m.id === lastAssistantId;

    return (
      <article key={m.id} className="flex flex-col gap-3">
        <div className={`break-words text-white/[0.88] ${bodyText}`}>
          <Markdown text={lifted.text} />
        </div>

        {cards.length > 0 && <DestinationList items={cards.slice(0, MAX_CARDS)} onNavigate={handleNavigate} />}

        <div className="-ml-2 flex items-center text-white/40">
          <ActionButton label={copiedId === m.id ? t("chat.copied") : t("chat.copy")} onClick={() => void copy(m)}>
            {copiedId === m.id ? <Check className="h-[15px] w-[15px] text-emerald-400" /> : <Copy className="h-[15px] w-[15px]" />}
          </ActionButton>
          {speaker.supported && (
            <ActionButton
              label={speaking ? t("chat.speakStop") : t("chat.speak")}
              pressed={speaking}
              onClick={() => (speaking ? speaker.stop() : speaker.speak(m.id, toPlainText(lifted.text)))}
            >
              {speaking ? <Square className="h-3 w-3" fill="currentColor" /> : <Volume2 className="h-[15px] w-[15px]" />}
            </ActionButton>
          )}
          <ActionButton label={t("chat.good")} pressed={m.rating === "up"} disabled={m.rating === "down"} onClick={() => rate(m, "up")}>
            <ThumbsUp className="h-[15px] w-[15px]" fill={m.rating === "up" ? "currentColor" : "none"} />
          </ActionButton>
          <ActionButton label={t("chat.bad")} pressed={m.rating === "down"} disabled={m.rating === "up"} onClick={() => rate(m, "down")}>
            <ThumbsDown className="h-[15px] w-[15px]" fill={m.rating === "down" ? "currentColor" : "none"} />
          </ActionButton>
          <span className="ml-1.5 text-[11px] tabular-nums text-white/30">{formatTime(m.at)}</span>
        </div>

        {isLatest && !sending && !atLimit && m.followups && m.followups.length > 0 && (
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-xs font-medium text-white/45">{t("chat.followups")}</p>
            <div className="flex flex-wrap gap-2">
              {m.followups.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  className={`rounded-full px-3.5 py-2 text-left text-[13px] leading-snug text-white/80 ring-1 ring-inset ring-white/[0.14] transition hover:bg-white/[0.05] hover:text-white hover:ring-white/25 ${focusRing}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  const panelPosition = isMobile
    ? "inset-x-0 top-0 z-[60] h-[100dvh]"
    : wide
      ? "bottom-24 right-6 z-[60] h-[calc(100dvh-8rem)] w-[min(760px,calc(100vw-3rem))] rounded-2xl ring-1 ring-white/10"
      : "bottom-24 right-6 z-30 h-[min(680px,calc(100dvh-8rem))] w-[400px] rounded-2xl ring-1 ring-white/10";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal={isMobile || undefined}
            aria-label={t("chat.title")}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: isMobile ? 40 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: isMobile ? 40 : 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={sheet ? { height: sheet.height, top: sheet.top } : undefined}
            className={`fixed flex flex-col overflow-hidden bg-primary-navy text-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.75)] ${panelPosition}`}
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] py-2 pl-4 pr-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aftech/15 text-aftech-bright ring-1 ring-inset ring-aftech-bright/30">
                <AgentIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold leading-tight text-white">{t("chat.title")}</p>
                <p className="truncate text-xs text-white/45">{t("chat.subtitle")}</p>
              </div>
              <div className="flex items-center">
                <HeaderButton label={t("chat.history")} onClick={() => (historyOpen ? setHistoryOpen(false) : openHistory())} active={historyOpen}>
                  <History className="h-[18px] w-[18px]" />
                </HeaderButton>
                <HeaderButton label={t("chat.newChat")} onClick={startNew}>
                  <SquarePen className="h-[18px] w-[18px]" />
                </HeaderButton>
                {!isMobile && (
                  <HeaderButton label={expanded ? t("chat.collapse") : t("chat.expand")} onClick={() => setExpanded((v) => !v)}>
                    {expanded ? <Minimize2 className="h-[17px] w-[17px]" /> : <Maximize2 className="h-[17px] w-[17px]" />}
                  </HeaderButton>
                )}
                <HeaderButton label={t("chat.close")} onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </HeaderButton>
              </div>
            </header>

            <div className="relative flex min-h-0 flex-1 flex-col">
              <div
                ref={listRef}
                className="relative flex-1 overflow-y-auto overscroll-contain [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]"
                aria-live="polite"
              >
                {messages.length === 0 ? (
                  <div className="relative">
                    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-64 ${DRAFTING_GRID}`} />
                    <div className={`relative flex flex-col gap-8 px-5 pb-6 pt-10 sm:px-6 sm:pt-9 ${column}`}>
                      <div>
                        <h2 className="font-display text-[28px] font-medium leading-[1.15] text-white">{t("chat.welcomeTitle")}</h2>
                        <p className="mt-3 max-w-[36ch] text-[14.5px] leading-relaxed text-white/60">{t("chat.welcomeBody")}</p>
                      </div>

                      <div>
                        <p className="mb-2.5 text-xs font-medium text-white/45">{t("chat.commonQuestions")}</p>
                        <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-xl bg-white/[0.02] ring-1 ring-white/[0.08]">
                          {SUGGESTIONS.map(({ key, icon: Icon }) => (
                            <li key={key}>
                              <button
                                type="button"
                                onClick={() => void send(t(key))}
                                className="group flex w-full items-center gap-3 px-4 py-3.5 text-left text-[14.5px] text-white/85 outline-none transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.07] sm:py-3 sm:text-[14px]"
                              >
                                <Icon className="h-4 w-4 shrink-0 text-aftech-bright" strokeWidth={1.75} />
                                <span className="flex-1">{t(key)}</span>
                                <ChevronRight className="h-4 w-4 shrink-0 text-white/25 transition-colors group-hover:text-white/60" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 self-start rounded-md text-[13px] text-white/55 transition-colors hover:text-white ${focusRing}`}
                      >
                        <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                        {t("chat.welcomeDirect")}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className={`flex flex-col gap-7 px-4 py-6 sm:px-5 ${column}`}>
                    {messages.map((m) =>
                      m.role === "user" ? (
                        <div key={m.id} data-msg={m.id} className="flex max-w-[85%] flex-col items-end gap-1.5 self-end">
                          {m.image && (
                            <img src={m.image} alt={t("chat.imageAlt")} className="max-h-52 rounded-xl object-cover ring-1 ring-white/10" />
                          )}
                          {!m.image && m.hadImage && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
                              <ImageIcon className="h-3.5 w-3.5" />
                              {t("chat.imageAttached")}
                            </span>
                          )}
                          {m.content && (
                            <div className={`whitespace-pre-line break-words rounded-2xl rounded-br-md bg-aftech px-3.5 py-2.5 text-white ${bodyText}`}>
                              {m.content}
                            </div>
                          )}
                        </div>
                      ) : (
                        renderAssistant(m)
                      ),
                    )}

                    {sending && (
                      <div className="flex items-center gap-1.5 py-1" role="status" aria-label={t("chat.typing")}>
                        {[0, 200, 400].map((delay) => (
                          <span
                            key={delay}
                            className="h-1.5 w-1.5 rounded-full bg-white/50 motion-safe:animate-pulse"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </div>
                    )}

                    {error && (
                      <div className="flex items-start gap-2 text-[13px] leading-snug text-red-300">
                        <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                        <p className="flex-1">
                          {error}
                          {(input.trim() || attachment) && !atLimit && (
                            <button
                              type="button"
                              onClick={() => void send(input)}
                              className="ml-2 rounded font-medium text-white underline underline-offset-2 hover:no-underline"
                            >
                              {t("chat.retry")}
                            </button>
                          )}
                        </p>
                      </div>
                    )}

                    {atLimit && (
                      <div className="flex flex-col gap-3 rounded-xl p-4 text-[13.5px] leading-relaxed text-white/75 ring-1 ring-white/[0.08]">
                        <p>{t("chat.limitReached")}</p>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex h-9 items-center gap-2 rounded-lg bg-aftech px-3.5 text-[13px] font-medium text-white transition hover:bg-[#0F6BBE] ${focusRing}`}
                          >
                            <WhatsAppIcon className="h-4 w-4" /> {t("chat.whatsappCta")}
                          </a>
                          <button
                            type="button"
                            onClick={startNew}
                            className={`inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium text-white/80 ring-1 ring-inset ring-white/15 transition hover:bg-white/[0.05] ${focusRing}`}
                          >
                            <SquarePen className="h-4 w-4" /> {t("chat.newChat")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="shrink-0 border-t border-white/[0.07] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-4 sm:pb-3"
              >
                <div className={column}>
                  {attachment && (
                    <div className="mb-2 flex items-center gap-3 rounded-lg bg-white/[0.04] p-2 pr-2.5 ring-1 ring-white/[0.08]">
                      <img src={attachment} alt={t("chat.imageAlt")} className="h-10 w-10 rounded-md object-cover" />
                      <span className="flex-1 text-xs text-white/60">{t("chat.imageReady")}</span>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        aria-label={t("chat.removeImage")}
                        className={`flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition hover:bg-white/[0.06] hover:text-white ${focusRing}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="group relative overflow-hidden rounded-2xl p-[1.5px]">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-white/[0.12] transition-colors group-focus-within:bg-aftech-bright/50"
                    />
                    <Glow active={idle} />
                    <div className="relative rounded-[15px] bg-navy-800 px-2.5 pb-2 pt-2">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        rows={1}
                        maxLength={MAX_CHARS}
                        disabled={atLimit}
                        enterKeyHint={isMobile ? "enter" : "send"}
                        placeholder={dictation.listening ? t("chat.listening") : t("chat.placeholder")}
                        aria-label={t("chat.placeholder")}
                        // 16px on phones: anything smaller makes iOS zoom the page on focus.
                        className="block max-h-32 min-h-[44px] w-full resize-none bg-transparent px-2 py-2 text-base leading-6 text-white outline-none placeholder:text-white/40 focus-visible:outline-none disabled:cursor-not-allowed sm:text-[14px]"
                      />
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={atLimit || sending}
                          aria-label={t("chat.attach")}
                          title={t("chat.attach")}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30 ${focusRing}`}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" tabIndex={-1} />
                        <div className="flex items-center gap-2">
                          {nearLimit && (
                            <span className="text-[11px] tabular-nums text-white/45">
                              {input.length}/{MAX_CHARS}
                            </span>
                          )}
                          {showMic ? (
                            <RingButton
                              label={dictation.listening ? t("chat.micStop") : t("chat.mic")}
                              onClick={toggleMic}
                              disabled={atLimit}
                              glowing={idle}
                              pressed={dictation.listening}
                              alert={dictation.listening}
                            >
                              {dictation.listening ? <Square className="h-3.5 w-3.5" fill="currentColor" /> : <Mic className="h-5 w-5" />}
                            </RingButton>
                          ) : (
                            <RingButton
                              label={t("chat.send")}
                              type="submit"
                              disabled={sending || atLimit || (!input.trim() && !attachment)}
                              glowing={idle}
                            >
                              <ArrowUp className="h-5 w-5" strokeWidth={2.25} />
                            </RingButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 flex items-center justify-center gap-2 px-1 text-center text-[11px] leading-snug text-white/35">
                    <span>
                      {t("chat.disclaimer")}{" "}
                      <Link to="/contact" onClick={handleNavigate} className="text-white/60 underline underline-offset-2 hover:text-white">
                        {t("chat.contactLink")}
                      </Link>
                      .
                    </span>
                    {nearLimit && (
                      <span className="tabular-nums text-white/50">
                        {input.length}/{MAX_CHARS}
                      </span>
                    )}
                  </p>
                </div>
              </form>

              <AnimatePresence>
                {historyOpen && (
                  <HistoryPanel
                    conversations={history}
                    activeId={convId}
                    locale={locale}
                    t={t}
                    onOpen={openConversation}
                    onDelete={removeConversation}
                    onNew={startNew}
                    onClose={() => setHistoryOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* On phones the open sheet has its own close button, so the launcher steps aside. */}
      {!(open && isMobile) && (
        <div className="group/launch fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 sm:bottom-6 sm:right-6">
          {/* Hover / keyboard-focus hint. Kept out of the button so it does not scale with it. */}
          {!open && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-navy-700 px-3.5 py-2 text-[13px] font-medium text-white opacity-0 shadow-[0_8px_24px_-8px_rgba(4,17,29,0.6)] ring-1 ring-white/15 transition duration-200 group-focus-within/launch:translate-x-0 group-focus-within/launch:opacity-100 group-hover/launch:translate-x-0 group-hover/launch:opacity-100 motion-reduce:transition-none sm:block"
            >
              {t("chat.launcherHint")}
              <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-navy-700" />
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("chat.close") : t("chat.open")}
            className="flex h-14 w-14 items-center justify-center rounded-full text-aftech-bright transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright motion-reduce:hover:scale-100"
          >
            {/* Just the glyph — a soft drop shadow keeps it legible over photos and light sections alike. */}
            {open ? (
              <X className="h-8 w-8 drop-shadow-[0_2px_8px_rgba(4,17,29,0.45)]" strokeWidth={2.25} />
            ) : (
              // The shadow sits on a wrapper: on the masked span itself the mask would clip it away.
              <span className="drop-shadow-[0_2px_8px_rgba(4,17,29,0.45)]">
                <AgentIcon className="h-11 w-11" />
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
