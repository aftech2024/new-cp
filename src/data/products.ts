import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  Box,
  Briefcase,
  Building2,
  Camera,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileSignature,
  FileText,
  Gauge,
  HardHat,
  Landmark,
  Layers,
  MapIcon,
  Mountain,
  Network,
  Plane,
  Radar,
  Receipt,
  Ruler,
  ScanSearch,
  ShoppingCart,
  Sprout,
  Store,
  Table2,
  Truck,
  UserCheck,
  Wallet,
  Warehouse,
} from "lucide-react";
import type { Lang } from "@/i18n/translations";
import mkCostDashboard from "@/assets/images/products/mk/cost-dashboard.webp";
import mkBoq from "@/assets/images/products/mk/boq.webp";
import mkWbs from "@/assets/images/products/mk/wbs.webp";
import mkRap from "@/assets/images/products/mk/rap.webp";
import mkRoles from "@/assets/images/products/mk/login-roles.webp";
import nxDecisionCenter from "@/assets/images/products/nexora/decision-center.webp";
import nxAsk from "@/assets/images/products/nexora/nexora-ask.webp";
import nxArAging from "@/assets/images/products/nexora/ar-aging.webp";
import nxTax from "@/assets/images/products/nexora/faktur-pajak.webp";
import nxStock from "@/assets/images/products/nexora/stock-balance.webp";
import nxManufacturing from "@/assets/images/products/nexora/manufacturing.webp";
import farmCommandCenter from "@/assets/images/products/ai-farm/command-center.webp";
import farmFarms from "@/assets/images/products/ai-farm/farms.webp";
import farmBrain from "@/assets/images/products/ai-farm/farm-brain.webp";
import farmPrescriptions from "@/assets/images/products/ai-farm/prescriptions.webp";
import farmMissions from "@/assets/images/products/ai-farm/missions.webp";
import farmAnalytics from "@/assets/images/products/ai-farm/analytics.webp";
import pgOrthomosaic from "@/assets/images/products/photogrammetry/orthomosaic.webp";
import pgModel3d from "@/assets/images/products/photogrammetry/model-3d.webp";
import pgDetail from "@/assets/images/products/photogrammetry/detail.webp";
import pgTerrain from "@/assets/images/products/photogrammetry/terrain.webp";
import pgArea from "@/assets/images/products/photogrammetry/area.webp";
import eptmsCover from "@/assets/images/products/covers/eptms.webp";
import aiFarmCover from "@/assets/images/products/covers/ai-farm.webp";
import photogrammetryCover from "@/assets/images/photogrammetry/orthomosaic.jpg";

/**
 * Products Aftech sells as ready-made applications (/products), as opposed to
 * custom work (/services) and case studies (/projects).
 *
 * Copy is kept per product in both languages, so adding a product page means
 * adding data here rather than touching the page components. A product without
 * `page` is listed on /products with a link to its case study until its own
 * page is written.
 *
 * Prices in square brackets are placeholders to be confirmed by Aftech.
 */

export type Localized = Record<Lang, string>;

const l = (id: string, en: string): Localized => ({ id, en });
const YES = true;
const NO = false;

export interface ProductModule {
  name: Localized;
  summary: Localized;
  points: Localized[];
  image: string;
}

export interface PricingTier {
  name: Localized;
  description: Localized;
  /** Monthly price in rupiah; yearly billing charges 10 months. null = quoted by sales. */
  monthly: number | null;
  /** Shown instead of a price when `monthly` is null. */
  customPrice?: Localized;
  /** What a sales quote is based on, under `customPrice`. Falls back to a generic line. */
  customNote?: Localized;
  cta: Localized;
  /** Headline capacity of the plan. */
  limits: { label: Localized; value: Localized }[];
  /** "Everything in X, plus:" above the feature list. */
  includesFrom?: Localized;
  features: Localized[];
  featured?: boolean;
}

/** One row of the comparison table: a value per tier, in tier order. true/false = included or not. */
export interface PricingRow {
  label: Localized;
  values: (boolean | Localized)[];
}

export interface Pricing {
  tiers: PricingTier[];
  compare: { group: Localized; rows: PricingRow[] }[];
  notes: Localized[];
}

/** Months charged for a year on yearly billing. */
export const YEARLY_MONTHS = 10;

/** True when no plan has a published price, so the page shows a single sales-quoted offer. */
export function isQuoteOnly(pricing: Pricing): boolean {
  return pricing.tiers.every((tier) => tier.monthly === null);
}

/** How a chosen plan is named in the demo form and the email: "Max · Tahunan", or just the tier for sales-quoted plans. */
export function planLabel(tier: PricingTier, lang: Lang, billing: string): string {
  return tier.monthly === null ? tier.name[lang] : `${tier.name[lang]} · ${billing}`;
}

export interface ProductPage {
  seoTitle: Localized;
  seoDescription: Localized;
  headline: Localized;
  intro: Localized;
  heroImage: string;
  heroBadges: { value: Localized; label: Localized }[];
  highlights: { value: Localized; label: Localized }[];
  compare: { title: Localized; before: Localized[]; after: Localized[] };
  flow: { title: Localized; description: Localized; steps: { name: Localized; detail: Localized; icon: LucideIcon }[] };
  modulesTitle: Localized;
  modules: ProductModule[];
  personasTitle: Localized;
  personas: { title: Localized; text: Localized; icon: LucideIcon }[];
  pricing: Pricing;
  faq: { question: Localized; answer: Localized }[];
}

export interface Product {
  slug: string;
  name: string;
  shortName: string;
  category: Localized;
  tagline: Localized;
  /** Accent colour as an "R G B" triplet, used through the --accent CSS variable. */
  accent: string;
  /** Domain shown in the screenshot frame. */
  appHost?: string;
  appUrl?: string;
  /** Slug under /projects. */
  caseStudy?: string;
  cover?: string;
  page?: ProductPage;
}

