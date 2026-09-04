import type { Project } from "@/types";
import projectEnterpriseIt from "@/assets/images/project-enterprise-it.jpg";
import fewsPoleInstallation from "@/assets/images/fews-pole-installation.jpg";
import meikartaRooftopInstall from "@/assets/images/meikarta/rooftop-install.jpg";
import meikartaFirePanelSkyline from "@/assets/images/meikarta/fire-panel-skyline.jpg";
import meikartaAccessControlPanel from "@/assets/images/meikarta/access-control-panel.jpg";
import meikartaMagneticDoorLock from "@/assets/images/meikarta/magnetic-door-lock.jpg";
import meikartaEquipmentCabinet from "@/assets/images/meikarta/equipment-cabinet.jpg";
import meikartaDoorCloserDetail from "@/assets/images/meikarta/door-closer-detail.jpg";
import meikartaRooftopWorker from "@/assets/images/meikarta/rooftop-worker.jpg";
import meikartaControlRoomWide from "@/assets/images/meikarta/control-room-wide.jpg";
import meikartaMonitoringWall from "@/assets/images/meikarta/monitoring-wall.jpg";
import meikartaCctvTestingStanding from "@/assets/images/meikarta/cctv-testing-standing.jpg";
import meikartaCctvTestingCrouching from "@/assets/images/meikarta/cctv-testing-crouching.jpg";
import fieldRooftop01 from "@/assets/images/meikarta/field/rooftop-fire-point-01.jpg";
import fieldRooftop02 from "@/assets/images/meikarta/field/rooftop-fire-point-02.jpg";
import fieldRooftop03 from "@/assets/images/meikarta/field/rooftop-fire-point-03.jpg";
import fieldRooftop04 from "@/assets/images/meikarta/field/rooftop-fire-point-04.jpg";
import fieldRooftop05 from "@/assets/images/meikarta/field/rooftop-fire-point-05.jpg";
import fieldNvrWall from "@/assets/images/meikarta/field/nvr-monitoring-wall.jpg";
import fieldDome01 from "@/assets/images/meikarta/field/dome-camera-tower-01.jpg";
import fieldDome02 from "@/assets/images/meikarta/field/dome-camera-tower-02.jpg";
import fieldDome03 from "@/assets/images/meikarta/field/dome-camera-tower-03.jpg";
import fieldHikMonitor from "@/assets/images/meikarta/field/hikvision-nvr-monitor.jpg";
import fieldCabinet01 from "@/assets/images/meikarta/field/cabinet-testing-01.jpg";
import fieldCabinet02 from "@/assets/images/meikarta/field/cabinet-testing-02.jpg";
import fieldNetCabinet01 from "@/assets/images/meikarta/field/network-cabinet-01.jpg";
import fieldNetCabinet02 from "@/assets/images/meikarta/field/network-cabinet-02.jpg";
import fieldSiteTeam from "@/assets/images/meikarta/field/site-team-meikarta.jpg";
import dcRackRow from "@/assets/images/datacenter/rack-row.jpg";
import dcOverheadServices from "@/assets/images/datacenter/overhead-services.jpg";
import dcCabinetStaging from "@/assets/images/datacenter/cabinet-staging.jpg";
import dcCabinetFitout from "@/assets/images/datacenter/cabinet-fitout.jpg";

/**
 * FEWS Adipala field documentation — auto-loaded from
 * src/assets/images/fews/. Drop files there and add the
 * filename + caption to FEWS_ORDER / FEWS_CAPTIONS below.
 */
const fewsModules = import.meta.glob<string>("../assets/images/fews/*.jpg", {
  eager: true,
  import: "default",
});

const fewsByFile: Record<string, string> = {};
for (const [path, src] of Object.entries(fewsModules)) {
  const file = path.split("/").pop();
  if (file && typeof src === "string") fewsByFile[file] = src;
}

