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
import dronePhotogrammetry from "@/assets/images/drone-photogrammetry.jpg";
import photoOrthomosaic from "@/assets/images/photogrammetry/orthomosaic.jpg";
import photoAerialParking from "@/assets/images/photogrammetry/aerial-parking.jpg";
import photoAerialField from "@/assets/images/photogrammetry/aerial-field.jpg";
import photoAerialTrailPond from "@/assets/images/photogrammetry/aerial-trail-pond.jpg";
import photoAerialPondPlayground from "@/assets/images/photogrammetry/aerial-pond-playground.jpg";
import photoAerialForestRoad from "@/assets/images/photogrammetry/aerial-forest-road.jpg";
import photoAerialCanopyRoad from "@/assets/images/photogrammetry/aerial-canopy-road.jpg";
import photoModel3dRoad from "@/assets/images/photogrammetry/model-3d-road.jpg";
import photoAerialResPool from "@/assets/images/photogrammetry/aerial-residential-pool.jpg";
import photoAerialResTennis from "@/assets/images/photogrammetry/aerial-residential-tennis.jpg";
import photoAerialResBlock from "@/assets/images/photogrammetry/aerial-residential-block.jpg";

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
 * Integrated Solutions documentation — auto-loaded from
 * src/assets/images/integrated/{ai-farm,eptms,mk}/.
 * 3 projects, 17 photos total:
 * - ai-farm (6): AI Autonomous Farm, client Kementerian Pertanian
 * - eptms (5): EPTMS enterprise project & portfolio management
 * - mk (6): MK Management Construction / Project Controls
 */
const integratedModules = import.meta.glob<string>("../assets/images/integrated/**/*.jpg", {
  eager: true,
  import: "default",
});

const integratedByFile: Record<string, string> = {};
for (const [path, src] of Object.entries(integratedModules)) {
  const file = path.split("/").pop();
  if (file && typeof src === "string") integratedByFile[file] = src;
}

const AI_FARM_ORDER = [
  "ai-farm-01.jpg",
  "ai-farm-02.jpg",
  "ai-farm-03.jpg",
  "ai-farm-04.jpg",
  "ai-farm-05.jpg",
  "ai-farm-06.jpg",
];

const AI_FARM_CAPTIONS: Record<string, string> = {
  "ai-farm-01.jpg": "Farm Command Center — zone-level intelligence across Indonesia",
  "ai-farm-02.jpg": "Farms registry — 24 connected farms across Indonesia",
  "ai-farm-03.jpg": "AI Farm Brain — health scoring & risk classification pipeline",
  "ai-farm-04.jpg": "Prescriptions — treatments awaiting validation & execution",
  "ai-farm-05.jpg": "Mission M-021 — drone survey flight path, Jember",
  "ai-farm-06.jpg": "Analytics — input efficiency, early detection & coverage",
};

const EPTMS_ORDER = ["eptms-01.jpg", "eptms-02.jpg", "eptms-03.jpg", "eptms-04.jpg", "eptms-05.jpg"];

const EPTMS_CAPTIONS: Record<string, string> = {
  "eptms-01.jpg": "Executive Dashboard — portfolio command view",
  "eptms-02.jpg": "Portfolio & Projects Hub — PLN Indonesia Power & Kementerian Pertahanan",
  "eptms-03.jpg": "Timeline & Gantt — Photogrammetry for Defense Platform",
  "eptms-04.jpg": "Planning & WBS — dynamic bobot 100%",
  "eptms-05.jpg": "Analytics & Kurva S — plan vs actual",
};

const MK_ORDER = ["mk-01.jpg", "mk-02.jpg", "mk-03.jpg", "mk-04.jpg", "mk-05.jpg", "mk-06.jpg"];

const MK_CAPTIONS: Record<string, string> = {
  "mk-01.jpg": "MK Login — Management Construction Project Controls",
  "mk-02.jpg": "Portfolio Dashboard — contract, RAP & forecast summary",
  "mk-03.jpg": "Cost Dashboard — Gedung Perkantoran BSD, RAP vs Earned Value",
  "mk-04.jpg": "Bill of Quantity — 219 item BOQ baseline",
  "mk-05.jpg": "WBS & Cost Code — 27 WBS, 100% weight",
  "mk-06.jpg": "RAP — Rencana Anggaran Pelaksanaan approval",
};

const aiFarmGallery = AI_FARM_ORDER.filter((f) => integratedByFile[f]).map((f) => ({
  image: integratedByFile[f],
  caption: AI_FARM_CAPTIONS[f] ?? "AI Autonomous Farm",
}));

