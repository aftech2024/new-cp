import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
}

/**
 * Canonical host is the bare domain. Normalising here means a stray "www." in
 * VITE_SITE_URL cannot emit canonicals pointing at the host that .htaccess
 * redirects away from.
 */
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://aftech.co.id").replace("://www.", "://");
const SITE_NAME = import.meta.env.VITE_SITE_NAME || "PT Aftech Daya Solusindo";

export default function Seo({ title, description, path = "/", type = "website" }: SeoProps) {
  const url = `${SITE_URL.replace(/\/$/, "")}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
