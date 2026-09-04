import { motion } from "framer-motion";
import { clipReveal, viewportOnce } from "@/lib/motion";

export type Motif = "technology" | "me" | "civil" | "interior" | "integrated" | "abstract";

const MOTIFS: Motif[] = ["technology", "me", "civil", "interior", "integrated", "abstract"];

export function isMotif(value: string): value is Motif {
  return (MOTIFS as string[]).includes(value);
}

interface ImageRevealProps {
  motif?: Motif;
  src?: string;
  ratio?: "hero" | "wide" | "project" | "service" | "square";
  label?: string;
  className?: string;
  brand?: "aftech" | "halora" | "auto";
}

const ratioClass: Record<NonNullable<ImageRevealProps["ratio"]>, string> = {
  hero: "aspect-[16/9] md:aspect-[21/9]",
  wide: "aspect-[16/9]",
  project: "aspect-[16/10]",
  service: "aspect-[4/3]",
  square: "aspect-square",
};

/**
 * Professional enterprise placeholder.
 * - technology/me/integrated → Aftech deep-navy + blueprint blue
 * - civil/interior → Halora warm architectural (concrete + bronze)
 */
const motifGradient: Record<Motif, string> = {
  technology: "from-[#04111D] via-[#0A2B4D] to-[#1479D1]",
  me: "from-[#04111D] via-[#10293F] to-[#2EA8FF]",
  civil: "from-[#1C1917] via-[#4A3A24] to-[#B7791F]",
  interior: "from-[#2A241E] via-[#8A6B3F] to-[#C8A15A]",
  integrated: "from-[#04111D] via-[#123B63] to-[#B7791F]",
  abstract: "from-[#071A2B] to-[#1479D1]",
};

const motifCompany: Record<Motif, { name: string; halora: boolean }> = {
  technology: { name: "AFTECH / IT", halora: false },
  me: { name: "AFTECH / ME", halora: false },
  civil: { name: "HALORA / CIVIL", halora: true },
  interior: { name: "HALORA / INTERIOR", halora: true },
  integrated: { name: "AFTECH × HALORA", halora: false },
  abstract: { name: "AFTECH", halora: false },
};

export default function ImageReveal({ motif = "abstract", src, ratio = "wide", label, className = "" }: ImageRevealProps) {
  const company = motifCompany[motif];

  if (src) {
    return (
      <motion.div
        variants={clipReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className={`group relative overflow-hidden rounded-pro ring-1 ring-inset ring-ink/15 shadow-card ${ratioClass[ratio]} ${className}`}
      >
        <img
          src={src}
          alt={label ?? ""}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className={`rounded-pro px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm ${company.halora ? "bg-halora-bronze/90 text-white" : "bg-deep-navy/80 text-white border border-white/15"}`}>
            {company.name}
          </span>
        </div>
        {label && (
          <span className="absolute bottom-3 left-3 right-3 truncate text-[13px] font-semibold text-white/95">
            {label}
          </span>
        )}
        {/* corner ticks — drawing-sheet detail */}
        <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-white/50" aria-hidden="true" />
        <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/50" aria-hidden="true" />
      </motion.div>
    );
  }

  const isWarm = motif === "civil" || motif === "interior";
  return (
    <motion.div
      variants={clipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`relative overflow-hidden rounded-pro bg-gradient-to-br ring-1 ring-inset ${isWarm ? "ring-halora-bronze/30" : "ring-white/10"} shadow-card ${motifGradient[motif]} ${ratioClass[ratio]} ${className}`}
    >
      {/* grid overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${motif}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#FFFFFF" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${motif})`} />
      </svg>
      {/* diagonal sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-white/[0.14]" aria-hidden="true" />
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className={`rounded-pro px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm border ${company.halora ? "bg-white/10 text-white border-white/20" : "bg-black/25 text-white border-white/15"}`}>
          {company.name}
        </span>
      </div>
      {isWarm && (
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2" aria-hidden="true">
          <div className="h-px bg-white/25" />
          <div className="mx-auto -mt-px h-6 w-px bg-white/25" />
        </div>
      )}
      {!isWarm && (
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-1.5 font-mono text-[10px] text-white/35 sm:flex" aria-hidden="true">
          <span>{"<sys>"}</span>
          <span>{"<net>"}</span>
          <span>{"<sec>"}</span>
        </div>
      )}
      {label && (
        <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <span className="truncate text-[13px] font-semibold text-white/90">{label}</span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" />
        </span>
      )}
      <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-white/50" aria-hidden="true" />
      <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/50" aria-hidden="true" />
    </motion.div>
  );
}
