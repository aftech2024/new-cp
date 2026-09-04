import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "dark" | "halora" | "halora-outline" | "ghost-light" | "ghost";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  withArrow?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // Aftech IT — enterprise blue
  primary:
    "bg-aftech text-white border border-aftech shadow-[0_8px_24px_-8px_rgba(20,121,209,0.6)] hover:bg-[#0F6BBE] hover:border-[#0F6BBE]",
  secondary: "bg-white text-ink border border-line shadow-pro hover:border-aftech hover:text-aftech",
  dark: "bg-deep-navy text-white border border-white/15 hover:border-aftech-bright hover:bg-navy-800",
  // Halora — civil / interior bronze
  halora:
    "bg-halora-bronze text-white border border-halora-bronze shadow-[0_8px_24px_-8px_rgba(183,121,31,0.6)] hover:bg-deep-navy hover:border-deep-navy",
  "halora-outline": "bg-transparent text-halora-bronze border border-halora-bronze/50 hover:bg-halora-bronze hover:text-white hover:border-halora-bronze",
  "ghost-light": "bg-white/5 text-white border border-white/20 backdrop-blur-sm hover:bg-white/10 hover:border-white/40",
  ghost: "bg-transparent text-inherit border border-current/30 hover:border-current",
};

export default function Button({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  withArrow = true,
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-pro px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-premium disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
