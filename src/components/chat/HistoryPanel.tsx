import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, SquarePen, Trash2 } from "lucide-react";
import type { Conversation } from "./types";

interface Props {
  conversations: Conversation[];
  activeId: string;
  locale: string;
  t: (key: string, fallback?: string) => string;
  onOpen: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
}

export default function HistoryPanel({ conversations, activeId, locale, t, onOpen, onDelete, onNew, onClose }: Props) {
  const reduceMotion = useReducedMotion();
  const formatDate = (at: number) =>
    new Date(at).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-10 flex flex-col bg-primary-navy"
    >
      <div className="flex items-center gap-1 border-b border-white/[0.07] px-2 py-2">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("chat.historyClose")}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright sm:h-9 sm:w-9"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="flex-1 text-[15px] font-semibold text-white">{t("chat.history")}</h2>
        <button
          type="button"
          onClick={onNew}
          className="flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-white/80 ring-1 ring-white/[0.12] transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright"
        >
          <SquarePen className="h-4 w-4" />
          {t("chat.newChat")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
        {conversations.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-white/45">{t("chat.historyEmpty")}</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {conversations.map((c) => (
              <li key={c.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onOpen(c)}
                  aria-current={c.id === activeId ? "true" : undefined}
                  className="flex w-full flex-col gap-0.5 px-5 py-3.5 pr-14 text-left transition hover:bg-white/[0.04] focus-visible:bg-white/[0.07] focus-visible:outline-none"
                >
                  <span className={`truncate text-[14px] ${c.id === activeId ? "font-medium text-white" : "text-white/85"}`}>{c.title}</span>
                  <span className="text-xs text-white/40">{formatDate(c.updatedAt)}</span>
                </button>
                {c.id === activeId && <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-aftech-bright" aria-hidden="true" />}
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  aria-label={t("chat.historyDelete")}
                  title={t("chat.historyDelete")}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/[0.06] hover:text-red-300 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="border-t border-white/[0.07] px-5 py-3 text-xs text-white/40">{t("chat.historyNote")}</p>
    </motion.div>
  );
}
