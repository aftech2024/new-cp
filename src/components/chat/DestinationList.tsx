import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Briefcase, ChevronRight, FileText, Globe, Layers, MessageSquareText, MonitorPlay } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import type { Destination, DestinationIcon } from "./destinations";

const ICONS: Record<Exclude<DestinationIcon, "whatsapp">, typeof Briefcase> = {
  page: FileText,
  contact: MessageSquareText,
  project: Briefcase,
  service: Layers,
  insight: BookOpen,
  live: MonitorPlay,
  external: Globe,
};

function Row({ dest, onNavigate }: { dest: Destination; onNavigate: () => void }) {
  const Icon = dest.icon === "whatsapp" ? null : ICONS[dest.icon];
  const body = (
    <>
      {Icon ? (
        <Icon className="h-4 w-4 shrink-0 text-aftech-bright" strokeWidth={1.75} />
      ) : (
        <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-white/90">{dest.title}</span>
        <span className="block text-xs text-white/45">{dest.kind}</span>
      </span>
      {dest.external ? (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-white/70" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-white/70" />
      )}
    </>
  );
  const className =
    "group flex items-center gap-3 px-4 py-2.5 outline-none transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.07]";

  return dest.external ? (
    <a href={dest.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link to={dest.href} onClick={onNavigate} className={className}>
      {body}
    </Link>
  );
}

/** The pages an answer points to, as one grouped list rather than a stack of cards. */
export default function DestinationList({ items, onNavigate }: { items: Destination[]; onNavigate: () => void }) {
  return (
    <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-xl ring-1 ring-white/[0.08]">
      {items.map((dest) => (
        <li key={dest.href}>
          <Row dest={dest} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  );
}
