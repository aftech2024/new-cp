export interface PartnerLogo {
  src: string;
  name: string;
}

/**
 * Auto-load semua logo dari src/assets/images/partner/.
 * Cukup taruh file di folder itu — tidak perlu edit kode.
 * Lihat README.txt di folder tersebut untuk panduan.
 */
const modules = import.meta.glob<string>("../assets/images/partner/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
});

function prettyName(path: string): string {
  const file = path.split("/").pop() ?? path;
  const base = file.replace(/\.[^.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const partnerLogos: PartnerLogo[] = Object.entries(modules)
  .filter(([, src]) => typeof src === "string" && src.length > 0)
  .map(([path, src]) => ({ src: src as string, name: prettyName(path) }))
  .sort((a, b) => a.name.localeCompare(b.name));
