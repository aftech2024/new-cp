import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { navItems, company } from "@/data/company";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 overflow-y-auto bg-deep-navy lg:hidden"
        >
          <div className="pointer-events-none absolute inset-0 blueprint-dark" aria-hidden="true" />
          <nav
            aria-label="Mobile"
            className="relative flex min-h-full flex-col justify-center gap-5 px-8 pt-32 pb-16"
          >
            <span className="spec-label text-aftech-bright">AFTECH — Menu</span>
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {item.external ? (
                  <a
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-3xl font-bold text-white"
                    onClick={onClose}
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className="font-display text-3xl font-bold text-white"
                  >
                    {item.label}
                  </NavLink>
                )}
                {item.children && (
                  <div className="mt-3 flex flex-col gap-2 border-l border-white/15 pl-4">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={onClose}
                        className="text-base text-white/60"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-4 flex flex-col gap-2.5 rounded-pro border border-white/10 bg-white/[0.04] p-5"
            >
              <span className="spec-label text-aftech-bright">Direct contact</span>
              <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 text-sm text-white/80">
                <Mail className="h-4 w-4 text-aftech-bright" /> {company.email}
              </a>
              <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2.5 text-sm text-white/80">
                <Phone className="h-4 w-4 text-aftech-bright" /> {company.phone}
              </a>
            </motion.div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button to="/contact" onClick={onClose}>
                Start a Project
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
