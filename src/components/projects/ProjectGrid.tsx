import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import type { Project } from "@/types";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-muted">No projects in this category yet.</p>;
  }

  return (
    <motion.div
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
