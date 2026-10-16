import type { ReactNode } from "react";
import { Lock } from "lucide-react";

/** A clean browser window around an app screenshot, so captures never carry anyone's own browser chrome. */
export default function BrowserFrame({
  host,
  children,
  className = "",
}: {
  host?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white shadow-[0_40px_100px_-40px_rgba(4,17,29,0.75)] ring-1 ring-ink/10 ${className}`}>
      <div className="flex items-center gap-3 border-b border-line bg-[#F3F5F8] px-3.5 py-2.5" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        {host && (
          <span className="mx-auto flex min-w-0 max-w-[60%] items-center gap-1.5 truncate rounded-md bg-white px-3 py-1 font-mono text-[11px] text-muted ring-1 ring-line">
            <Lock className="h-3 w-3 shrink-0" />
            {host}
          </span>
        )}
        {host && <span className="w-[42px]" />}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
