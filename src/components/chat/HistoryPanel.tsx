import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, SquarePen, Trash2, X } from "lucide-react";
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
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-10 flex flex-col bg-primary-navy"
    >
      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
        <h2 className="font-display text-xl text-white">{t("chat.history")}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("chat.historyClose")}
          className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center gap-3 rounded-xl bg-aftech px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0F6BBE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright focus-visible:ring-offset-2 focus-visible:ring-offset-primary-navy"
        >
          <SquarePen className="h-4 w-4" />
          {t("chat.newChat")}
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-4 pb-4 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
        {conversations.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-white/50">{t("chat.historyEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {conversations.map((c) => (
              <li key={c.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onOpen(c)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 pr-11 text-left transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright ${
                    c.id === activeId ? "bg-white/[0.06]" : ""
                  }`}
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] text-white/90">{c.title}</span>
                    <span className="text-[11px] text-white/40">{formatDate(c.updatedAt)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  aria-label={t("chat.historyDelete")}
                  title={t("chat.historyDelete")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/30 opacity-100 transition hover:bg-white/10 hover:text-red-300 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="border-t border-white/[0.06] px-5 py-3 text-[11px] text-white/40">{t("chat.historyNote")}</p>
    </motion.div>
  );
}
