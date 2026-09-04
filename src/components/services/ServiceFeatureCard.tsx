import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import type { Service } from "@/types";

const cornerTick = "absolute h-3 w-3 border-white/20";

function withAutoplay(url: string): string {
  const id = url.split("/embed/")[1]?.split("?")[0];
  const params = new URLSearchParams({
    iv_load_policy: "3",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    autoplay: "1",
    mute: "1",
    loop: "1",
    ...(id ? { playlist: id } : {}),
  });
  return `${url}?${params.toString()}`;
}

export default function ServiceFeatureCard({ service }: { service: Service }) {
  if (!service.videoUrl) return null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="relative rounded-lg bg-deep-navy p-6 md:p-10"
    >
      <span className={`${cornerTick} top-4 left-4 border-l border-t`} aria-hidden="true" />
      <span className={`${cornerTick} top-4 right-4 border-r border-t`} aria-hidden="true" />
      <span className={`${cornerTick} bottom-4 left-4 border-l border-b`} aria-hidden="true" />
      <span className={`${cornerTick} bottom-4 right-4 border-r border-b`} aria-hidden="true" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white">{service.title}</h3>
            <p className="text-white/60 max-w-md">{service.intro}</p>
          </div>

          {service.highlights && service.highlights.length > 0 && (
            <div className="flex flex-col gap-3">
              <h5 className="text-sm font-semibold text-white">What you can do:</h5>
              <motion.ul variants={staggerContainer} className="flex flex-col gap-2.5">
                {service.highlights.map((item) => (
                  <motion.li key={item} variants={staggerItem} className="flex items-start gap-2.5 text-sm text-white/70">
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 shrink-0 mt-1 fill-aftech-teal"
                      aria-hidden="true"
                    >
                      <polygon points="0,0 12,6 0,12" />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}

          <Link
            to={`/services/${service.slug}`}
            className="group inline-flex items-center gap-2 self-start rounded-lg border border-aftech-teal px-5 py-2.5 text-sm font-semibold text-aftech-teal hover:bg-aftech-teal hover:text-white transition-colors"
          >
            Learn more
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-px rounded-lg bg-[conic-gradient(from_0deg,transparent_0%,theme(colors.aftech-teal)_15%,transparent_30%)] opacity-40 animate-spin [animation-duration:6s]" />
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-deep-navy aspect-video">
            <iframe
              src={withAutoplay(service.videoUrl)}
              title={`${service.title} overview video`}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allow="presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
