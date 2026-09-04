import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow?: string;
  index?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  brand?: "aftech" | "halora";
}

const brandAccent: Record<NonNullable<SectionHeadingProps["brand"]>, string> = {
  aftech: "text-aftech",
  halora: "text-halora-bronze",
};

const brandTick: Record<NonNullable<SectionHeadingProps["brand"]>, string> = {
  aftech: "bg-aftech",
  halora: "bg-halora-bronze",
};

export default function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  tone = "light",
  brand = "aftech",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  const mutedClass = tone === "dark" ? "text-white/60" : "text-muted";
  const titleClass = tone === "dark" ? "text-white" : "text-ink";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`flex flex-col gap-4 max-w-2xl ${alignClass}`}
    >
      {eyebrow && (
        <span className="flex items-center gap-3">
          {align === "left" && <span className={`h-px w-8 ${brandTick[brand]}`} aria-hidden="true" />}
          <span className={`spec-label ${tone === "dark" ? (brand === "halora" ? "text-white/65" : "text-aftech-bright") : brandAccent[brand]}`}>
            {index ? `[${index}] — ${eyebrow}` : eyebrow}
          </span>
          {align === "center" && <span className={`h-px w-8 ${brandTick[brand]}`} aria-hidden="true" />}
        </span>
      )}
      <h2 className={`font-display font-extrabold leading-[1.04] tracking-[-0.02em] text-[clamp(30px,3.6vw,50px)] ${titleClass}`}>
        {title}
      </h2>
      {description && <p className={`text-base md:text-lg leading-relaxed ${mutedClass}`}>{description}</p>}
    </motion.div>
  );
}
