import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ImageReveal, { isMotif, type Motif } from "@/components/ui/ImageReveal";
import { staggerItem } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Project } from "@/types";

const categoryKey: Record<Project["category"], string> = {
  technology: "cat.technology",
  me: "cat.me",
  integrated: "cat.integrated",
};

const categoryStyle: Record<Project["category"], string> = {
  technology: "bg-aftech/10 text-aftech border-aftech/25",
  me: "bg-aftech-ice text-aftech border-aftech/20",
  integrated: "bg-halora-bronze/10 text-halora-bronze border-halora-bronze/30",
};

export default function ProjectCard({ project, size = "regular" }: { project: Project; size?: "large" | "regular" }) {
  const { t } = useLanguage();
  return (
    <motion.div variants={staggerItem} className={size === "large" ? "md:col-span-2" : ""}>
      <Link to={`/projects/${project.slug}`} className="group block overflow-hidden rounded-pro border border-line bg-white shadow-pro transition-all hover:-translate-y-1 hover:shadow-card">
        {isMotif(project.coverImage) ? (
          <ImageReveal motif={project.coverImage as Motif} ratio={size === "large" ? "wide" : "project"} label={project.title} className="!rounded-none !ring-0 !shadow-none" />
        ) : (
          <ImageReveal src={project.coverImage} ratio={size === "large" ? "wide" : "project"} label={project.title} className="!rounded-none !ring-0 !shadow-none" />
        )}
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="flex flex-col gap-2">
            <span className={`w-fit rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${categoryStyle[project.category]}`}>
              {t(categoryKey[project.category])}
            </span>
            <h3 className="font-display font-bold text-lg md:text-xl leading-snug group-hover:text-aftech transition-colors">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {project.location} · {project.year ?? "—"}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pro border border-line text-muted transition-all group-hover:border-aftech group-hover:bg-aftech group-hover:text-white">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
