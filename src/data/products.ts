import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Briefcase,
  Building2,
  ChartColumn,
  ClipboardCheck,
  Factory,
  FileSignature,
  FileText,
  Gauge,
  HardHat,
  Landmark,
  Network,
  Receipt,
  ShoppingCart,
  Store,
  Table2,
  Truck,
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
