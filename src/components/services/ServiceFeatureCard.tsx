import { motion } from "framer-motion";
import LinkArrow from "@/components/ui/LinkArrow";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizeService } from "@/i18n/localize";
import type { Service } from "@/types";

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

/**
 * One service with its overview video. Rows alternate sides (`flip`) so the
 * page reads as a sequence of spreads rather than a stack of identical boxes.
 */
export default function ServiceFeatureCard({ service: raw, flip = false }: { service: Service; flip?: boolean }) {
  const { t } = useLanguage();
  const service = localizeService(raw, t);
  if (!service.videoUrl) return null;

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <div className={`flex flex-col gap-6 lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">{service.title}</h2>
          <p className="max-w-[60ch] leading-relaxed text-muted">{service.intro}</p>
        </div>

        {service.highlights && service.highlights.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-ink">{t("svcCard.doTitle")}</h3>
            <ul className="flex flex-col border-t border-line">
              {service.highlights.map((item) => (
                <li key={item} className="border-b border-line py-2.5 text-sm leading-relaxed text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <LinkArrow to={`/services/${service.slug}`} className="text-aftech-strong">
          {t("svcCard.learn")}
        </LinkArrow>
      </div>

      <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        <div className="relative aspect-video overflow-hidden rounded-pro bg-deep-navy">
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
    </motion.article>
  );
}
