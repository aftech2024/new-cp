import type { NavItem } from "@/types";

export const HALORA_URL = "https://compro.halora.co.id";

export const company = {
  legalName: "PT Aftech Daya Solusindo",
  shortName: "Aftech",
  tagline: "We Create Your Idea Into Reality",
  positioning: "We build the digital and physical world.",
  experience: "Over 5 years delivering software, IT infrastructure and building systems for government ministries, state-owned enterprises and private companies.",
  email: "aftech.daya@gmail.com",
  phone: "0822-3183-4977",
  whatsapp: "0822-1111-2295",
  social: {
    instagram: "https://instagram.com/aftechds",
    tiktok: "https://www.tiktok.com/@aftechds",
    siplah: "https://siplah.tokoladang.co.id/official-store/aftech-service.53680",
  },
};

/** wa.me wants the international format: 0822-… → 62822… */
export const WHATSAPP_URL = `https://wa.me/${company.whatsapp.replace(/\D/g, "").replace(/^0/, "62")}`;

export const locations = [
  {
    name: "Aftech Daya Solusindo",
    tag: "Technology and engineering",
    address: "Jl. Lingkar Timur No.23, Kuwasen, Karangkandri, Kec. Kesugihan, Kabupaten Cilacap, Jawa Tengah 53274",
  },
  {
    name: "Halora Galona Adikara",
    tag: "Civil and interior",
    address: "Jl. H. Adam Malik, Ruko 5Delapan, RT.004/RW.001, Kreo Selatan, Kec. Larangan, Kota Tangerang, Banten 15156",
  },
];

export const navItems: NavItem[] = [
  { label: "About", to: "/about" },
  {
    label: "Services",
    to: "/services",
    children: [
      { label: "Technology", to: "/services/technology" },
      { label: "Mechanical & Electrical", to: "/services/mechanical-electrical" },
      { label: "Integrated Solutions", to: "/services/integrated-solutions" },
    ],
  },
  { label: "Products", to: "/products" },
  { label: "Projects", to: "/projects" },
  // Appears once the first "Kabar Teknologi" edition is published (src/data/blog.ts).
  ...(__BLOG_HAS_EDITIONS__ ? [{ label: "Blog", to: "/blog" }] : []),
];

export const values = [
  "Innovation",
  "Integrity",
  "Execution",
  "Reliability",
  "Collaboration",
  "Continuous Improvement",
];

export const capabilityMatrix = [
  {
    group: "Technology",
    company: "Aftech",
    items: ["Software", "AI", "IoT", "Infrastructure", "Cloud", "Network", "Cybersecurity"],
  },
  {
    group: "Engineering",
    company: "Aftech",
    items: ["Mechanical", "Electrical", "HVAC", "Plumbing", "Fire Protection"],
  },
  {
    group: "Construction",
    company: "Halora",
    items: ["Civil", "Warehouse", "Renovation", "Infrastructure"],
  },
  {
    group: "Space",
    company: "Halora",
    items: ["Interior", "Fit-Out", "Furniture", "Renovation"],
  },
];

export const clients: string[] = [
  // Populate only with logos/names approved by the client — no fabricated list.
];

export const projectTypes = ["Technology", "Mechanical & Electrical", "Integrated Solution", "Other"];