const mk: Product = {
  slug: "management-construction",
  name: "MK — Management Construction",
  shortName: "MK",
  category: l("Project controls · Konstruksi", "Project controls · Construction"),
  tagline: l(
    "Kontrol biaya proyek konstruksi dari kontrak sampai biaya aktual, dalam satu sistem.",
    "Construction cost control from contract to actual cost, in one system.",
  ),
  accent: "245 166 35",
  appHost: "mk.aftech.co.id",
  appUrl: "https://mk.aftech.co.id/",
  caseStudy: "mk-management-construction",
  cover: mkCostDashboard,
  page: {
    seoTitle: l(
      "MK — Aplikasi Management Construction & Kontrol Biaya Proyek",
      "MK — Management Construction & Project Cost Control Software",
    ),
    seoDescription: l(
      "MK menghubungkan kontrak, BOQ, WBS, RAP, progres, dan biaya aktual proyek konstruksi dalam satu sistem, lengkap dengan indikator EVM. Jadwalkan demo.",
      "MK links contract, BOQ, WBS, RAP, progress and actual cost of construction projects in one system, with EVM indicators built in. Book a demo.",
    ),
    headline: l("Kendali penuh, dari kontrak sampai closing.", "Full control, from contract to closing."),
    intro: l(
      "MK menyambungkan kontrak, BOQ, WBS, RAP, progres, dan biaya aktual dalam satu benang merah. Setiap angka di dashboard bisa ditelusuri sampai ke sumbernya, tanpa rekap manual di spreadsheet.",
      "MK links contract, BOQ, WBS, RAP, progress and actual cost in one golden thread. Every number on the dashboard traces back to its source, with no manual spreadsheet roll-ups.",
    ),
    heroImage: mkCostDashboard,
    heroBadges: [
      { value: l("CPI · EAC · VAC", "CPI · EAC · VAC"), label: l("Indikator EVM dihitung otomatis", "EVM indicators calculated automatically") },
      { value: l("BOQ → RAP", "BOQ → RAP"), label: l("RAP dibuat langsung dari BOQ", "RAP generated straight from the BOQ") },
      { value: l("4 peran", "4 roles"), label: l("Director, PM, Cost Controller, Site Supervisor", "Director, PM, Cost Controller, Site Supervisor") },
    ],
    highlights: [
      { value: l("Satu alur", "One thread"), label: l("Kontrak sampai biaya aktual", "Contract through actual cost") },
      { value: l("Import Excel", "Excel import"), label: l("BOQ yang sudah ada langsung masuk", "Bring your existing BOQ in") },
      { value: l("EVM otomatis", "Automatic EVM"), label: l("CPI, EAC, VAC tanpa rumus manual", "CPI, EAC, VAC without manual formulas") },
      { value: l("RAP terkunci", "Locked RAP"), label: l("Hanya RAP disetujui yang jadi baseline", "Only approved RAP becomes the baseline") },
    ],
    compare: {
      title: l(
        "Dari spreadsheet yang tercecer ke satu sumber data",
        "From scattered spreadsheets to a single source of truth",
      ),
      before: [
        l("BOQ, RAP, dan progres tersebar di banyak file Excel dengan versi berbeda.", "BOQ, RAP and progress live in many Excel files, each a different version."),
        l("Biaya yang melebihi anggaran baru ketahuan saat proyek hampir selesai.", "Overruns surface only when the project is nearly finished."),
        l("Laporan ke owner dan direksi dirakit manual setiap minggu.", "Reports for the owner and directors are assembled by hand every week."),
        l("Revisi RAP berjalan tanpa jejak persetujuan yang jelas.", "RAP revisions happen without a clear approval trail."),
      ],
      after: [
        l("Kontrak, BOQ, WBS, RAP, progres, dan biaya aktual saling terhubung dalam satu sistem.", "Contract, BOQ, WBS, RAP, progress and actual cost are linked in one system."),
        l("Selisih anggaran terlihat sejak dini lewat CPI dan cost variance.", "Cost gaps show early through CPI and cost variance."),
        l("Dashboard portofolio dan biaya proyek terisi otomatis dari data yang diinput tim.", "Portfolio and project cost dashboards fill themselves from the team's input."),
        l("RAP baru masuk baseline setelah disetujui, dan setiap revisi tercatat.", "RAP joins the baseline only once approved, and every revision is recorded."),
      ],
    },
    flow: {
      title: l("Satu benang merah, dari kontrak sampai biaya aktual", "One golden thread, from contract to actual cost"),
      description: l(
        "Setiap tahap mengambil data dari tahap sebelumnya, jadi angka di dashboard selalu bisa ditelusuri ke asalnya.",
        "Each stage builds on the one before it, so every dashboard figure can be traced back to where it came from.",
      ),
      steps: [
        { name: l("Kontrak", "Contract"), detail: l("Nilai kontrak dengan owner, dasar semua perhitungan.", "Contract value with the owner, the basis of every calculation."), icon: FileSignature },
        { name: l("BOQ", "BOQ"), detail: l("Item, volume, dan harga satuan. Bisa diimpor dari Excel.", "Items, quantities and unit rates. Importable from Excel."), icon: Table2 },
        { name: l("WBS & Cost Code", "WBS & Cost Code"), detail: l("Struktur pekerjaan berbobot; tiap cost code menempel ke satu WBS.", "Weighted work breakdown; every cost code belongs to one WBS."), icon: Network },
        { name: l("RAP", "RAP"), detail: l("Anggaran pelaksanaan dari BOQ, disetujui sebelum jadi baseline.", "Execution budget from the BOQ, approved before it becomes the baseline."), icon: ClipboardCheck },
        { name: l("Progres", "Progress"), detail: l("Progres fisik tertimbang biaya dari pekerjaan terpasang.", "Cost-weighted physical progress from installed work."), icon: Activity },
        { name: l("Biaya aktual", "Actual cost"), detail: l("Pengeluaran riil dicatat per cost code.", "Real spend recorded per cost code."), icon: Receipt },
        { name: l("EVM & Billing", "EVM & Billing"), detail: l("CPI, EAC, VAC, tagihan ke owner, dan retensi dihitung otomatis.", "CPI, EAC, VAC, owner billing and retention calculated automatically."), icon: Gauge },
      ],
    },
    modulesTitle: l("Lihat isi aplikasinya", "Take a look inside"),
    modules: [
      {
        name: l("Cost Dashboard", "Cost Dashboard"),
        summary: l(
          "Ringkasan biaya per proyek: RAP, biaya aktual, earned value, progres fisik, CPI, EAC, dan VAC, dihitung otomatis dari data di modul lain.",
          "Per-project cost summary: RAP, actual cost, earned value, physical progress, CPI, EAC and VAC, calculated from the other modules.",
        ),
        points: [
          l("Spend vs progress: tanda ada biaya yang belum tercatat", "Spend vs progress: flags spend that has not been recorded"),
          l("Profitabilitas: nilai kontrak dibanding proyeksi biaya akhir", "Profitability: contract value against forecast final cost"),
          l("Billing & retensi: tagihan ke owner, retensi, dan recovery uang muka", "Billing & retention: owner invoices, retention and advance recovery"),
        ],
        image: mkCostDashboard,
      },
      {
        name: l("Bill of Quantity", "Bill of Quantity"),
        summary: l(
          "BOQ menjadi baseline anggaran. Amount dihitung dari volume × harga satuan, dan setiap item terhubung ke WBS dan cost code.",
          "The BOQ is the budget baseline. Amount is quantity × unit rate, and every item links to a WBS and cost code.",
        ),
        points: [
          l("Import BOQ dari Excel", "Import the BOQ from Excel"),
          l("Total BOQ terhitung otomatis", "BOQ total calculated automatically"),
          l("Ratusan item tetap mudah dicari dan dipaginasi", "Hundreds of items stay easy to search and page through"),
        ],
        image: mkBoq,
      },
      {
        name: l("WBS & Cost Code", "WBS & Cost Code"),
        summary: l(
          "Struktur pekerjaan proyek dengan bobot untuk perhitungan progres. Setiap cost code menempel ke satu WBS.",
          "The project's work breakdown, weighted for progress calculation. Every cost code belongs to one WBS.",
        ),
        points: [
          l("Total bobot divalidasi sampai 100%", "Total weight validated to 100%"),
          l("Bobot menjadi dasar progres tertimbang", "Weights drive weighted progress"),
          l("Kode WBS dan cost code konsisten di semua modul", "WBS and cost codes stay consistent across modules"),
        ],
        image: mkWbs,
      },
      {
        name: l("RAP", "RAP"),
        summary: l(
          "Rencana Anggaran Pelaksanaan dibuat dari BOQ dan menjadi pembanding seluruh pengukuran biaya.",
          "The execution budget (RAP) is generated from the BOQ and is what every cost measurement is compared against.",
        ),
        points: [
          l("Generate RAP dari BOQ", "Generate the RAP from the BOQ"),
          l("Approve atau reject per rincian", "Approve or reject line by line"),
          l("Hanya RAP yang disetujui masuk baseline", "Only approved RAP enters the baseline"),
        ],
        image: mkRap,
      },
      {
        name: l("Akses per peran", "Role-based access"),
        summary: l(
          "Satu sistem untuk seluruh tim proyek, masing-masing masuk dengan perannya sendiri.",
          "One system for the whole project team, each member signing in with their own role.",
        ),
        points: [l("Director", "Director"), l("Project Manager", "Project Manager"), l("Cost Controller", "Cost Controller"), l("Site Supervisor", "Site Supervisor")],
        image: mkRoles,
      },
    ],
    personasTitle: l("Dibuat untuk tim yang bertanggung jawab atas biaya proyek", "Built for the people accountable for project cost"),
    personas: [
      {
        title: l("Konsultan MK", "Construction management consultants"),
        text: l(
          "Pantau banyak proyek klien dari satu dashboard portofolio, dan siapkan laporan ke owner tanpa rekap manual.",
          "Follow many client projects from one portfolio dashboard and report to owners without manual roll-ups.",
        ),
        icon: Briefcase,
      },
      {
        title: l("Owner & developer", "Owners & developers"),
        text: l(
          "Lihat nilai kontrak, proyeksi biaya akhir, dan margin setiap proyek kapan saja.",
          "See contract value, forecast final cost and margin for every project at any time.",
        ),
        icon: Building2,
      },
      {
        title: l("Kontraktor", "Contractors"),
        text: l(
          "Kendalikan RAP, catat biaya aktual per cost code, dan tagih owner berdasarkan progres.",
          "Control the RAP, record actual cost per cost code and bill the owner on progress.",
        ),
        icon: HardHat,
      },
    ],
    // Draft prices for review — confirm before publishing.
    pricing: {
      tiers: [
        {
          name: l("Startup", "Startup"),
          description: l("Untuk kontraktor atau konsultan yang mulai merapikan kontrol biaya proyek.", "For contractors and consultants starting to put project cost control in order."),
          monthly: 1_500_000,
          cta: l("Pilih Startup", "Choose Startup"),
          limits: [
            { label: l("Proyek aktif", "Active projects"), value: l("2", "2") },
            { label: l("Pengguna", "Users"), value: l("10", "10") },
            { label: l("Dukungan", "Support"), value: l("Email & WhatsApp", "Email & WhatsApp") },
          ],
          features: [
            l("Kontrak, BOQ, WBS & cost code", "Contract, BOQ, WBS & cost code"),
            l("RAP dengan approval", "RAP with approval"),
            l("Progres dan biaya aktual", "Progress and actual cost"),
            l("Cost dashboard & indikator EVM", "Cost dashboard & EVM indicators"),
            l("Import BOQ dari Excel", "BOQ import from Excel"),
            l("4 peran pengguna", "4 user roles"),
            l("Hosting cloud dikelola Aftech", "Cloud hosting managed by Aftech"),
          ],
        },
        {
          name: l("Max", "Max"),
          description: l("Untuk tim yang mengelola banyak proyek sekaligus dan melapor ke direksi atau owner.", "For teams running many projects at once and reporting to directors or owners."),
          monthly: 4_500_000,
          cta: l("Pilih Max", "Choose Max"),
          limits: [
            { label: l("Proyek aktif", "Active projects"), value: l("10", "10") },
            { label: l("Pengguna", "Users"), value: l("50", "50") },
            { label: l("Dukungan", "Support"), value: l("Prioritas", "Priority") },
          ],
          includesFrom: l("Semua fitur Startup, plus:", "Everything in Startup, plus:"),
          features: [
            l("Dashboard portofolio multi-proyek", "Multi-project portfolio dashboard"),
            l("Pipeline proyek", "Project pipeline"),
            l("Billing, retensi & recovery uang muka", "Billing, retention & advance recovery"),
            l("Onboarding & pelatihan tim", "Onboarding & team training"),
            l("Dukungan prioritas", "Priority support"),
          ],
          featured: true,
        },
        {
          name: l("Enterprise", "Enterprise"),
          description: l("Untuk BUMN, instansi, dan grup perusahaan dengan kebutuhan keamanan dan integrasi khusus.", "For state-owned enterprises, agencies and groups with specific security and integration needs."),
          monthly: null,
          customPrice: l("Harga khusus", "Custom"),
          cta: l("Hubungi sales", "Contact sales"),
          limits: [
            { label: l("Proyek aktif", "Active projects"), value: l("Tidak terbatas", "Unlimited") },
            { label: l("Pengguna", "Users"), value: l("Tidak terbatas", "Unlimited") },
            { label: l("Dukungan", "Support"), value: l("SLA & account manager", "SLA & account manager") },
          ],
          includesFrom: l("Semua fitur Max, plus:", "Everything in Max, plus:"),
          features: [
            l("Server sendiri (on-premise) atau private cloud", "Your own servers (on-premise) or private cloud"),
            l("Integrasi dengan sistem keuangan/ERP", "Integration with finance/ERP systems"),
            l("Penyesuaian alur approval & laporan", "Custom approval flows & reports"),
            l("Migrasi data dibantu tim Aftech", "Data migration handled with the Aftech team"),
            l("SLA & account manager khusus", "SLA & a dedicated account manager"),
          ],
        },
      ],
      compare: [
        {
          group: l("Kapasitas", "Capacity"),
          rows: [
            { label: l("Proyek aktif", "Active projects"), values: [l("2", "2"), l("10", "10"), l("Tidak terbatas", "Unlimited")] },
            { label: l("Pengguna", "Users"), values: [l("10", "10"), l("50", "50"), l("Tidak terbatas", "Unlimited")] },
            { label: l("Peran pengguna", "User roles"), values: [l("4", "4"), l("4", "4"), l("Sesuai kebutuhan", "Tailored")] },
          ],
        },
        {
          group: l("Kontrol biaya proyek", "Project cost control"),
          rows: [
            { label: l("Kontrak & BOQ", "Contract & BOQ"), values: [YES, YES, YES] },
            { label: l("Import BOQ dari Excel", "BOQ import from Excel"), values: [YES, YES, YES] },
            { label: l("WBS & cost code berbobot", "Weighted WBS & cost codes"), values: [YES, YES, YES] },
            { label: l("RAP dengan approval", "RAP with approval"), values: [YES, YES, YES] },
            { label: l("Progres & biaya aktual", "Progress & actual cost"), values: [YES, YES, YES] },
            { label: l("Cost dashboard & EVM (CPI, EAC, VAC)", "Cost dashboard & EVM (CPI, EAC, VAC)"), values: [YES, YES, YES] },
            { label: l("Profitabilitas & forecast margin", "Profitability & forecast margin"), values: [YES, YES, YES] },
          ],
        },
        {
          group: l("Portofolio & penagihan", "Portfolio & billing"),
          rows: [
            { label: l("Dashboard portofolio multi-proyek", "Multi-project portfolio dashboard"), values: [NO, YES, YES] },
            { label: l("Pipeline proyek", "Project pipeline"), values: [NO, YES, YES] },
            { label: l("Billing, retensi & recovery uang muka", "Billing, retention & advance recovery"), values: [NO, YES, YES] },
          ],
        },
        {
          group: l("Deployment & integrasi", "Deployment & integration"),
          rows: [
            { label: l("Cloud dikelola Aftech", "Cloud managed by Aftech"), values: [YES, YES, YES] },
            { label: l("On-premise / private cloud", "On-premise / private cloud"), values: [NO, NO, YES] },
            { label: l("Integrasi keuangan/ERP", "Finance/ERP integration"), values: [NO, NO, YES] },
            { label: l("Alur approval & laporan kustom", "Custom approval flows & reports"), values: [NO, NO, YES] },
          ],
        },
        {
          group: l("Dukungan", "Support"),
          rows: [
            { label: l("Email & WhatsApp (jam kerja)", "Email & WhatsApp (business hours)"), values: [YES, YES, YES] },
            { label: l("Onboarding & pelatihan tim", "Onboarding & team training"), values: [NO, YES, YES] },
            { label: l("Dukungan prioritas", "Priority support"), values: [NO, YES, YES] },
            { label: l("Migrasi data dibantu", "Assisted data migration"), values: [NO, NO, YES] },
            { label: l("SLA & account manager khusus", "SLA & dedicated account manager"), values: [NO, NO, YES] },
          ],
        },
      ],
      notes: [
        l("Setiap paket diawali demo gratis", "Every plan starts with a free demo"),
        l("Bayar tahunan: hemat 2 bulan", "Pay yearly: 2 months free"),
        l("Harga belum termasuk PPN", "Prices exclude VAT"),
      ],
    },
    faq: [
      {
        question: l("Apakah BOQ yang sudah ada di Excel bisa dipindahkan?", "Can we bring in BOQs we already have in Excel?"),
        answer: l(
          "Bisa. Modul BOQ punya fitur Import Excel, jadi BOQ yang sudah disusun tidak perlu diketik ulang.",
          "Yes. The BOQ module has an Excel import, so an existing BOQ does not need retyping.",
        ),
      },
      {
        question: l("Apa bedanya MK dengan software akuntansi atau ERP?", "How is MK different from accounting or ERP software?"),
        answer: l(
          "Software akuntansi mencatat transaksi keuangan perusahaan. MK fokus pada kontrol biaya per proyek: membandingkan RAP, nilai hasil pekerjaan, dan biaya aktual, lalu memproyeksikan biaya akhir dan margin. Keduanya bisa diintegrasikan di paket Enterprise.",
          "Accounting software records the company's financial transactions. MK focuses on cost control per project: comparing RAP, earned value and actual cost, then forecasting final cost and margin. The two can be integrated on the Enterprise package.",
        ),
      },
      {
        question: l("Bagaimana progres proyek dihitung?", "How is project progress calculated?"),
        answer: l(
          "Progres fisik dihitung tertimbang biaya dari item BOQ yang sudah terpasang, mengikuti bobot di WBS.",
          "Physical progress is cost-weighted from installed BOQ items, following the weights in the WBS.",
        ),
      },
      {
        question: l("Bisakah MK dipasang di server kami sendiri?", "Can MK run on our own servers?"),
        answer: l(
          "Bisa, melalui paket Enterprise. Paket lainnya berjalan di cloud yang dikelola Aftech.",
          "Yes, on the Enterprise package. The other packages run on cloud hosting managed by Aftech.",
        ),
      },
      {
        question: l("Siapa saja yang bisa memakai MK?", "Who in the team uses MK?"),
        answer: l(
          "MK menyediakan empat peran: Director, Project Manager, Cost Controller, dan Site Supervisor.",
          "MK has four roles: Director, Project Manager, Cost Controller and Site Supervisor.",
        ),
      },
      {
        question: l("Seperti apa sesi demonya?", "What happens in the demo?"),
        answer: l(
          "Sekitar 60 menit, online atau tatap muka. Kami tunjukkan alur MK dari kontrak sampai biaya aktual dengan contoh yang mirip proyek Anda, lalu menjawab pertanyaan tim.",
          "About 60 minutes, online or in person. We walk through MK from contract to actual cost using an example close to your project, then answer the team's questions.",
        ),
      },
    ],
  },
};

