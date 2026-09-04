import type { NavItem } from "@/types";

export const HALORA_URL = "https://compro.halora.co.id";

export const company = {
  legalName: "PT Aftech Daya Solusindo",
  shortName: "Aftech",
  tagline: "We Create Your Idea Into Reality",
  positioning: "We build the digital and physical world.",
  email: "support@aftech.co.id",
  phone: "0822-3183-4977",
  whatsapp: "0822-3183-4977",
  social: {
    instagram: "https://instagram.com/aftechds",
  },
};

export const locations = [
  {
    name: "Aftech Daya Solusindo",
    tag: "Technology · Engineering",
    address: "Jl. Lingkar Timur No.23, Kuwasen, Karangkandri, Kec. Kesugihan, Kabupaten Cilacap, Jawa Tengah 53274",
  },
  {
    name: "Halora Galona Adikara",
    tag: "Civil · Interior",
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
  { label: "Projects", to: "/projects" },
  { label: "Insights", to: "/insights" },
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
    items: ["Software", "AI", "Infrastructure", "Cloud", "Network", "Cybersecurity"],
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
