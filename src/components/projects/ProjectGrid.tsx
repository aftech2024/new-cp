import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Project } from "@/types";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  if (projects.length === 0) {
    return <p className="text-muted">{t("prj.empty")}</p>;
  }

  // Remount the stagger container whenever the list changes so cards added by
  // a filter replay the animation instead of staying stuck at opacity 0.
  const gridKey = projects.map((p) => p.id).join("-");

  return (
    <motion.div
      key={gridKey}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  );
}