const eptms: Product = {
  slug: "eptms",
  name: "EPTMS — Enterprise Project Management",
  shortName: "EPTMS",
  category: l("Manajemen portofolio proyek", "Project portfolio management"),
  tagline: l(
    "Seluruh portofolio proyek dalam satu layar: dashboard eksekutif, Gantt, WBS, dan Kurva-S otomatis.",
    "The whole project portfolio on one screen: executive dashboard, Gantt, WBS and automatic S-curves.",
  ),
  accent: "139 92 246",
  appUrl: "https://eptms.aftech.co.id/",
  caseStudy: "eptms-enterprise-project-management",
  cover: eptmsCover,
};

const photogrammetry: Product = {
  slug: "photogrammetry",
  name: "Photogrammetry",
  shortName: "Photogrammetry",
  category: l("Drone & pemetaan", "Drones & mapping"),
  tagline: l(
    "Foto udara drone diolah menjadi orthomosaic, model 3D, dan laporan volume pekerjaan tanah.",
    "Drone imagery turned into orthomosaics, 3D models and earthwork volume reports.",
  ),
  accent: "20 184 166",
  caseStudy: "photogrammetry",
  cover: photogrammetryCover,
  page: {
    seoTitle: l(
      "Photogrammetry — Survei Drone, Orthomosaic, Model 3D & Volume Cut-Fill",
      "Photogrammetry — Drone Survey, Orthomosaic, 3D Model & Cut-Fill Volumes",
    ),
    seoDescription: l(
      "Aftech menerbangkan drone di lokasi Anda dan mengolah foto udaranya menjadi orthomosaic, point cloud 3D, DSM/DTM, dan laporan volume cut & fill. Konsultasi dan demo gratis.",
      "Aftech flies your site and turns the aerial photos into orthomosaics, 3D point clouds, DSM/DTM and cut & fill volume reports. Free consultation and demo.",
    ),
    headline: l("Terbangkan sekali, ukur seluruh lokasi.", "Fly once, measure the whole site."),
    intro: l(
      "Kami menerbangkan drone di lokasi dan mengolah foto udaranya menjadi orthomosaic, model 3D, DSM/DTM, dan laporan volume. Tim proyek mendapat peta yang bisa diukur langsung, tanpa menunggu tim survei darat.",
      "We fly the site and turn the aerial photos into orthomosaics, 3D models, DSM/DTM and volume reports. The project team gets a map it can measure directly, without waiting on a ground survey crew.",
    ),
    heroImage: pgOrthomosaic,
    heroBadges: [
      { value: l("Orthomosaic", "Orthomosaic"), label: l("Peta udara tanpa distorsi", "A distortion-free aerial map") },
      { value: l("DSM / DTM", "DSM / DTM"), label: l("Model permukaan dan terrain", "Surface and terrain models") },
      { value: l("Cut & fill", "Cut & fill"), label: l("Volume pekerjaan tanah per periode", "Earthwork volumes per period") },
    ],
    highlights: [
      { value: l("Peta terukur", "Measurable map"), label: l("Ukur jarak dan luas langsung di peta", "Measure distances and areas on the map") },
      { value: l("Model 3D", "3D model"), label: l("Point cloud untuk elevasi dan as-built", "Point clouds for elevation and as-built checks") },
      { value: l("Volume tanah", "Earthwork volumes"), label: l("Cut & fill dan stockpile", "Cut & fill and stockpiles") },
      { value: l("Survei berkala", "Repeat surveys"), label: l("Bandingkan progres antar periode", "Compare progress period to period") },
    ],
    compare: {
      title: l("Dari pengukuran titik demi titik ke peta seluruh lokasi", "From point-by-point measurement to a map of the whole site"),
      before: [
        l("Pengukuran volume tanah menunggu jadwal tim survei darat.", "Earthwork volumes wait for the ground survey crew's schedule."),
        l("Progres lapangan dilaporkan dari foto ponsel dan catatan manual.", "Site progress is reported from phone photos and handwritten notes."),
        l("Area yang luas atau sulit dijangkau hanya diukur di beberapa titik.", "Large or hard-to-reach areas are measured at only a few points."),
        l("Perubahan dari bulan ke bulan sulit dibandingkan.", "Month-to-month change is hard to compare."),
      ],
      after: [
        l("Volume cut & fill dan stockpile dihitung dari model permukaan hasil terbang drone.", "Cut & fill and stockpile volumes come from the surface model of a drone flight."),
        l("Orthomosaic memperlihatkan seluruh lokasi dalam satu peta yang bisa diukur.", "An orthomosaic shows the whole site in one measurable map."),
        l("Seluruh area terpetakan, termasuk bagian yang sulit dijangkau.", "The whole area is mapped, including the parts that are hard to reach."),
        l("Survei berkala menunjukkan perubahan dari satu periode ke periode berikutnya.", "Repeat surveys show what changed from one period to the next."),
      ],
    },
    flow: {
      title: l("Dari penerbangan ke data lokasi", "From flight to site intelligence"),
      description: l(
        "Foto udara yang saling bertampalan diolah bertahap sampai menjadi peta, model, dan laporan yang siap dibahas di rapat proyek.",
        "Overlapping aerial photos are processed step by step into maps, models and reports ready for the site meeting.",
      ),
      steps: [
        { name: l("Terbang & akuisisi", "Flight & capture"), detail: l("Jalur terbang direncanakan, lalu drone memotret area dengan foto yang saling bertampalan.", "The flight path is planned and the drone photographs the area with overlapping images."), icon: Plane },
        { name: l("Structure from Motion", "Structure from Motion"), detail: l("Ribuan foto disusun menjadi geometri tiga dimensi.", "Thousands of photos are assembled into 3D geometry."), icon: Layers },
        { name: l("Point cloud 3D", "3D point cloud"), detail: l("Jutaan titik bergeoreferensi untuk elevasi dan struktur.", "Millions of geo-referenced points for elevation and structures."), icon: Box },
        { name: l("Orthomosaic", "Orthomosaic"), detail: l("Peta udara seluruh lokasi tanpa distorsi.", "A distortion-free aerial map of the whole site."), icon: MapIcon },
        { name: l("DSM / DTM", "DSM / DTM"), detail: l("Model permukaan dan terrain untuk cut, fill, dan drainase.", "Surface and terrain models for cut, fill and drainage."), icon: Mountain },
        { name: l("Laporan volume", "Volume report"), detail: l("Volume pekerjaan tanah dan perubahan antar periode.", "Earthwork volumes and period-to-period change."), icon: Ruler },
      ],
    },
    modulesTitle: l("Lihat hasilnya", "See the output"),
    modules: [
      {
        name: l("Orthomosaic", "Orthomosaic"),
        summary: l(
          "Peta udara seluruh lokasi tanpa distorsi. Jarak dan luas bisa diukur langsung dari peta.",
          "A distortion-free aerial map of the entire site. Measure distances and areas directly on it.",
        ),
        points: [
          l("Satu peta untuk seluruh lokasi", "One map for the whole site"),
          l("Ukur jarak dan luas langsung", "Measure distances and areas directly"),
          l("Dasar perencanaan dan laporan", "A base for planning and reporting"),
        ],
        image: pgOrthomosaic,
      },
      {
        name: l("Model 3D & point cloud", "3D model & point cloud"),
        summary: l(
          "Jutaan titik bergeoreferensi untuk membaca elevasi, struktur, dan kondisi as-built, seperti rekonstruksi koridor jalan ini.",
          "Millions of geo-referenced points for elevation, structures and as-built checks, like this road corridor reconstruction.",
        ),
        points: [
          l("Elevasi dan struktur", "Elevation and structures"),
          l("Pemeriksaan as-built", "As-built checks"),
          l("Rekonstruksi koridor jalan", "Road corridor reconstruction"),
        ],
        image: pgModel3d,
      },
      {
        name: l("Terrain & drainase", "Terrain & drainage"),
        summary: l(
          "DSM dan DTM dibangun dari foto udara untuk memperlihatkan kontur, area cut dan fill, serta perilaku aliran air di lokasi.",
          "DSM and DTM built from the aerial photos show contours, cut and fill areas and how water moves across the site.",
        ),
        points: [
          l("Model permukaan (DSM)", "Surface model (DSM)"),
          l("Model terrain (DTM)", "Terrain model (DTM)"),
          l("Volume cut & fill dan stockpile", "Cut & fill and stockpile volumes"),
        ],
        image: pgTerrain,
      },
      {
        name: l("Detail resolusi tinggi", "High-resolution detail"),
        summary: l(
          "Foto udara resolusi tinggi memperlihatkan detail lokasi seperti akses jalan, area parkir, dan fasilitas.",
          "High-resolution aerial photos show site detail such as access roads, parking and facilities.",
        ),
        points: [
          l("Inspeksi visual dari udara", "Visual inspection from the air"),
          l("Dokumentasi kondisi lokasi", "A record of site conditions"),
          l("Bukti progres lapangan", "Evidence of site progress"),
        ],
        image: pgDetail,
      },
      {
        name: l("Pemetaan kawasan", "Area mapping"),
        summary: l(
          "Kawasan permukiman, fasilitas, dan lahan terpetakan dalam satu survei, siap untuk perencanaan dan pendataan.",
          "Residential areas, facilities and land mapped in a single survey, ready for planning and inventory.",
        ),
        points: [
          l("Kawasan permukiman dan fasilitas", "Residential areas and facilities"),
          l("Pendataan bangunan dan lahan", "Building and land inventory"),
          l("Perencanaan pengembangan kawasan", "Planning for area development"),
        ],
        image: pgArea,
      },
    ],
    personasTitle: l("Untuk tim yang perlu mengukur lokasi dengan cepat", "For teams that need to measure a site quickly"),
    personas: [
      {
        title: l("Kontraktor & pekerjaan tanah", "Contractors & earthworks"),
        text: l(
          "Hitung volume cut & fill dan stockpile, lalu pantau progres dari satu periode ke periode berikutnya.",
          "Work out cut & fill and stockpile volumes, then track progress from one period to the next.",
        ),
        icon: HardHat,
      },
      {
        title: l("Owner, developer & konsultan", "Owners, developers & consultants"),
        text: l(
          "Dapatkan gambaran seluruh lokasi dan bukti progres lapangan untuk rapat proyek dan laporan.",
          "Get a view of the whole site and evidence of progress for project meetings and reports.",
        ),
        icon: Building2,
      },
      {
        title: l("Instansi pemerintah", "Government agencies"),
        text: l(
          "Petakan kawasan, lahan, dan infrastruktur yang luas atau sulit dijangkau dalam satu survei.",
          "Map large or hard-to-reach areas, land and infrastructure in a single survey.",
        ),
        icon: Landmark,
      },
    ],
    pricing: {
      tiers: [
        {
          name: l("Implementasi", "Implementation"),
          description: l(
            "Disusun per proyek, dari luas area, frekuensi survei, sampai output yang Anda butuhkan.",
            "Scoped per project, from the size of the area and how often it is surveyed to the outputs you need.",
          ),
          monthly: null,
          customPrice: l("Hubungi sales", "Contact sales"),
          customNote: l("Dihitung dari luas area, frekuensi survei, dan output", "Quoted on area, survey frequency and outputs"),
          cta: l("Hubungi sales", "Contact sales"),
          limits: [
            { label: l("Output", "Outputs"), value: l("Orthomosaic, 3D, DSM/DTM", "Orthomosaic, 3D, DSM/DTM") },
            { label: l("Laporan", "Reports"), value: l("Volume & progres", "Volumes & progress") },
            { label: l("Survei", "Surveys"), value: l("Sekali atau berkala", "One-off or recurring") },
          ],
          includesFrom: l("Termasuk dalam implementasi:", "Included in the implementation:"),
          features: [
            l("Perencanaan jalur terbang", "Flight path planning"),
            l("Akuisisi foto udara dengan drone", "Aerial photo capture by drone"),
            l("Pengolahan Structure from Motion", "Structure from Motion processing"),
            l("Orthomosaic & point cloud 3D", "Orthomosaic & 3D point cloud"),
            l("DSM / DTM", "DSM / DTM"),
            l("Laporan volume cut & fill dan progres", "Cut & fill volume and progress reports"),
          ],
        },
      ],
      compare: [],
      notes: [
        l("Konsultasi dan demo gratis", "Free consultation and demo"),
        l("Penawaran disusun sesuai lingkup proyek", "Quotes are scoped to your project"),
      ],
    },
    faq: [
      {
        question: l("Apa itu fotogrametri drone dan kapan berguna?", "What is drone photogrammetry and when is it useful?"),
        answer: l(
          "Fotogrametri menyusun foto drone yang saling bertampalan menjadi model 3D lokasi yang akurat: peta orthomosaic, model elevasi, atau point cloud. Paling berguna untuk pekerjaan tanah dan proyek konstruksi yang butuh data volume dan progres secara rutin tanpa menunggu tim survei darat.",
          "It stitches overlapping drone photos into an accurate 3D model of a site: an orthomosaic map, an elevation model or a point cloud. It is most useful for earthworks and construction sites that need frequent volume and progress data without waiting on a ground survey crew.",
        ),
      },
      {
        question: l("Output apa saja yang kami terima?", "What do we receive?"),
        answer: l(
          "Orthomosaic, point cloud 3D, DSM/DTM, dan laporan volume cut & fill serta progres antar periode. Output disesuaikan dengan kebutuhan proyek saat penawaran disusun.",
          "An orthomosaic, a 3D point cloud, DSM/DTM, and cut & fill volume and period-to-period progress reports. Outputs are tailored to the project when the quote is put together.",
        ),
      },
      {
        question: l("Seberapa sering survei bisa dilakukan?", "How often can the site be surveyed?"),
        answer: l(
          "Sekali untuk pemetaan awal, atau berkala untuk memantau progres dan perubahan volume dari satu periode ke periode berikutnya.",
          "Once for a baseline map, or on a schedule to track progress and volume change from one period to the next.",
        ),
      },
      {
        question: l("Sudah dipakai di mana?", "Where is it in use?"),
        answer: l(
          "Platform fotogrametri Aftech berjalan untuk Kementerian Pertahanan. Ceritanya ada di studi kasus Photogrammetry.",
          "Aftech's photogrammetry platform runs for Indonesia's Ministry of Defence. The story is in the Photogrammetry case study.",
        ),
      },
      {
        question: l("Bagaimana harganya dihitung?", "How is it priced?"),
        answer: l(
          "Tidak ada harga paket. Setiap implementasi dihitung dari luas area, frekuensi survei, dan output yang dibutuhkan. Hubungi tim sales atau jadwalkan demo untuk mendapatkan penawaran.",
          "There are no packaged prices. Each implementation is quoted on the area, how often it is surveyed and the outputs needed. Contact sales or book a demo to get a quote.",
        ),
      },
      {
        question: l("Seperti apa sesi demonya?", "What happens in the demo?"),
        answer: l(
          "Sekitar 60 menit, online atau tatap muka. Kami tunjukkan contoh orthomosaic, model 3D, dan laporan volume, lalu membahas lokasi dan kebutuhan Anda.",
          "About 60 minutes, online or in person. We show example orthomosaics, 3D models and volume reports, then talk through your site and what you need.",
        ),
      },
    ],
  },
};

