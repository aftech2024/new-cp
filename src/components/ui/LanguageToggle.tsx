import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";

const options: Lang[] = ["id", "en"];

/**
 * ID / EN pill toggle — matches the product design:
 * dark pill, active side highlighted blue.
 */
export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("toggle.label", "Switch language")}
      className={`inline-flex items-center rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm ${
        compact ? "p-[3px]" : "p-1"
      }`}
    >
      {options.map((option) => {
        const active = lang === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            aria-label={option === "id" ? "Bahasa Indonesia" : "English"}
            className={`rounded-full font-display font-extrabold uppercase tracking-[0.08em] transition-all duration-300 ${
              compact ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-xs"
            } ${
              active
                ? "bg-[#1f6fb5] text-white shadow-[0_2px_10px_rgba(31,111,181,0.55)]"
                : "text-white/55 hover:text-white"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
