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

export default function DestinationCard({ dest, onNavigate }: { dest: Destination; onNavigate: () => void }) {
  const Icon = dest.icon === "whatsapp" ? null : ICONS[dest.icon];
  const body = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg ${
          dest.icon === "whatsapp" ? "bg-[#25D366]/15 text-[#25D366]" : "bg-aftech/15 text-aftech-bright"
        }`}
      >
        {dest.image ? (
          <img src={dest.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : Icon ? (
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <WhatsAppIcon className="h-5 w-5" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-medium text-aftech-bright">{dest.kind}</span>
        <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-white/90">{dest.title}</span>
      </span>
      {dest.external ? (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-aftech-bright" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-aftech-bright" />
      )}
    </>
  );
  const className =
    "group flex items-center gap-3 rounded-xl bg-navy-800 p-2 pr-3 ring-1 ring-white/[0.08] transition hover:bg-navy-700 hover:ring-aftech-bright/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright";

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