const aiFarm: Product = {
  slug: "ai-farm",
  name: "AI Farm",
  shortName: "AI Farm",
  category: l("Pertanian cerdas", "Smart farming"),
  tagline: l(
    "Sensor IoT, drone, dan AI dalam satu command center: skor kesehatan lahan, preskripsi, dan verifikasi.",
    "IoT sensors, drones and AI in one command center: field health scoring, prescriptions and verification.",
  ),
  accent: "34 197 94",
  caseStudy: "ai-autonomous-farm-kementan",
  cover: aiFarmCover,
  page: {
    seoTitle: l(
      "AI Farm — Platform Pertanian Cerdas dengan IoT, Drone & AI",
      "AI Farm — Smart Farming Platform with IoT, Drones & AI",
    ),
    seoDescription: l(
      "AI Farm menggabungkan sensor IoT, citra drone, dan AI dalam satu Farm Command Center: skor kesehatan per zona, preskripsi yang divalidasi petugas, misi drone, dan verifikasi hasil. Jadwalkan demo.",
      "AI Farm brings IoT sensors, drone imagery and AI into one Farm Command Center: health scores per zone, prescriptions validated by people, drone missions and verified results. Book a demo.",
    ),
    headline: l("Dari sensor sampai tindakan yang terverifikasi.", "From sensing to verified action."),
    intro: l(
      "AI Farm menggabungkan sensor IoT, citra drone, dan AI dalam satu command center. Setiap zona lahan diberi skor kesehatan, AI menyusun preskripsi, petugas memvalidasinya, lalu drone menjalankan misi dan hasilnya diverifikasi.",
      "AI Farm brings IoT sensors, drone imagery and AI into one command center. Every zone gets a health score, the AI drafts a prescription, a person validates it, then a drone flies the mission and the result is verified.",
    ),
    heroImage: farmCommandCenter,
    heroBadges: [
      { value: l("NDVI · RGB · Thermal", "NDVI · RGB · Thermal"), label: l("Sensor dan citra dalam satu skor", "Sensors and imagery in one score") },
      { value: l("24 lahan", "24 farms"), label: l("Terhubung dalam program Kementan", "Connected in the Ministry program") },
      { value: l("Validasi manusia", "Human validation"), label: l("Preskripsi jalan setelah disetujui", "Prescriptions run once approved") },
    ],
    highlights: [
      { value: l("Satu command center", "One command center"), label: l("Seluruh lahan dalam satu peta kesehatan", "Every farm on one health map") },
      { value: l("Skor per zona", "Scores per zone"), label: l("Sehat, waspada, atau kritis", "Healthy, watch or critical") },
      { value: l("Preskripsi AI", "AI prescriptions"), label: l("Nutrisi, proteksi, atau air", "Nutrition, protection or water") },
      { value: l("Misi drone", "Drone missions"), label: l("Survei, inspeksi, dan penyemprotan", "Survey, inspection and spraying") },
    ],
    compare: {
      title: l("Dari pengamatan manual ke keputusan berbasis data per zona", "From walking the field to decisions on data per zone"),
      before: [
        l("Masalah tanaman baru diketahui setelah gejalanya terlihat oleh mata.", "Crop problems are found only once they are visible to the eye."),
        l("Pupuk dan pestisida diberikan merata, termasuk ke area yang tidak membutuhkannya.", "Fertiliser and pesticide go on evenly, including where they are not needed."),
        l("Kondisi banyak lahan dilaporkan manual dan datang terlambat.", "Reports from many farms are put together by hand and arrive late."),
        l("Hasil penanganan sulit dibuktikan.", "The effect of a treatment is hard to prove."),
      ],
      after: [
        l("Skor kesehatan per zona dari NDVI/NDRE, RGB, thermal, dan data cuaca menandai masalah lebih awal.", "Zone health scores from NDVI/NDRE, RGB, thermal and weather data flag problems earlier."),
        l("Preskripsi hanya menargetkan zona yang bermasalah.", "Prescriptions target only the zones that need them."),
        l("Semua lahan terpantau dari satu Farm Command Center.", "Every farm is followed from one Farm Command Center."),
        l("Setiap misi melewati verifikasi, dan pemulihan skor kesehatan tercatat di Analytics.", "Every mission goes through verification, and health score recovery is tracked in Analytics."),
      ],
    },
    flow: {
      title: l("Dari sensor sampai tindakan yang terverifikasi", "From sensing to verified action"),
      description: l(
        "Data sensor dan citra mengalir ke AI Farm Brain, lalu menjadi tindakan di lapangan yang hasilnya diukur kembali.",
        "Sensor and imagery data flow into the AI Farm Brain, become action in the field, and the result is measured again.",
      ),
      steps: [
        { name: l("Sensor & citra", "Sensors & imagery"), detail: l("NDVI/NDRE, RGB, thermal, serta data cuaca dan lapangan.", "NDVI/NDRE, RGB, thermal, plus weather and field data."), icon: Camera },
        { name: l("Skor zona", "Zone score"), detail: l("AI Farm Brain menghitung skor kesehatan per zona.", "The AI Farm Brain scores the health of each zone."), icon: Gauge },
        { name: l("Klasifikasi risiko", "Risk classification"), detail: l("Setiap zona ditandai sehat, waspada, atau kritis.", "Each zone is marked healthy, watch or critical."), icon: ScanSearch },
        { name: l("Preskripsi", "Prescription"), detail: l("Rekomendasi nutrisi, proteksi, atau air untuk zona tersebut.", "A nutrition, protection or water recommendation for the zone."), icon: ClipboardList },
        { name: l("Validasi", "Validation"), detail: l("Petugas menyetujui atau menolak preskripsi.", "A person approves or rejects the prescription."), icon: UserCheck },
        { name: l("Misi drone", "Drone mission"), detail: l("Jalur terbang, ketinggian, dan overlap direncanakan.", "Flight path, altitude and overlap are planned."), icon: Plane },
        { name: l("Verifikasi", "Verification"), detail: l("Hasil misi diverifikasi dan pemulihan skor dipantau.", "The mission result is verified and score recovery tracked."), icon: BadgeCheck },
      ],
    },
    modulesTitle: l("Lihat isi aplikasinya", "Take a look inside"),
    modules: [
      {
        name: l("Farm Command Center", "Farm Command Center"),
        summary: l(
          "Peta kesehatan seluruh lahan dengan luas area, jumlah zona kritis, misi aktif, distribusi kesehatan, dan performa misi.",
          "A health map of every farm with total area, critical zones, active missions, health distribution and mission performance.",
        ),
        points: [
          l("Peta lahan sehat, waspada, dan kritis", "Healthy, watch and critical farms on one map"),
          l("Distribusi kesehatan per zona", "Health distribution by zone"),
          l("Performa misi survei, inspeksi, dan penyemprotan", "Survey, inspection and spraying mission performance"),
        ],
        image: farmCommandCenter,
      },
      {
        name: l("Daftar lahan", "Farms"),
        summary: l(
          "Setiap lahan dengan lokasi, komoditas, luas, skor kesehatan, zona kritis, misi aktif, dan waktu pemindaian terakhir.",
          "Every farm with its location, commodity, area, health score, critical zones, active mission and last scan.",
        ),
        points: [
          l("Filter per komoditas", "Filter by commodity"),
          l("Skor kesehatan per lahan", "A health score per farm"),
          l("Waktu pemindaian terakhir", "Time of the last scan"),
        ],
        image: farmFarms,
      },
      {
        name: l("AI Farm Brain", "AI Farm Brain"),
        summary: l(
          "Input sensor dan citra masuk ke pipeline skor kesehatan, klasifikasi risiko, dan rekomendasi, lalu temuan disusun per zona.",
          "Sensor and imagery inputs feed a pipeline of health scoring, risk classification and recommendation, with findings listed per zone.",
        ),
        points: [
          l("Input NDVI/NDRE, RGB, thermal, cuaca", "NDVI/NDRE, RGB, thermal and weather inputs"),
          l("Skor dan tingkat risiko per zona", "Score and risk level per zone"),
          l("Penyebab temuan, misalnya penurunan NDRE", "The cause of each finding, such as an NDRE decline"),
        ],
        image: farmBrain,
      },
      {
        name: l("Preskripsi", "Prescriptions"),
        summary: l(
          "Rekomendasi penanganan menunggu validasi, persetujuan, dan eksekusi oleh petugas, dengan status dari draft sampai selesai.",
          "Recommended treatments await validation, approval and execution by people, with a status from draft to completed.",
        ),
        points: [
          l("Nutrisi, proteksi, air, atau tanpa tindakan", "Nutrition, protection, water or no action"),
          l("Validasi dan persetujuan manusia", "Human validation and approval"),
          l("Status dari draft sampai selesai", "Status from draft to completed"),
        ],
        image: farmPrescriptions,
      },
      {
        name: l("Misi drone", "Drone missions"),
        summary: l(
          "Setiap misi punya jalur terbang di peta, luas area, durasi, ketinggian dan overlap, drone yang dipakai, serta statusnya.",
          "Each mission has its flight path on the map, planned area, duration, altitude and overlap, the drone used and its status.",
        ),
        points: [
          l("Jalur terbang di peta", "Flight path on the map"),
          l("Luas, durasi, ketinggian & overlap", "Area, duration, altitude & overlap"),
          l("Status misi sampai verifikasi", "Mission status through verification"),
        ],
        image: farmMissions,
      },
      {
        name: l("Analytics", "Analytics"),
        summary: l(
          "Metrik pilot dibandingkan dengan targetnya: efisiensi input, deteksi dini, cakupan, dan pemulihan kesehatan tanaman.",
          "Pilot metrics measured against their targets: input efficiency, early detection, coverage and crop health recovery.",
        ),
        points: [
          l("Efisiensi input per hektar", "Input efficiency per hectare"),
          l("Deteksi AI dibanding pengamatan visual", "AI detection against visual detection"),
          l("Cakupan lahan dan zona teranalisis", "Farms covered and zones analysed"),
        ],
        image: farmAnalytics,
      },
    ],
    personasTitle: l("Untuk program dan bisnis pertanian berskala besar", "For large-scale farming programs and businesses"),
    personas: [
      {
        title: l("Program pemerintah", "Government programs"),
        text: l(
          "Pantau banyak lahan di berbagai provinsi dari satu command center, lengkap dengan bukti hasil penanganan.",
          "Follow many farms across provinces from one command center, with evidence of what each treatment achieved.",
        ),
        icon: Landmark,
      },
      {
        title: l("Perkebunan & agribisnis", "Plantations & agribusiness"),
        text: l(
          "Arahkan pupuk, proteksi, dan air hanya ke zona yang membutuhkannya.",
          "Send fertiliser, protection and water only to the zones that need them.",
        ),
        icon: Sprout,
      },
      {
        title: l("Operator lapangan & drone", "Field and drone operators"),
        text: l(
          "Terima preskripsi yang sudah disetujui, jalankan misi drone, dan catat hasilnya untuk diverifikasi.",
          "Receive approved prescriptions, fly the drone missions and record the result for verification.",
        ),
        icon: Radar,
      },
    ],
    pricing: {
      tiers: [
        {
          name: l("Implementasi", "Implementation"),
          description: l(
            "Dirancang bersama sesuai jumlah lahan, komoditas, perangkat, dan misi drone yang Anda butuhkan.",
            "Designed with you around the number of farms, the commodities, the devices and the drone missions you need.",
          ),
          monthly: null,
          customPrice: l("Hubungi sales", "Contact sales"),
          customNote: l("Dihitung dari jumlah lahan, perangkat, dan misi drone", "Quoted on farms, devices and drone missions"),
          cta: l("Hubungi sales", "Contact sales"),
          limits: [
            { label: l("Cakupan", "Coverage"), value: l("Sesuai jumlah lahan", "Sized to your farms") },
            { label: l("Data", "Data"), value: l("Sensor IoT & citra drone", "IoT sensors & drone imagery") },
            { label: l("Pendampingan", "Support"), value: l("Tim Aftech", "The Aftech team") },
          ],
          includesFrom: l("Termasuk dalam implementasi:", "Included in the implementation:"),
          features: [
            l("Analisis kebutuhan & desain sistem", "Needs analysis & system design"),
            l("Pemasangan sensor IoT & konektivitas", "IoT sensor installation & connectivity"),
            l("Integrasi citra drone: NDVI/NDRE, RGB, thermal", "Drone imagery: NDVI/NDRE, RGB, thermal"),
            l("Farm Command Center & AI Farm Brain", "Farm Command Center & AI Farm Brain"),
            l("Preskripsi, misi drone & verifikasi", "Prescriptions, drone missions & verification"),
            l("Pelatihan operator", "Operator training"),
          ],
        },
      ],
      compare: [],
      notes: [
        l("Konsultasi dan demo gratis", "Free consultation and demo"),
        l("Penawaran disusun sesuai lingkup program", "Quotes are scoped to your program"),
      ],
    },
    faq: [
      {
        question: l("Data apa saja yang dipakai AI Farm Brain?", "What data does the AI Farm Brain use?"),
        answer: l(
          "Citra NDVI/NDRE, RGB, dan thermal dari drone, ditambah data cuaca dan lapangan dari sensor IoT. Dari situ AI menghitung skor kesehatan per zona, mengklasifikasikan risikonya, dan menyusun rekomendasi.",
          "NDVI/NDRE, RGB and thermal imagery from drones, plus weather and field data from IoT sensors. From these the AI scores each zone's health, classifies its risk and drafts a recommendation.",
        ),
      },
      {
        question: l("Apakah rekomendasi AI langsung dijalankan?", "Does the AI act on its own?"),
        answer: l(
          "Tidak. Preskripsi menunggu validasi dan persetujuan petugas, dan misi drone baru berjalan setelah disetujui. Petugas juga bisa menolak preskripsi.",
          "No. Prescriptions wait for validation and approval by people, and a drone mission runs only once approved. Prescriptions can also be rejected.",
        ),
      },
      {
        question: l("Bagaimana hasil penanganan dibuktikan?", "How is the result of a treatment proven?"),
        answer: l(
          "Setiap misi melewati tahap verifikasi, dan Analytics menampilkan pemulihan skor kesehatan pada zona yang sudah diverifikasi, bersama metrik efisiensi input, deteksi dini, dan cakupan.",
          "Every mission goes through verification, and Analytics shows health score recovery on verified zones, alongside input efficiency, early detection and coverage metrics.",
        ),
      },
      {
        question: l("Komoditas apa yang sudah dipantau?", "Which crops does it already cover?"),
        answer: l(
          "Di program yang berjalan, AI Farm memantau padi, jagung, kedelai, cabai, bawang merah, kelapa sawit, dan sayuran dataran tinggi.",
          "In the running program, AI Farm follows rice, maize, soybean, chilli, shallot, oil palm and highland vegetables.",
        ),
      },
      {
        question: l("Sudah dipakai di mana?", "Where is it in use?"),
        answer: l(
          "Dalam program AI Autonomous Farm untuk Kementerian Pertanian, dengan 24 lahan terhubung di berbagai provinsi. Ceritanya ada di studi kasus program tersebut.",
          "In the AI Autonomous Farm program for Indonesia's Ministry of Agriculture, with 24 connected farms across several provinces. The story is in that program's case study.",
        ),
      },
      {
        question: l("Bagaimana harganya dihitung?", "How is it priced?"),
        answer: l(
          "Tidak ada harga paket. Setiap implementasi dihitung dari jumlah lahan, perangkat, dan misi drone yang dibutuhkan. Hubungi tim sales atau jadwalkan demo untuk mendapatkan penawaran.",
          "There are no packaged prices. Each implementation is quoted on the number of farms, devices and drone missions needed. Contact sales or book a demo to get a quote.",
        ),
      },
    ],
  },
};

