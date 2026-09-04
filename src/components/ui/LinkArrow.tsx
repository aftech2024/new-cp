import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface LinkArrowProps {
  children: string;
  to?: string;
  href?: string;
  className?: string;
}

export default function LinkArrow({ children, to, href, className = "" }: LinkArrowProps) {
  const classes = `group inline-flex items-center gap-1.5 font-semibold text-sm tracking-wide ${className}`;
  const content = (
    <>
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-current transition-all duration-300 ease-premium group-hover:w-full" />
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to ?? "#"} className={classes}>
      {content}
    </Link>
  );
}
