import type { Service } from "@/types";
import technologyPhoto from "@/assets/images/datacenter/overhead-services.jpg";

export const services: Service[] = [
  {
    slug: "technology",
    number: "01",
    title: "Technology",
    shortStatement: "Digital solutions that help organizations operate smarter, connect better and scale with confidence.",
    image: technologyPhoto,
    imageAlt: "Overhead services and cable containment above a data hall rack row",
    intro:
      "We design and deliver digital solutions that help organizations operate smarter, connect better and scale with confidence — from software to infrastructure to cybersecurity. Drone photogrammetry is a flagship product: we turn aerial survey data into terrain models and volume reports project teams can act on the same day.",
    capabilities: [
      "Drone Photogrammetry",
      "Software Development",
      "AI Solutions",
      "IT Infrastructure",
      "Cloud",
      "Network",
      "Cybersecurity",
      "System Integration",
      "Digital Transformation",
      "Automation",
    ],
    process: ["Discovery", "Architecture", "Build", "Integrate", "Support"],
    faq: [
      {
        question: "Does Aftech build custom software or only integrate existing systems?",
        answer:
          "Both. We build custom software where it's the right fit, and integrate proven platforms where that serves the project better.",
      },
      {
        question: "Can Aftech support an existing IT infrastructure?",
        answer:
          "Yes — we work with existing environments as well as greenfield builds, covering network, cloud, and security.",
      },
      {
        question: "What is drone photogrammetry and when is it useful?",
        answer:
          "It's the process of stitching overlapping drone photos into an accurate 3D model of a site — an orthomosaic map, elevation model, or point cloud. It's most useful for earthworks and construction sites that need frequent, low-cost volume and progress data without waiting on a ground survey crew.",
      },
    ],
    highlights: [
      "Fly a site and get cut/fill earthwork volumes without a ground survey crew",
      "Turn drone imagery into orthomosaic maps, DEMs and 3D point clouds",
      "Compare as-built terrain against design grade to catch overages early",
      "Track stockpile and progress changes with weekly or monthly flyovers",
      "Layer CAD and orthophoto data to brief stakeholders with visual evidence",
    ],
    videoUrl: "https://www.youtube.com/embed/qKlWAq8zQBk",
  },
  {
    slug: "mechanical-electrical",
    number: "02",
    title: "Mechanical & Electrical",
    shortStatement: "Building systems engineered for reliability — mechanical, electrical, HVAC and fire protection.",
    intro:
      "Our mechanical and electrical team designs and executes building systems that keep facilities running safely and efficiently.",
    capabilities: [
      "Mechanical Systems",
      "Electrical Systems",
      "HVAC",
      "Plumbing",
      "Fire Protection",
      "Building Systems",
    ],
    process: ["Assessment", "Design", "Installation", "Commissioning", "Maintenance"],
    faq: [
      {
        question: "Does Aftech handle both design and installation?",
        answer: "Yes, our ME team covers design, installation and commissioning of building systems.",
      },
    ],
    highlights: [
      "Monitor HVAC, electrical and fire protection systems as one",
      "Verify installation quality before sign-off and handover",
      "Track commissioning progress room by room",
      "Catch cross-trade clashes before they cause rework",
      "Keep maintenance history documented for every system",
    ],
    videoUrl: "https://www.youtube.com/embed/5l23bF_k0Vk",
  },
  {
    slug: "integrated-solutions",
    number: "03",
    title: "Integrated Solutions",
    shortStatement: "One program, two companies — technology and physical infrastructure working together.",
    intro:
      "For projects that span digital and physical infrastructure, Aftech coordinates technology and engineering directly, and partners with our second company Halora for civil construction and interior work — one accountable program.",
    capabilities: [
      "Smart Building",
      "Digital Construction",
      "Enterprise Infrastructure",
      "Cross-company Project Management",
    ],
    process: ["Requirements", "Cross-discipline Design", "Coordinated Execution", "Integration Testing", "Handover"],
    faq: [
      {
        question: "What kind of projects need an integrated solution?",
        answer:
          "Projects like smart buildings or new facilities where IT, network, security, electrical and construction all need to work together from day one — coordinated across Aftech and Halora.",
      },
    ],
    highlights: [
      "Run technology, engineering and construction under one accountable team",
      "Sequence IT, electrical and civil work so trades don't block each other",
      "Avoid the coordination gaps that come from managing separate vendors",
      "Get a single point of contact across Aftech and Halora",
      "Scale from a single smart building to a multi-site rollout",
    ],
    videoUrl: "https://www.youtube.com/embed/0QJEm75IdoM",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
