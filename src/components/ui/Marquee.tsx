import type { ReactNode } from "react";

export default function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}>
      <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-16 hover:[animation-play-state:paused] motion-reduce:animate-none">
        <div className="flex items-center gap-16 pr-16">{children}</div>
        <div className="flex items-center gap-16 pr-16" aria-hidden="true">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