const FEWS_ORDER = [
  "fews-thermal-01.jpg",
  "fews-thermal-02.jpg",
  "fews-thermal-03.jpg",
  "fews-thermal-04.jpg",
  "fews-thermal-05.jpg",
  "fews-unit-01.jpg",
  "fews-unit-02.jpg",
  "fews-unit-03.jpg",
  "fews-unit-04.jpg",
  "fews-cable-01.jpg",
  "fews-cable-02.jpg",
  "fews-cable-03.jpg",
  "fews-cable-04.jpg",
  "fews-cable-05.jpg",
  "fews-cable-06.jpg",
  "fews-cable-07.jpg",
  "fews-cable-08.jpg",
  "fews-height-01.jpg",
  "fews-height-02.jpg",
  "fews-height-03.jpg",
  "fews-height-04.jpg",
  "fews-height-05.jpg",
  "fews-height-06.jpg",
  "fews-height-07.jpg",
  "fews-height-08.jpg",
  "fews-height-09.jpg",
  "fews-height-10.jpg",
  "fews-height-11.jpg",
];

const FEWS_CAPTIONS: Record<string, string> = {
  "fews-thermal-01.jpg": "Thermal camera mounting",
  "fews-thermal-02.jpg": "Camera housing installation",
  "fews-thermal-03.jpg": "Mounting works at height",
  "fews-thermal-04.jpg": "Coal conveyor — monitored area",
  "fews-thermal-05.jpg": "Conveyor gallery — monitored area",
  "fews-unit-01.jpg": "Camera unit on steel structure",
  "fews-unit-02.jpg": "Night site work",
  "fews-unit-03.jpg": "Equipment housing check",
  "fews-unit-04.jpg": "Structure & conduit routing",
  "fews-cable-01.jpg": "Cable preparation",
  "fews-cable-02.jpg": "Crew on structure",
  "fews-cable-03.jpg": "Site coordination",
  "fews-cable-04.jpg": "Panel termination",
  "fews-cable-05.jpg": "Indoor routing",
  "fews-cable-06.jpg": "Pole setting works",
  "fews-cable-07.jpg": "Indoor crew works",
  "fews-cable-08.jpg": "Conduit detail",
  "fews-height-01.jpg": "At-height works — Adipala",
  "fews-height-02.jpg": "Site briefing",
  "fews-height-03.jpg": "Site mobilization",
  "fews-height-04.jpg": "Cable coiling",
  "fews-height-05.jpg": "Equipment delivery",
  "fews-height-06.jpg": "Material preparation",
  "fews-height-07.jpg": "Indoor installation",
  "fews-height-08.jpg": "Equipment setup",
  "fews-height-09.jpg": "Hall overview",
  "fews-height-10.jpg": "Ladder access works",
  "fews-height-11.jpg": "Monitoring desk setup",
};

const fewsGallery = FEWS_ORDER.filter((f) => fewsByFile[f]).map((f) => ({
  image: fewsByFile[f],
  caption: FEWS_CAPTIONS[f] ?? "Field documentation — Adipala",
}));

/**
 * Placeholder project data. No client names, values, or counts are invented —
 * bracketed fields must be replaced with verified information before publish.
 */
