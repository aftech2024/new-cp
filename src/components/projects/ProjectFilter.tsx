import type { Project } from "@/types";

const filters: { value: Project["category"] | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "technology", label: "Technology" },
  { value: "me", label: "ME" },
  { value: "integrated", label: "Integrated" },
];

interface ProjectFilterProps {
  active: Project["category"] | "all";
  onChange: (value: Project["category"] | "all") => void;
}

export default function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
      {filters.map((f) => (
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
          {f.label}
        </button>
      ))}
    </div>
  );
}
