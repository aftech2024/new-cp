import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Container from "./Container";
import Breadcrumb, { type Crumb } from "./Breadcrumb";
import { fadeUp } from "@/lib/motion";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: Crumb[];
  children?: ReactNode;
  backgroundImage?: string;
  brand?: "aftech" | "halora";
  meta?: { label: string; value: string }[];
}

/**
 * The opening band of every inner page. A field photo carries it when the page
 * has one; otherwise it is plain navy, so the headline does the work.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
  backgroundImage,
  brand = "aftech",
  meta,
}: PageHeroProps) {
  const tick = brand === "halora" ? "bg-halora-bronze" : "bg-aftech-bright";

  return (
    <div className="relative overflow-hidden bg-deep-navy pb-16 pt-36 text-white md:pb-20 md:pt-44">
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/85 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep-navy via-deep-navy/40 to-transparent" />
        </>
      )}
      <Container className="relative flex flex-col gap-8">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex max-w-3xl flex-col gap-5">
          {eyebrow && (
            <span className="flex items-center gap-3">
              <span className={`h-px w-8 ${tick}`} aria-hidden="true" />
              <span className="text-sm font-semibold text-white/75">{eyebrow}</span>
            </span>
          )}
          <h1 className="font-display font-extrabold leading-[1.02] tracking-[-0.02em] text-[clamp(34px,4.3vw,58px)]">{title}</h1>
          {description && <p className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{description}</p>}
        </motion.div>
        {meta && meta.length > 0 && (
          <dl className="grid max-w-3xl grid-cols-2 gap-x-8 gap-y-5 border-t border-white/15 pt-6 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-white/55">{m.label}</dt>
                <dd className="mt-1 font-semibold text-white">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </Container>
    </div>
  );
}
