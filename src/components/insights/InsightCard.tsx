import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LinkArrow from "@/components/ui/LinkArrow";
import { staggerItem } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeInsight } from "@/i18n/localize";
import type { Insight } from "@/types";

export default function InsightCard({ insight: raw }: { insight: Insight }) {
  const { t, lang } = useLanguage();
  const insight = localizeInsight(raw, t);
  const date = new Date(insight.date).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article variants={staggerItem} className="flex flex-col gap-3 border-t border-line py-8">
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-aftech-teal">{insight.category}</span>
      <h3 className="font-display font-bold text-xl md:text-2xl">
        <Link to={`/insights/${insight.slug}`} className="hover:text-aftech-teal transition-colors">
          {insight.title}
        </Link>
      </h3>
      <p className="text-muted">{insight.excerpt}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-muted">{date}</span>
        <LinkArrow to={`/insights/${insight.slug}`}>{t("insCard.read")}</LinkArrow>
      </div>
    </motion.article>
  );
}
