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

  // Remount the stagger container whenever the list changes so dynamically
  // added cards (load more / filter) replay the animation instead of
  // staying stuck in the `hidden` variant (opacity 0 → looks "hilang").
  const gridKey = projects.map((p) => p.id).join("-");

  return (
    <motion.div
      key={gridKey}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14"
    >
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} size={i % 5 === 0 ? "large" : "regular"} />
      ))}
    </motion.div>
  );
}
