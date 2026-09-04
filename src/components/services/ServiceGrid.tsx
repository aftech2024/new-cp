import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import ServiceCard from "./ServiceCard";
import ServiceFeatureCard from "./ServiceFeatureCard";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import type { Service } from "@/types";

const bandTone: Array<"bg-off-white" | "bg-teal-tint"> = ["bg-off-white", "bg-teal-tint"];

export default function ServiceGrid({ services }: { services: Service[] }) {
  const featured = services.filter((s) => s.videoUrl);
  const rest = services.filter((s) => !s.videoUrl);

  return (
    <div className="flex flex-col">
      {featured.map((service, i) => (
        <div key={service.slug} className={`py-8 md:py-10 ${bandTone[i % bandTone.length]}`}>
          <Container>
            <ServiceFeatureCard service={service} />
          </Container>
        </div>
      ))}

      {rest.length > 0 && (
        <div className="bg-off-white py-20 md:py-28">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col border-t border-line"
            >
              {rest.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </motion.div>
          </Container>
        </div>
      )}
    </div>
  );
}
