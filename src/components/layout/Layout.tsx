import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { pageTransition } from "@/lib/motion";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <motion.main
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