export const projects: Project[] = [
  {
    id: "p1",
    slug: "fews-camera-installation",
    title: "Installation FEWS Camera",
    category: "technology",
    client: "PLN Indonesia Power Adipala",
    location: "Adipala, Cilacap",
    status: "completed",
    description:
      "Installation of a Fire Early Warning System (FEWS) with thermal imaging cameras to monitor coal storage and conveyor areas for early fire detection.",
    scope: ["Thermal Camera Installation", "Fire Detection System", "Network Cabling", "System Integration"],
    coverImage: projectEnterpriseIt,
    gallery: [
      { image: projectEnterpriseIt, caption: "FEWS Camera — Coal Storage Area" },
      { image: fewsPoleInstallation, caption: "Camera pole installation — coal yard" },
      ...fewsGallery,
    ],
    featured: true,
  },
  {
    id: "p2",
    slug: "cctv-access-door-installation",
    title: "CCTV & Access Door Installation",
    category: "technology",
    client: "[CLIENT NAME]",
    location: "Meikarta District 2",
    status: "completed",
    description: "Installation of CCTV surveillance and access door control systems across a residential district.",
    scope: ["CCTV Installation", "Access Control", "Network Cabling", "System Integration"],
    coverImage: fieldNvrWall,
    gallery: [
      { image: fieldNvrWall, caption: "NVR monitoring wall — lobby & floors" },
      { image: meikartaRooftopInstall, caption: "Field Installation" },
      { image: fieldRooftop01, caption: "Rooftop fire alarm & camera point" },
      { image: fieldRooftop02, caption: "Rooftop installation point" },
      { image: fieldRooftop03, caption: "Rooftop installation point" },
      { image: fieldRooftop04, caption: "Rooftop installation point" },
      { image: fieldRooftop05, caption: "Rooftop installation point" },
      { image: fieldDome02, caption: "Dome camera — Tower 56009" },
      { image: fieldDome01, caption: "Dome camera installation — tower" },
      { image: fieldDome03, caption: "Dome camera installation — tower" },
      { image: fieldHikMonitor, caption: "Hikvision NVR monitor — corridor coverage" },
      { image: meikartaControlRoomWide, caption: "CCTV Control Room" },
      { image: meikartaMonitoringWall, caption: "Central Monitoring Display" },
      { image: fieldCabinet01, caption: "Cabinet wiring & camera testing" },
      { image: fieldCabinet02, caption: "Field cabinet & testing" },
      { image: fieldNetCabinet01, caption: "Network cabinet termination" },
      { image: fieldNetCabinet02, caption: "Switch & UTP termination" },
      { image: fieldSiteTeam, caption: "Site team — Meikarta" },
      { image: meikartaFirePanelSkyline, caption: "Fire & Access Panel" },
      { image: meikartaAccessControlPanel, caption: "Access Control Panel" },
      { image: meikartaMagneticDoorLock, caption: "Magnetic Door Lock" },
      { image: meikartaEquipmentCabinet, caption: "Equipment Cabinet" },
      { image: meikartaDoorCloserDetail, caption: "Door Closer Installation" },
      { image: meikartaRooftopWorker, caption: "Rooftop Access Point" },
      { image: meikartaCctvTestingStanding, caption: "System Testing" },
      { image: meikartaCctvTestingCrouching, caption: "Field Configuration" },
    ],
    featured: true,
  },
  {
    id: "p5",
    slug: "integrated-smart-office",
    title: "Integrated Smart Office Program",
    category: "integrated",
    client: "[CLIENT NAME]",
    location: "[LOCATION]",
    status: "ongoing",
    description: "Cross-discipline delivery combining IT infrastructure, network, security and interior fit-out.",
    scope: ["IT Infrastructure", "Network", "Security", "Interior Fit-Out"],
    coverImage: "integrated",
    gallery: [{ image: "integrated" }, { image: "integrated" }],
    featured: true,
  },
  {
    id: "p6",
    slug: "cloud-network-modernization",
    title: "Cloud & Network Modernization",
    category: "technology",
    client: "ZTE",
    location: "BSD",
    status: "completed",
    description: "Migration of legacy infrastructure to a modern cloud and network architecture.",
    scope: ["Cloud", "Network", "System Integration"],
    coverImage: dcRackRow,
    gallery: [
      { image: dcRackRow, caption: "Rack row — busway and cable containment overhead" },
      { image: dcOverheadServices, caption: "Overhead services above the rack rows" },
      { image: dcCabinetStaging, caption: "Cabinets staged for positioning" },
      { image: dcCabinetFitout, caption: "Cabinet fit-out — rails and panels" },
    ],
    featured: false,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
