import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Mail, Phone, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import MobileMenu from "./MobileMenu";
import { navItems, company } from "@/data/company";
import { useScrolled } from "@/hooks/useScrolled";
import logo from "@/assets/images/logo-aftech.png";

const serviceMeta: Record<string, string> = {
  "/services/technology": "Software · AI · Infrastructure · Cloud",
  "/services/mechanical-electrical": "Mechanical · Electrical · HVAC",
  "/services/integrated-solutions": "Smart building · End-to-end delivery",
};

export default function Navbar() {
  const scrolled = useScrolled();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const isServicesActive = location.pathname.startsWith("/services");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* top datum strip — legal entity + contact */}
        <div
          className={`hidden border-b transition-colors duration-300 md:block ${
            scrolled
              ? "border-white/10 bg-deep-navy/95 backdrop-blur-md"
              : "border-white/10 bg-deep-navy/70 backdrop-blur-sm"
          }`}
        >
          <Container className="flex h-8 items-center justify-between">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
              PT Aftech Daya Solusindo
            </p>
            <div className="flex items-center gap-5 font-mono text-[11px] tracking-wide text-white/55">
              <span className="hidden items-center gap-1.5 text-white/40 lg:flex">
                <MapPin className="h-3 w-3" /> Cilacap · Tangerang
              </span>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Mail className="h-3 w-3" /> {company.email}
              </a>
              <a
                href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Phone className="h-3 w-3" /> {company.phone}
              </a>
            </div>
          </Container>
        </div>

        {/* main bar */}
        <div
          className={`border-b transition-all duration-300 ease-premium ${
            scrolled
              ? "border-white/10 bg-deep-navy/92 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border-transparent bg-gradient-to-b from-deep-navy/85 to-deep-navy/20 backdrop-blur-[2px]"
          }`}
        >
          <Container className="flex h-16 items-center justify-between gap-8">
            {/* brand lockup */}
            <NavLink
              to="/"
              className="group flex shrink-0 items-center gap-3"
              onClick={() => setOpen(false)}
              aria-label="Aftech — home"
            >
              <img src={logo} alt="Aftech" className="h-8 w-auto" />
              <span className="hidden flex-col leading-none sm:flex">
                <span className="font-display text-[14px] font-extrabold tracking-[0.24em] text-white">
                  AFTECH
                </span>
                <span className="mt-1 font-mono text-[8.5px] font-medium tracking-[0.28em] text-aftech-bright">
                  TECHNOLOGY · ENGINEERING
                </span>
              </span>
              <span className="ml-1 hidden h-8 w-px bg-white/10 xl:block" aria-hidden="true" />
              <span className="hidden font-mono text-[10px] leading-tight tracking-[0.14em] text-white/35 xl:block">
                DAYA
                <br />
                SOLUSINDO
              </span>
            </NavLink>

            {/* primary nav — underline active state */}
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {navItems.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setDropOpen(true)}
                    onMouseLeave={() => setDropOpen(false)}
                  >
                    <NavLink
                      to={item.to}
                      className={`relative flex items-center gap-1.5 py-2 text-[13.5px] font-semibold tracking-wide transition-colors ${
                        isServicesActive ? "text-white" : "text-white/65 hover:text-white"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-white/40 transition-transform duration-300 ${
                          dropOpen ? "rotate-180" : ""
                        }`}
                      />
                      <span
                        className={`absolute inset-x-0 -bottom-[1px] h-[2px] origin-left rounded-full bg-aftech-bright transition-transform duration-300 ${
                          isServicesActive || dropOpen ? "scale-x-100" : "scale-x-0"
                        }`}
                        aria-hidden="true"
                      />
                    </NavLink>
                    {dropOpen && (
                      <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                        <div className="w-[340px] overflow-hidden rounded-pro border border-white/10 bg-[#0A1F33] shadow-card">
                          <div className="border-b border-white/10 bg-white/[0.03] px-5 py-2.5">
                            <span className="spec-label text-aftech-bright">
                              Capabilities
                            </span>
                          </div>
                          {item.children.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={() => setDropOpen(false)}
                              className="group flex flex-col gap-0.5 border-b border-white/[0.06] px-5 py-3.5 transition-colors last:border-0 hover:bg-aftech/10"
                            >
                              <span className="flex items-center justify-between text-sm font-semibold text-white/85 group-hover:text-white">
                                {child.label}
                                <span className="font-mono text-xs text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-aftech-bright">
                                  →
                                </span>
                              </span>
                              {serviceMeta[child.to] && (
                                <span className="font-mono text-[10.5px] tracking-wide text-white/40">
                                  {serviceMeta[child.to]}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : item.external ? (
                  <a
                    key={item.label}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative py-2 text-[13.5px] font-semibold tracking-wide text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative py-2 text-[13.5px] font-semibold tracking-wide transition-colors ${
                        isActive ? "text-white" : "text-white/65 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          className={`absolute inset-x-0 -bottom-[1px] h-[2px] origin-left rounded-full bg-aftech-bright transition-transform duration-300 ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </NavLink>
                ),
              )}
            </nav>

            {/* CTA cluster */}
            <div className="hidden items-center gap-4 lg:flex">
              <a
                href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                className="hidden font-mono text-[12px] font-medium tracking-wide text-white/55 transition-colors hover:text-white xl:block"
              >
                {company.phone}
              </a>
              <span className="hidden h-5 w-px bg-white/10 xl:block" aria-hidden="true" />
              <Button to="/contact" variant="primary" className="!px-5 !py-2.5">
                Start a Project
              </Button>
            </div>

            <button
              type="button"
              className="p-2 -mr-2 text-white lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </Container>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
