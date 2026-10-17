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

/** Integrated work is the only category Halora takes part in, so it alone reads in bronze. */
const categoryColor: Record<Project["category"], string> = {
  technology: "text-aftech-strong",
  me: "text-aftech-strong",
  integrated: "text-halora-deep",
};

export default function ProjectCard({ project }: { project: Project }) {
  const { t } = useLanguage();
  const cover = isMotif(project.coverImage)
    ? { motif: project.coverImage as Motif }
    : { src: project.coverImage };

  return (
    <motion.div variants={staggerItem}>
      <Link to={`/projects/${project.slug}`} className="group flex flex-col gap-5">
        <ImageReveal {...cover} ratio="project" alt={project.title} />
        <div className="flex flex-col gap-1.5">
          <p className="flex flex-wrap gap-x-4 text-sm font-semibold">
            <span className={categoryColor[project.category]}>{t(categoryKey[project.category])}</span>
            {/* the platform is online and can be opened from the project page */}
            {project.liveUrl && <span className="text-emerald-700">{t("prj.live")}</span>}
          </p>
          <h3 className="font-display text-xl font-bold leading-snug text-ink transition-colors group-hover:text-aftech-strong md:text-2xl">
            {project.title}
          </h3>
          <p className="text-sm text-muted">{[project.location, project.year].filter(Boolean).join(", ")}</p>
        </div>
      </Link>
    </motion.div>
  );
}
