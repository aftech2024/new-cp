import { Link } from "react-router-dom";
import { Phone, Mail, Instagram, Store, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import TikTokIcon from "@/components/ui/TikTokIcon";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { AftechMark, HaloraMark } from "@/components/ui/CompanyMark";
import { company, locations, navItems, HALORA_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/images/logo-aftech.png";

const exploreKeys = [
  { key: "nav.about", to: "/about" },
  { key: "nav.projects", to: "/projects" },
  { key: "nav.insights", to: "/insights" },
  { key: "nav.contact", to: "/contact" },
];

const serviceChildLabelKey: Record<string, string> = {
  "/services/technology": "svcData.technology.title",
  "/services/mechanical-electrical": "svcData.mechanical-electrical.title",
  "/services/integrated-solutions": "svcData.integrated-solutions.title",
};

export default function Footer() {
  const { t } = useLanguage();
  const serviceLinks = navItems.find((item) => item.label === "Services")?.children ?? [];
  return (
    <footer className="bg-deep-navy text-white/70">
      {/* dual-company strip */}
      <div className="border-b border-white/10">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-px py-0">
          <div className="flex items-center gap-4 py-5 md:pr-8">
            <AftechMark className="h-10 w-auto" />
            <div>
              <p className="font-display text-sm font-extrabold tracking-[0.14em] text-white">AFTECH DAYA SOLUSINDO</p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-aftech-bright">{t("foot.techTag")}</p>
            </div>
          </div>
          <a href={HALORA_URL} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-5 md:pl-8 md:border-l border-white/10">
            <HaloraMark className="h-10 w-10" />
            <div className="flex-1">
              <p className="flex items-center gap-2 font-display text-sm font-extrabold tracking-[0.14em] text-white">
                HALORA GALONA ADIKARA
                <ArrowUpRight className="h-3.5 w-3.5 text-halora-bronze transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/55">{t("foot.secondCo")}</p>
            </div>
          </a>
        </Container>
      </div>

      <Container className="py-16 grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-12">
        {/* brand + contact */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <img src={logo} alt="Aftech" className="h-9 w-auto self-start" />
            <p className="text-sm max-w-sm leading-relaxed">
              {t("foot.positioningA")} {t("foot.positioningB")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pro border border-white/15 text-aftech-bright">
                <WhatsAppIcon className="h-4 w-4" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{t("foot.whatsapp")}</span>
                <span className="text-sm text-white">{company.whatsapp}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pro border border-white/15 text-aftech-bright">
                <Phone className="h-4 w-4" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{t("foot.office")}</span>
                <span className="text-sm text-white">{company.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pro border border-white/15 text-aftech-bright">
                <Mail className="h-4 w-4" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{t("foot.email")}</span>
                <span className="text-sm text-white">{company.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={company.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @aftechds"
              className="flex h-9 w-9 items-center justify-center rounded-pro border border-white/15 text-white/60 hover:text-white hover:border-aftech-bright transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={company.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok @aftechds"
              className="flex h-9 w-9 items-center justify-center rounded-pro border border-white/15 text-white/60 hover:text-white hover:border-aftech-bright transition-colors"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
            <a
              href={company.social.siplah}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Siplah Tokoladang — Aftech official store"
              title="Siplah Tokoladang — Aftech official store"
              className="flex h-9 w-9 items-center justify-center rounded-pro border border-white/15 text-white/60 hover:text-white hover:border-aftech-bright transition-colors"
            >
              <Store className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* explore */}
        <div className="flex flex-col gap-5">
            <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-aftech-bright" />
            {t("foot.explore")}
          </span>
          <nav aria-label="Footer explore" className="flex flex-col gap-3">
            {exploreKeys.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm hover:text-white transition-colors w-fit">
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* services */}
        <div className="flex flex-col gap-5">
          <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-aftech-bright" />
            Aftech
          </span>
          <nav aria-label="Footer services" className="flex flex-col gap-3">
            {serviceLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm hover:text-white transition-colors w-fit">
                {t(serviceChildLabelKey[link.to] ?? link.label, link.label)}
              </Link>
            ))}
            <a
              href={HALORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-pro border border-halora-bronze/40 bg-halora-bronze/10 px-3 py-2 text-sm font-semibold text-white hover:bg-halora-bronze hover:text-white transition-colors w-fit"
            >
              {t("foot.civil")}
            </a>
          </nav>
        </div>

        {/* offices */}
        <div className="flex flex-col gap-5">
            <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-halora-bronze" />
            {t("foot.offices")}
          </span>
          <div className="flex flex-col gap-5">
            {locations.map((loc) => (
              <div key={loc.name} className="flex flex-col gap-1.5 rounded-pro border border-white/10 bg-white/[0.03] p-4">
                <span className="flex items-center gap-2.5">
                  {loc.tag.includes("Civil") ? (
                    <HaloraMark className="h-6 w-6" />
                  ) : (
                    <AftechMark className="h-6 w-auto" />
                  )}
                  <span className="font-display text-[13px] font-bold text-white">{loc.name}</span>
                </span>
                <span className={`font-mono text-[10px] tracking-[0.18em] ${loc.tag.includes("Civil") ? "text-white/55" : "text-aftech-bright"}`}>{loc.tag.toUpperCase()}</span>
                <span className="text-[13px] text-white/60 leading-relaxed">{loc.address}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-5 text-xs text-white/40">
          <span>© {new Date().getFullYear()} {company.legalName}. {t("foot.rights")}</span>
          <span className="flex flex-wrap items-center gap-4">
            <LanguageToggle compact />
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em]">
              <span className="h-1.5 w-1.5 rounded-full bg-aftech-bright" />
              {t("foot.group")}
            </span>
          </span>
        </Container>
      </div>
    </footer>
  );
}
