import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ImageReveal from "@/components/ui/ImageReveal";
import { staggerItem } from "@/lib/motion";
import type { Service } from "@/types";

const motifBySlug: Record<string, "technology" | "me" | "integrated"> = {
  technology: "technology",
  "mechanical-electrical": "me",
  "integrated-solutions": "integrated",
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div variants={staggerItem}>
      <Link
        to={`/services/${service.slug}`}
        className="group grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] items-center gap-6 border-b border-line py-8 transition-colors duration-300 hover:bg-white/60"
      >
        <span className="font-display text-sm text-muted">{service.number}</span>
        <div className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-2xl md:text-3xl group-hover:text-aftech-teal transition-colors">
            {service.title}
          </h3>
          <p className="text-muted max-w-xl">{service.shortStatement}</p>
        </div>
        <div className="hidden md:block w-32">
          <ImageReveal motif={motifBySlug[service.slug]} ratio="square" className="rounded-full" />
        </div>
        <ArrowUpRight className="hidden md:block h-6 w-6 text-muted transition-all duration-300 ease-premium group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-aftech-teal" />
      </Link>
    </motion.div>
  );
}
