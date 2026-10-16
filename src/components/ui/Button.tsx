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
  /** Defaults to on for external links only: the ↗ means "opens another site". */
  withArrow?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // Aftech IT — enterprise blue
  primary:
    // a step darker than the brand blue so 12px white text clears 4.5:1
    "bg-aftech-strong text-white border border-aftech-strong hover:bg-[#0B5CA6] hover:border-[#0B5CA6]",
  secondary: "bg-white text-ink border border-line hover:border-aftech hover:text-aftech",
  dark: "bg-deep-navy text-white border border-white/15 hover:border-aftech-bright hover:bg-navy-800",
  // Halora — civil / interior bronze
  halora:
    "bg-halora-deep text-white border border-halora-deep hover:bg-deep-navy hover:border-deep-navy",
  "halora-outline": "bg-transparent text-halora-deep border border-halora-bronze hover:bg-halora-deep hover:text-white hover:border-halora-deep",
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
  withArrow = Boolean(href),
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-pro px-6 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aftech-bright font-mono text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-premium disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`;

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