const eptmsGallery = EPTMS_ORDER.filter((f) => integratedByFile[f]).map((f) => ({
  image: integratedByFile[f],
  caption: EPTMS_CAPTIONS[f] ?? "EPTMS",
}));

const mkGallery = MK_ORDER.filter((f) => integratedByFile[f]).map((f) => ({
  image: integratedByFile[f],
  caption: MK_CAPTIONS[f] ?? "Management Construction",
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
    client: "PT Mahkota Sentosa Utama",
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
    id: "p7",
    slug: "photogrammetry",
    title: "Photogrammetry",
    category: "technology",
    client: "Kementerian Pertahanan",
    location: "Jakarta, Indonesia",
    description:
      "We fly the site and turn overlapping aerial photos into terrain models, maps, and volume reports the project team can act on the same day.",
    scope: [
      "Flight & Capture",
      "Structure from Motion",
      "Point Cloud 3D",
      "Orthomosaic",
      "DSM / DTM",
      "Volume Report",
    ],
    coverImage: dronePhotogrammetry,
    gallery: [
      { image: dronePhotogrammetry, caption: "Aerial capture processed into a 3D terrain model" },
      { image: photoOrthomosaic, caption: "Orthomosaic — full-site aerial map" },
      { image: photoAerialParking, caption: "Parking & access — high-resolution detail" },
      { image: photoAerialField, caption: "Field & forest canopy — survey detail" },
      { image: photoAerialTrailPond, caption: "Trail & pond — terrain detail" },
      { image: photoAerialPondPlayground, caption: "Pond & recreation area — aerial detail" },
      { image: photoAerialForestRoad, caption: "Forest road — oblique aerial view" },
      { image: photoAerialCanopyRoad, caption: "Canopy & access road — survey frame" },
      { image: photoModel3dRoad, caption: "3D model — road corridor reconstruction" },
      { image: photoAerialResPool, caption: "Residential rooftops & pool — nadir detail" },
      { image: photoAerialResTennis, caption: "Housing & sports courts — aerial survey" },
      { image: photoAerialResBlock, caption: "Residential block — high-resolution mapping" },
    ],
    featured: false,
  },
  {
    id: "p5",
    slug: "ai-autonomous-farm-kementan",
    title: "AI Autonomous Farm — Kementerian Pertanian",
    category: "integrated",
    client: "Kementerian Pertanian",
    location: "Indonesia — 24 Farms",
    status: "ongoing",
    description:
      "Integrated smart-farming platform combining IoT sensing, drone imagery, AI health scoring and drone mission execution — Farm Command Center, AI Farm Brain, prescriptions and verification in one program.",
    scope: ["IoT Sensing", "Drone Survey", "AI Analytics", "System Integration"],
    coverImage: integratedByFile["ai-farm-01.jpg"] ?? "",
    gallery: aiFarmGallery,
    featured: true,
  },
  {
    id: "p8",
    slug: "eptms-enterprise-project-management",
    title: "EPTMS — Enterprise Project Management System",
    category: "integrated",
    client: "PLN Indonesia Power / Kementerian Pertahanan",
    location: "Indonesia",
    status: "ongoing",
    description:
      "Enterprise portfolio command system — executive dashboard, project hub, timeline & Gantt, Planning & WBS with dynamic bobot, and automatic Kurva-S analytics from timeline to progress. Live at eptms.aftech.co.id.",
    scope: ["Portfolio Dashboard", "Timeline & Gantt", "Planning & WBS", "Analytics & Kurva-S"],
    coverImage: integratedByFile["eptms-01.jpg"] ?? "",
    gallery: eptmsGallery,
    featured: true,
  },
  {
    id: "p9",
    slug: "mk-management-construction",
    title: "MK — Management Construction Project Controls",
    category: "integrated",
    client: "Gedung Perkantoran BSD & Construction Portfolio",
    location: "BSD, Tangerang",
    status: "ongoing",
    description:
      "Management-construction controls combining contract, BOQ, WBS & cost code, RAP, progress and actual cost into one golden thread — portfolio dashboard, cost dashboard, BOQ baseline and RAP approval. Live at mk.aftech.co.id.",
    scope: ["Contract & BOQ", "WBS & Cost Control", "RAP", "Progress & Cost Dashboard"],
    coverImage: integratedByFile["mk-02.jpg"] ?? "",
    gallery: mkGallery,
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
