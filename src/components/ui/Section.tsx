import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark" | "tint" | "halora" | "navy";
  id?: string;
}

const toneStyles: Record<NonNullable<SectionProps["tone"]>, string> = {
  light: "bg-off-white text-ink",
  dark: "bg-deep-navy text-white",
  navy: "bg-primary-navy text-white",
  tint: "bg-aftech-ice text-ink",
  halora: "bg-halora-linen text-ink",
};

export default function Section({ children, className = "", tone = "light", id }: SectionProps) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${toneStyles[tone]} ${className}`}>
      {children}
    </section>
  );
}