const erp: Product = {
  slug: "nexora-erp",
  name: "Nexora ERP",
  shortName: "Nexora",
  category: l("ERP bisnis · AI", "Business ERP · AI"),
  tagline: l(
    "Keuangan, pajak, rantai pasok, produksi, dan SDM dalam satu ERP, dengan AI yang memberi tahu apa yang perlu ditindak.",
    "Finance, tax, supply chain, manufacturing and HR in one ERP, with AI that tells you what needs action.",
  ),
  accent: "46 168 255",
  appHost: "erp.aftech.co.id",
  appUrl: "https://erp.aftech.co.id/",
  cover: nxDecisionCenter,
  page: {
    seoTitle: l(
      "Nexora ERP — Software ERP dengan AI untuk Keuangan, Stok & Produksi",
      "Nexora ERP — AI-powered ERP for Finance, Inventory & Manufacturing",
    ),
    seoDescription: l(
      "Nexora menyatukan akuntansi, pajak Indonesia, pembelian, penjualan, stok multi-gudang, manufaktur, dan SDM dalam satu ERP, dengan Decision Center dan Nexora Ask berbasis AI. Jadwalkan demo.",
      "Nexora brings accounting, Indonesian tax, purchasing, sales, multi-warehouse inventory, manufacturing and HR into one ERP, with the AI-powered Decision Center and Nexora Ask. Book a demo.",
    ),
    headline: l("ERP yang tahu langkah berikutnya.", "The ERP that knows the next move."),
    intro: l(
      "Nexora menyatukan keuangan, pajak, pembelian, penjualan, gudang, produksi, dan SDM dalam satu database. Decision Center memantau data itu dan memberi tahu apa yang perlu ditindak, lengkap dengan alasan, bukti, dan perkiraan dampaknya dalam rupiah.",
      "Nexora brings finance, tax, purchasing, sales, warehousing, manufacturing and HR into one database. The Decision Center watches that data and tells you what needs action, with the reason, the evidence and the estimated impact in rupiah.",
    ),
    heroImage: nxDecisionCenter,
    heroBadges: [
      { value: l("Decision Center", "Decision Center"), label: l("Rekomendasi dengan alasan, bukti, dan dampak rupiah", "Recommendations with reason, evidence and rupiah impact") },
      { value: l("Nexora Ask", "Nexora Ask"), label: l("Tanya data dalam dua bahasa", "Ask your data in two languages") },
      { value: l("Faktur Pajak · PPN", "Faktur Pajak · VAT"), label: l("Pajak Indonesia sudah bawaan", "Indonesian tax built in") },
    ],
    highlights: [
      { value: l("Satu database", "One database"), label: l("Keuangan, rantai pasok, produksi, dan SDM", "Finance, supply chain, manufacturing and HR") },
      { value: l("AI dengan sumber", "AI with sources"), label: l("Setiap jawaban menyertakan angka sumbernya", "Every answer shows where its numbers came from") },
      { value: l("Pajak Indonesia", "Indonesian tax"), label: l("Faktur Pajak, Bukti Potong, dan rekap PPN", "Faktur Pajak, Bukti Potong and VAT summary") },
      { value: l("Multi-perusahaan", "Multi-company"), label: l("Cabang, gudang, cost center, dan proyek", "Branches, warehouses, cost centers and projects") },
    ],
    compare: {
      title: l(
        "Dari aplikasi dan spreadsheet yang terpisah ke satu sistem",
        "From separate apps and spreadsheets to one system",
      ),
      before: [
        l("Penjualan, gudang, dan keuangan memakai aplikasi atau spreadsheet berbeda yang harus direkap manual.", "Sales, warehouse and finance use different apps or spreadsheets that have to be reconciled by hand."),
        l("Stok habis baru ketahuan saat pelanggan sudah memesan.", "Stock-outs surface only once a customer has already ordered."),
        l("Faktur pajak dan rekap PPN disiapkan terpisah dari faktur penjualan dan tagihan pembelian.", "Tax invoices and the VAT summary are prepared apart from sales invoices and purchase bills."),
        l("Piutang yang telat bayar baru dikejar setelah kas menipis.", "Overdue receivables are chased only once cash runs low."),
      ],
      after: [
        l("Penjualan, pembelian, gudang, produksi, keuangan, dan SDM berbagi satu database.", "Sales, purchasing, warehouse, manufacturing, finance and HR share one database."),
        l("Decision Center memperingatkan stok yang akan habis sebelum barang pengganti datang, lengkap dengan dampaknya dalam rupiah.", "The Decision Center warns about stock that will run out before replacements arrive, with the impact in rupiah."),
        l("Draft faktur pajak terbentuk dari faktur dan tagihan, dan VAT Summary mencocokkan PPN faktur pajak dengan buku besar.", "Draft tax invoices come from invoices and bills, and the VAT summary matches tax-invoice VAT against the ledger."),
        l("Faktur yang lewat jatuh tempo diberi skor risiko, jadi penagihan dimulai dari yang paling berisiko.", "Overdue invoices get a risk score, so collection starts with the riskiest."),
      ],
    },
    flow: {
      title: l("Satu alur, dari pesanan sampai laporan", "One flow, from order to report"),
      description: l(
        "Setiap dokumen meneruskan datanya ke tahap berikutnya, jadi stok, piutang, pajak, dan laporan keuangan selalu mengikuti transaksi yang terjadi.",
        "Each document carries its data into the next stage, so stock, receivables, tax and the financial statements always follow what actually happened.",
      ),
      steps: [
        { name: l("Penjualan", "Sales"), detail: l("Penawaran dan sales order, dengan cek ketersediaan stok.", "Quotations and sales orders, with a stock availability check."), icon: FileText },
        { name: l("Pembelian", "Purchasing"), detail: l("Permintaan pembelian menjadi purchase order.", "Purchase requisitions become purchase orders."), icon: ShoppingCart },
        { name: l("Gudang", "Warehouse"), detail: l("Penerimaan barang, transfer, dan stok per gudang.", "Goods receipts, transfers and stock per warehouse."), icon: Warehouse },
        { name: l("Produksi", "Manufacturing"), detail: l("MRP, work order, job card, dan HPP per work order.", "MRP, work orders, job cards and cost per work order."), icon: Factory },
        { name: l("Kirim & tagih", "Ship & bill"), detail: l("Delivery order, pengiriman, faktur, dan faktur pajak.", "Delivery orders, shipments, invoices and tax invoices."), icon: Truck },
        { name: l("Kas & bank", "Cash & bank"), detail: l("Penerimaan, pembayaran, payment run, dan rekonsiliasi bank.", "Receipts, payments, payment runs and bank reconciliation."), icon: Wallet },
        { name: l("Laporan & AI", "Reports & AI"), detail: l("Laba rugi, aging, anggaran vs realisasi, dan Decision Center.", "Profit and loss, aging, budget vs actual and the Decision Center."), icon: ChartColumn },
      ],
    },
    modulesTitle: l("Lihat isi aplikasinya", "Take a look inside"),
    modules: [
      {
        name: l("Decision Center", "Decision Center"),
        summary: l(
          "Detektor memantau stok, kas, pembayaran, penagihan, SDM, dan harga. Setiap temuan datang dengan tingkat keparahan, analisis AI, dan perkiraan dampak dalam rupiah.",
          "Detectors watch stock, cash, payments, collection, HR and pricing. Each finding comes with a severity, an AI analysis and an estimated impact in rupiah.",
        ),
        points: [
          l("Kemungkinan penyebab dan langkah berikutnya untuk setiap temuan", "Likely causes and next steps for every finding"),
          l("Menerima rekomendasi hanya membuat draft", "Accepting a recommendation only creates drafts"),
          l("Pengingat untuk keputusan yang masih tertunda", "Reminders for decisions still waiting"),
        ],
        image: nxDecisionCenter,
      },
      {
        name: l("Nexora Ask", "Nexora Ask"),
        summary: l(
          "Tanya data perusahaan dalam bahasa Indonesia atau Inggris. Angka diambil dari laporan Nexora, bukan tebakan, dan setiap jawaban menyertakan sumbernya.",
          "Ask about company data in Indonesian or English. Numbers come from Nexora's own reports, never from guesses, and every answer lists its sources.",
        ),
        points: [
          l("Hanya membaca data sesuai hak akses penanya", "Reads only what the person asking may see"),
          l("Sumber angka ditampilkan di setiap jawaban", "Sources shown with every answer"),
          l("Draft dokumen dibuat setelah Anda konfirmasi", "Drafts are created only after you confirm"),
        ],
        image: nxAsk,
      },
      {
        name: l("Piutang & penagihan", "Receivables & collection"),
        summary: l(
          "Faktur pelanggan, penerimaan, dan umur piutang per pelanggan di satu tempat. Faktur yang lewat jatuh tempo diberi skor risiko dari keterlambatan, nilai, riwayat bayar, dan pengingat.",
          "Customer invoices, receipts and aging per customer in one place. Overdue invoices are risk-scored on days late, amount, payment history and reminders.",
        ),
        points: [
          l("Umur piutang sampai lebih dari 90 hari", "Aging buckets through 90+ days"),
          l("Skor risiko per faktur", "A risk score per invoice"),
          l("Ekspor CSV dan cetak laporan", "CSV export and printable reports"),
        ],
        image: nxArAging,
      },
      {
        name: l("Faktur Pajak & PPN", "Tax invoices & VAT"),
        summary: l(
          "Draft faktur pajak keluaran dan masukan terbentuk dari faktur penjualan dan tagihan pembelian. Bukti potong dan rekap PPN ada di modul yang sama.",
          "Draft output and input tax invoices (Faktur Pajak) are created from sales invoices and purchase bills. Withholding slips (Bukti Potong) and the VAT summary sit in the same module.",
        ),
        points: [
          l("Setiap faktur pajak terhubung ke dokumen sumbernya", "Every tax invoice links to its source document"),
          l("DPP, DPP Nilai Lain, dan PPN per masa pajak", "DPP, DPP Nilai Lain and VAT per tax period"),
          l("PPN faktur pajak dicocokkan dengan buku besar", "Tax-invoice VAT matched against the ledger"),
        ],
        image: nxTax,
      },
      {
        name: l("Stok multi-gudang", "Multi-warehouse stock"),
        summary: l(
          "Saldo stok per barang dan gudang: on hand, dipesan, tersedia, harga pokok, dan nilai persediaan, dengan kartu stok untuk setiap barang.",
          "Stock per item and warehouse: on hand, reserved, available, unit cost and inventory value, with a stock card for every item.",
        ),
        points: [
          l("Stok tersedia sudah dikurangi reservasi pesanan", "Available stock already net of reservations"),
          l("Penerimaan barang dan transfer antar gudang", "Goods receipts and transfers between warehouses"),
          l("Valuasi persediaan dan kartu stok", "Inventory valuation and stock cards"),
        ],
        image: nxStock,
      },
      {
        name: l("Manufaktur", "Manufacturing"),
        summary: l(
          "Dari BOM dan routing sampai work order, job card, dan shop floor kiosk. MRP menyusun saran pengadaan dan produksi, dan HPP dihitung per work order.",
          "From BOMs and routings to work orders, job cards and a shop floor kiosk. MRP proposes what to buy and make, and cost of goods is calculated per work order.",
        ),
        points: [
          l("MRP dan jadwal produksi (Gantt)", "MRP and a Gantt production schedule"),
          l("Quality: inspeksi, NCR, dan CAPA", "Quality: inspections, NCRs and CAPAs"),
          l("Maintenance, OEE, dan HPP per work order", "Maintenance, OEE and cost per work order"),
        ],
        image: nxManufacturing,
      },
    ],
    personasTitle: l("Dibuat untuk perusahaan yang mengelola barang, uang, dan orang", "Built for companies that manage goods, money and people"),
    personas: [
      {
        title: l("Distributor & perdagangan", "Distributors & traders"),
        text: l(
          "Kelola penjualan, pembelian, dan stok di banyak gudang, lalu tagih pelanggan dari data pengiriman yang sama.",
          "Run sales, purchasing and stock across many warehouses, then bill customers from the same delivery data.",
        ),
        icon: Store,
      },
      {
        title: l("Manufaktur", "Manufacturers"),
        text: l(
          "Rencanakan produksi dengan MRP, jalankan work order di lantai produksi, dan ketahui HPP setiap batch.",
          "Plan production with MRP, run work orders on the shop floor and know the cost of every batch.",
        ),
        icon: Factory,
      },
      {
        title: l("Pemilik & tim keuangan", "Owners & finance teams"),
        text: l(
          "Lihat laba rugi, piutang, kas, dan pajak kapan saja, dan biarkan Decision Center menandai hal yang perlu diputuskan.",
          "See profit and loss, receivables, cash and tax at any time, and let the Decision Center flag what needs a decision.",
        ),
        icon: Landmark,
      },
    ],
    // Draft prices for review — confirm before publishing.
    pricing: {
      tiers: [
        {
          name: l("Startup", "Startup"),
          description: l("Untuk usaha dagang dan distribusi yang ingin keuangan, pajak, dan stok tercatat di satu sistem.", "For trading and distribution businesses that want finance, tax and stock in one system."),
          monthly: 2_500_000,
          cta: l("Pilih Startup", "Choose Startup"),
          limits: [
            { label: l("Perusahaan", "Companies"), value: l("1", "1") },
            { label: l("Pengguna", "Users"), value: l("10", "10") },
            { label: l("Dukungan", "Support"), value: l("Email & WhatsApp", "Email & WhatsApp") },
          ],
          features: [
            l("Akuntansi & laporan keuangan", "Accounting & financial statements"),
            l("Piutang, hutang, kas & bank", "Receivables, payables, cash & bank"),
            l("Faktur Pajak, Bukti Potong & PPN", "Faktur Pajak, Bukti Potong & VAT"),
            l("Pembelian, penjualan & stok multi-gudang", "Purchasing, sales & multi-warehouse stock"),
            l("Decision Center & Nexora Ask", "Decision Center & Nexora Ask"),
            l("Approval workflow", "Approval workflows"),
            l("Hosting cloud dikelola Aftech", "Cloud hosting managed by Aftech"),
          ],
        },
        {
          name: l("Max", "Max"),
          description: l("Untuk perusahaan yang juga berproduksi, mengelola SDM, atau menjalankan beberapa badan usaha.", "For companies that also manufacture, manage HR, or run several legal entities."),
          monthly: 7_500_000,
          cta: l("Pilih Max", "Choose Max"),
          limits: [
            { label: l("Perusahaan", "Companies"), value: l("3", "3") },
            { label: l("Pengguna", "Users"), value: l("50", "50") },
            { label: l("Dukungan", "Support"), value: l("Prioritas", "Priority") },
          ],
          includesFrom: l("Semua fitur Startup, plus:", "Everything in Startup, plus:"),
          features: [
            l("Manufaktur: BOM, MRP, work order & HPP", "Manufacturing: BOM, MRP, work orders & costing"),
            l("SDM, payroll, absensi & self service", "HR, payroll, attendance & self service"),
            l("Aset tetap, anggaran & payment run", "Fixed assets, budgets & payment runs"),
            l("Logistik & pengiriman", "Logistics & shipments"),
            l("Onboarding & pelatihan tim", "Onboarding & team training"),
            l("Dukungan prioritas", "Priority support"),
          ],
          featured: true,
        },
        {
          name: l("Enterprise", "Enterprise"),
          description: l("Untuk grup perusahaan, BUMN, dan instansi dengan kebutuhan keamanan dan integrasi khusus.", "For groups, state-owned enterprises and agencies with specific security and integration needs."),
          monthly: null,
          customPrice: l("Harga khusus", "Custom"),
          cta: l("Hubungi sales", "Contact sales"),
          limits: [
            { label: l("Perusahaan", "Companies"), value: l("Tidak terbatas", "Unlimited") },
            { label: l("Pengguna", "Users"), value: l("Tidak terbatas", "Unlimited") },
            { label: l("Dukungan", "Support"), value: l("SLA & account manager", "SLA & account manager") },
          ],
          includesFrom: l("Semua fitur Max, plus:", "Everything in Max, plus:"),
          features: [
            l("Server sendiri (on-premise) atau private cloud", "Your own servers (on-premise) or private cloud"),
            l("Integrasi dengan sistem yang sudah berjalan", "Integration with the systems you already run"),
            l("Penyesuaian alur approval, dokumen & laporan", "Custom approval flows, documents & reports"),
            l("Migrasi data dibantu tim Aftech", "Data migration handled with the Aftech team"),
            l("SLA & account manager khusus", "SLA & a dedicated account manager"),
          ],
        },
      ],
      compare: [
        {
          group: l("Kapasitas", "Capacity"),
          rows: [
            { label: l("Perusahaan", "Companies"), values: [l("1", "1"), l("3", "3"), l("Tidak terbatas", "Unlimited")] },
            { label: l("Pengguna", "Users"), values: [l("10", "10"), l("50", "50"), l("Tidak terbatas", "Unlimited")] },
          ],
        },
        {
          group: l("Keuangan & pajak", "Finance & tax"),
          rows: [
            { label: l("Buku besar & laporan keuangan", "General ledger & financial statements"), values: [YES, YES, YES] },
            { label: l("Piutang, hutang & aging", "Receivables, payables & aging"), values: [YES, YES, YES] },
            { label: l("Kas, bank & rekonsiliasi", "Cash, bank & reconciliation"), values: [YES, YES, YES] },
            { label: l("Faktur Pajak, Bukti Potong & PPN", "Faktur Pajak, Bukti Potong & VAT"), values: [YES, YES, YES] },
            { label: l("Aset tetap & penyusutan", "Fixed assets & depreciation"), values: [NO, YES, YES] },
            { label: l("Anggaran vs realisasi", "Budget vs actual"), values: [NO, YES, YES] },
            { label: l("Payment run", "Payment runs"), values: [NO, YES, YES] },
          ],
        },
        {
          group: l("Rantai pasok", "Supply chain"),
          rows: [
            { label: l("Pembelian: PR, PO & penerimaan barang", "Purchasing: requisitions, POs & goods receipts"), values: [YES, YES, YES] },
            { label: l("Penjualan: penawaran, SO & delivery order", "Sales: quotations, sales & delivery orders"), values: [YES, YES, YES] },
            { label: l("Stok multi-gudang & valuasi", "Multi-warehouse stock & valuation"), values: [YES, YES, YES] },
            { label: l("Logistik & pengiriman", "Logistics & shipments"), values: [NO, YES, YES] },
          ],
        },
        {
          group: l("Manufaktur", "Manufacturing"),
          rows: [
            { label: l("BOM, routing & work order", "BOMs, routings & work orders"), values: [NO, YES, YES] },
            { label: l("MRP & jadwal produksi (Gantt)", "MRP & Gantt production schedule"), values: [NO, YES, YES] },
            { label: l("Shop floor kiosk & job card", "Shop floor kiosk & job cards"), values: [NO, YES, YES] },
            { label: l("HPP, quality & maintenance", "Costing, quality & maintenance"), values: [NO, YES, YES] },
          ],
        },
        {
          group: l("SDM", "People"),
          rows: [
            { label: l("Data karyawan & struktur organisasi", "Employee records & org chart"), values: [NO, YES, YES] },
            { label: l("Payroll", "Payroll"), values: [NO, YES, YES] },
            { label: l("Absensi, cuti, lembur & klaim", "Attendance, leave, overtime & claims"), values: [NO, YES, YES] },
            { label: l("Rekrutmen", "Recruitment"), values: [NO, YES, YES] },
          ],
        },
        {
          group: l("AI & kontrol", "AI & controls"),
          rows: [
            { label: l("Decision Center", "Decision Center"), values: [YES, YES, YES] },
            { label: l("Nexora Ask", "Nexora Ask"), values: [YES, YES, YES] },
            { label: l("Deteksi anomali", "Anomaly detection"), values: [YES, YES, YES] },
            { label: l("Approval workflow", "Approval workflows"), values: [YES, YES, YES] },
          ],
        },
        {
          group: l("Deployment & dukungan", "Deployment & support"),
          rows: [
            { label: l("Cloud dikelola Aftech", "Cloud managed by Aftech"), values: [YES, YES, YES] },
            { label: l("On-premise / private cloud", "On-premise / private cloud"), values: [NO, NO, YES] },
            { label: l("Integrasi dengan sistem lain", "Integration with other systems"), values: [NO, NO, YES] },
            { label: l("Email & WhatsApp (jam kerja)", "Email & WhatsApp (business hours)"), values: [YES, YES, YES] },
            { label: l("Onboarding & pelatihan tim", "Onboarding & team training"), values: [NO, YES, YES] },
            { label: l("Migrasi data dibantu", "Assisted data migration"), values: [NO, NO, YES] },
            { label: l("SLA & account manager khusus", "SLA & dedicated account manager"), values: [NO, NO, YES] },
          ],
        },
      ],
      notes: [
        l("Setiap paket diawali demo gratis", "Every plan starts with a free demo"),
        l("Bayar tahunan: hemat 2 bulan", "Pay yearly: 2 months free"),
        l("Harga belum termasuk PPN", "Prices exclude VAT"),
      ],
    },
    faq: [
      {
        question: l("Apakah Nexora mendukung pajak Indonesia?", "Does Nexora handle Indonesian tax?"),
        answer: l(
          "Ya. Draft faktur pajak keluaran dan masukan terbentuk dari faktur penjualan dan tagihan pembelian, bukti potong dicatat di modul yang sama, dan VAT Summary menghitung DPP, DPP Nilai Lain, dan PPN per masa pajak sambil mencocokkannya dengan buku besar.",
          "Yes. Draft output and input tax invoices are created from sales invoices and purchase bills, withholding slips are recorded in the same module, and the VAT summary works out DPP, DPP Nilai Lain and VAT per tax period while matching it against the ledger.",
        ),
      },
      {
        question: l("Dari mana angka yang dijawab Nexora Ask?", "Where do Nexora Ask's numbers come from?"),
        answer: l(
          "Dari laporan dan data di Nexora sendiri, bukan tebakan. Setiap jawaban mencantumkan sumbernya, Ask hanya membaca data yang boleh dilihat penanya sesuai hak aksesnya, dan data sensitif seperti gaji tetap disamarkan.",
          "From Nexora's own reports and data, never from guesses. Every answer lists its sources, Ask reads only what the person asking is allowed to see, and sensitive data such as salaries stays masked.",
        ),
      },
      {
        question: l("Apakah AI bisa mengubah data tanpa persetujuan?", "Can the AI change data without approval?"),
        answer: l(
          "Tidak. Menerima rekomendasi Decision Center atau permintaan di Nexora Ask hanya membuat draft. Dokumen baru berlaku setelah dikonfirmasi pengguna dan melewati alur persetujuan yang berlaku.",
          "No. Accepting a Decision Center recommendation or a request in Nexora Ask only creates drafts. A document takes effect once a person confirms it and it passes the usual approval flow.",
        ),
      },
      {
        question: l("Bisakah dipakai untuk beberapa perusahaan dan cabang?", "Does it work across several companies and branches?"),
        answer: l(
          "Bisa. Nexora mendukung beberapa perusahaan, cabang, gudang, cost center, dan proyek. Laporan seperti laba rugi bisa difilter per cabang, cost center, atau proyek.",
          "Yes. Nexora supports several companies, branches, warehouses, cost centers and projects. Reports such as profit and loss can be filtered by branch, cost center or project.",
        ),
      },
      {
        question: l("Bisakah Nexora dipasang di server kami sendiri?", "Can Nexora run on our own servers?"),
        answer: l(
          "Bisa, melalui paket Enterprise. Paket lainnya berjalan di cloud yang dikelola Aftech.",
          "Yes, on the Enterprise package. The other packages run on cloud hosting managed by Aftech.",
        ),
      },
      {
        question: l("Seperti apa sesi demonya?", "What happens in the demo?"),
        answer: l(
          "Sekitar 60 menit, online atau tatap muka. Kami tunjukkan alur Nexora dari pesanan sampai laporan, termasuk Decision Center dan Nexora Ask, dengan contoh yang mirip bisnis Anda, lalu menjawab pertanyaan tim.",
          "About 60 minutes, online or in person. We walk through Nexora from order to report, including the Decision Center and Nexora Ask, using an example close to your business, then answer the team's questions.",
        ),
      },
    ],
  },
};

export const products: Product[] = [mk, eptms, photogrammetry, aiFarm, erp];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
