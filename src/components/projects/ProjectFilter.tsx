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

export default function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
      {filterKeys.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          aria-pressed={active === f.value}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ease-premium ${
            active === f.value
              ? "bg-deep-navy text-white"
              : "bg-white text-ink border border-line hover:border-aftech-teal"
          }`}
        >
            {t(f.key)}
        </button>
      ))}
    </div>
  );
}
