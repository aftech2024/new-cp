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
  /** Alt text for a real photograph. Falls back to `label` when omitted. */
  alt?: string;
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

/** Flat fill for a slot that has no photograph yet: navy for Aftech, bronze-dark for Halora. */
const motifFill: Record<Motif, string> = {
  technology: "bg-navy-700",
  me: "bg-navy-700",
  integrated: "bg-navy-700",
  abstract: "bg-navy-700",
  civil: "bg-[#3A2E1F]",
  interior: "bg-[#3A2E1F]",
};

/**
 * A photograph in a fixed-ratio frame. It does not animate on its own: the
 * cards and grids that hold it already fade in, and a second wipe on every
 * image would only stack motion.
 */
export default function ImageReveal({ motif = "abstract", src, ratio = "wide", label, alt, className = "" }: ImageRevealProps) {
  if (src) {
    return (
      <div className={`group relative overflow-hidden rounded-pro bg-line ${ratioClass[ratio]} ${className}`}>
        <img
          src={src}
          alt={alt ?? label ?? ""}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-end overflow-hidden rounded-pro p-4 ${motifFill[motif]} ${ratioClass[ratio]} ${className}`}>
      {label && <span className="text-sm font-semibold text-white/80">{label}</span>}
    </div>
  );
}
