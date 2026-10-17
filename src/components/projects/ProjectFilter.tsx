import type { Project } from "@/types";
import { useLanguage } from "@/i18n/LanguageContext";

const filterKeys: { value: Project["category"] | "all"; key: string }[] = [
  { value: "all", key: "prj.filter.all" },
  { value: "technology", key: "prj.filter.technology" },
  { value: "me", key: "prj.filter.me" },
  { value: "integrated", key: "prj.filter.integrated" },
];

interface ProjectFilterProps {
  active: Project["category"] | "all";
  onChange: (value: Project["category"] | "all") => void;
}

/** Category tabs: the active one is underlined, the way the main navigation marks the current page. */
export default function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-line" role="group" aria-label={t("prj.filter.label")}>
      {filterKeys.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          aria-pressed={active === f.value}
          className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors ${
            active === f.value ? "border-aftech-strong text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t(f.key)}
        </button>
      ))}
    </div>
  );
}
