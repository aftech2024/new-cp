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
  const isHalora = brand === "halora";
  const accent = isHalora ? "text-halora-bronze" : "text-aftech-bright";
  const tick = isHalora ? "bg-halora-bronze" : "bg-aftech";

  return (
    <div className={`relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24 text-white ${isHalora ? "bg-deep-navy" : "bg-deep-navy"}`}>
      {backgroundImage ? (
        <>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${isHalora ? "from-deep-navy via-deep-navy/85" : "from-deep-navy via-deep-navy/85"} to-transparent`} />
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${isHalora ? "from-deep-navy via-deep-navy/40" : "from-deep-navy via-deep-navy/40"} to-transparent`} />
        </>
      ) : (
        <>
          <div className={`pointer-events-none absolute inset-0 ${isHalora ? "halora-hatch opacity-60" : "blueprint-dark"}`} aria-hidden="true" />
          <div
            className={`pointer-events-none absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full blur-3xl ${isHalora ? "bg-halora-bronze/20" : "bg-aftech/25"}`}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
        </>
      )}
      <Container className="relative flex flex-col gap-8">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl flex flex-col gap-5">
          {eyebrow && (
            <span className="flex items-center gap-3">
              <span className={`h-px w-10 ${tick}`} aria-hidden="true" />
              <span className={`spec-label ${accent}`}>{eyebrow}</span>
            </span>
          )}
          <h1 className="font-display font-extrabold leading-[1.02] tracking-[-0.02em] text-[clamp(38px,5vw,68px)]">{title}</h1>
          {description && <p className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">{description}</p>}
        </motion.div>
        {meta && meta.length > 0 && (
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-pro border border-white/12 bg-white/10">
            {meta.map((m) => (
              <div key={m.label} className={`${isHalora ? "bg-deep-navy/95" : "bg-deep-navy/95"} px-5 py-4`}>
                <dt className="spec-label text-white/40">{m.label}</dt>
                <dd className="mt-1.5 font-display text-sm font-bold text-white">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </Container>
      {/* bottom spec rule */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 md:px-10 pb-3">
          <span className="spec-label text-white/25">{isHalora ? "HALORA / CIVIL + INTERIOR" : "AFTECH / TECHNOLOGY + ENGINEERING"}</span>
          <span className="spec-label hidden sm:block text-white/25">DOC — V1.0</span>
        </div>
      </div>
    </div>
  );
}
