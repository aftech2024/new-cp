import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AppRouter from "@/router";
import { company } from "@/data/company";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.shortName,
  url: import.meta.env.VITE_SITE_URL || "https://www.aftech.co.id",
};

export default function App() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>
      <ScrollToTop />
      <AppRouter />
    </>
  );
}
