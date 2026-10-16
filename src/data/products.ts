import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Briefcase,
  Building2,
  ClipboardCheck,
  FileSignature,
  Gauge,
  HardHat,
  Network,
  Receipt,
  Table2,
} from "lucide-react";
import type { Lang } from "@/i18n/translations";
import mkCostDashboard from "@/assets/images/products/mk/cost-dashboard.webp";
import mkBoq from "@/assets/images/products/mk/boq.webp";
import mkWbs from "@/assets/images/products/mk/wbs.webp";
import mkRap from "@/assets/images/products/mk/rap.webp";
import mkRoles from "@/assets/images/products/mk/login-roles.webp";
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
  category: l("ERP bisnis", "Business ERP"),
  tagline: l(
    "Operasional bisnis, dari transaksi sampai laporan, dalam satu sistem ERP.",
    "Business operations, from transactions to reports, in one ERP system.",
  ),
  accent: "46 168 255",
  appUrl: "https://erp.aftech.co.id/",
};

export const products: Product[] = [mk, eptms, photogrammetry, aiFarm, erp];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
