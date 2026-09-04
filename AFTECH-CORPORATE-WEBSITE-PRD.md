# AFTECH CORPORATE WEBSITE — PRODUCT REQUIREMENTS DOCUMENT

**File:** `AFTECH-CORPORATE-WEBSITE-PRD.md`  
**Version:** 1.0.0  
**Status:** Ready for Development  
**Company:** PT Aftech Daya Solusindo  
**Deployment Target:** Hostinger Shared Hosting  
**Primary Stack:** React + Vite + TypeScript + Tailwind CSS + Framer Motion  
**Design Direction:** Premium Technology × Engineering × Architecture

---

## 1. PROJECT OVERVIEW

PT Aftech Daya Solusindo membutuhkan website company profile modern yang:

- menempatkan **IT/Technology sebagai core identity**
- tetap menampilkan Mechanical & Electrical, Civil, dan Interior
- memperkenalkan Halora sebagai affiliated company yang menangani Civil dan Interior, sepanjang hubungan tersebut memang akurat secara legal
- memiliki visual premium seperti studio architecture / technology company
- menggunakan identitas warna logo Aftech
- sangat visual dan kuat pada portfolio/project
- cepat dan SEO-friendly
- mudah di-hosting di Hostinger
- tidak membutuhkan Node.js runtime di production
- siap dikembangkan menjadi CMS di masa depan

### Positioning utama

> **Technology. Engineering. Built for the Future.**

Alternatif brand statement:

> **We build the digital and physical world.**

---

# 2. DESIGN CONCEPT

## 2.1 Core Concept

### TECHNOLOGY × ENGINEERING × SPACE

Narasi visual:

```text
DIGITAL INTELLIGENCE
        ↓
TECHNOLOGY
        ↓
ENGINEERING
        ↓
PHYSICAL INFRASTRUCTURE
        ↓
SPACE
```

Website harus terasa seperti perpaduan:

- premium technology company
- architecture studio
- engineering company
- construction company
- modern corporate portfolio

Bukan website kontraktor generik.

## 2.2 Visual Characteristics

Gunakan:

- oversized typography
- editorial layout
- large project imagery
- asymmetric grid
- generous whitespace
- dark/light contrast
- subtle motion
- image reveal
- smooth scrolling
- premium hover states
- minimal navigation
- strong project storytelling

Hindari:

- cyberpunk berlebihan
- neon berlebihan
- particle effect di seluruh halaman
- template Bootstrap lama
- terlalu banyak card rounded
- terlalu banyak shadow
- stock photo generik
- animasi yang mengganggu
- clone dari website referensi

Website referensi hanya digunakan sebagai inspirasi visual; jangan menyalin layout, asset, copywriting, branding, atau kode pihak lain.

---

# 3. BRAND SYSTEM

## 3.1 Brand Personality

Aftech harus terasa:

- Intelligent
- Professional
- Modern
- Reliable
- Innovative
- Technical
- Premium
- Engineering-driven
- Enterprise-ready

## 3.2 Color Palette

Gunakan logo Aftech sebagai source of truth. Palet awal:

```text
Deep Navy     #04111D
Primary Navy  #071A2B
Aftech Blue   #1479D1
Electric Blue #2EA8FF
Light Blue    #EAF5FF
White         #FFFFFF
Off White     #F7F9FC
Text          #111827
Muted         #667085
Border        #E5E7EB
```

Jika warna logo asli berbeda, token harus disesuaikan dengan logo final.

## 3.3 Typography

Recommended:

- Display: Manrope
- Body: Inter

Responsive hierarchy:

```text
Hero:
clamp(48px, 7vw, 104px)

H1:
clamp(40px, 5vw, 72px)

H2:
clamp(32px, 4vw, 52px)

H3:
clamp(24px, 3vw, 32px)

Body:
16–18px

Small:
13–14px
```

---

# 4. TARGET AUDIENCE

## Primary

- Corporate clients
- Government / institutional clients
- Developers
- Property owners
- Industrial companies
- IT managers
- Engineering managers
- Procurement departments
- Business owners

## Secondary

- Strategic partners
- Vendors
- Employees / candidates
- Investors
- Media
- General visitors

---

# 5. INFORMATION ARCHITECTURE

```text
/
├── /about
├── /services
│   ├── /services/technology
│   ├── /services/mechanical-electrical
│   ├── /services/civil
│   ├── /services/interior
│   └── /services/integrated-solutions
├── /projects
│   └── /projects/:slug
├── /halora
├── /insights
│   └── /insights/:slug
└── /contact
```

Future:

```text
/careers
/certifications
/partners
/downloads
```

---

# 6. NAVIGATION

Desktop:

```text
AFTECH

About
Services
Projects
Insights

Contact Us →
```

Optional:

```text
About
Services
Projects
Halora
Insights
Contact
```

Mobile:

```text
HOME
ABOUT
SERVICES
  Technology
  Mechanical & Electrical
  Civil
  Interior
  Integrated Solutions
PROJECTS
HALORA
INSIGHTS
CONTACT
```

Behavior:

- sticky
- transparent over hero
- becomes dark/glass on scroll
- accessible keyboard navigation
- mobile drawer
- smooth transition

---

# 7. HOMEPAGE

## Section 01 — HERO

Full viewport.

Recommended copy:

> **We build the digital and physical world.**

Supporting:

> Technology. Engineering. Construction.

CTA:

```text
Explore Our Work →
Start a Project →
```

Visual:

- cinematic technology/architecture imagery
- deep navy overlay
- subtle blue lighting
- architectural grid
- optional short muted video
- no generic stock office image

Hero narrative animation:

```text
TECHNOLOGY
      ↓
ENGINEERING
      ↓
CONSTRUCTION
      ↓
AFTECH
```

Animation must never block initial usability.

---

# 8. TECHNOLOGY IS OUR CORE

Headline:

> **Technology is our core.**

Copy:

> We design and deliver digital solutions that help organizations operate smarter, connect better and scale with confidence.

Capabilities:

```text
Software Development
AI & Data
IT Infrastructure
Cloud & Server
Network
Cybersecurity
System Integration
Digital Transformation
Automation
```

CTA:

```text
Explore Technology →
```

This section must visually receive more emphasis than ordinary service cards.

---

# 9. DIGITAL TO PHYSICAL

Headline:

> **From digital intelligence to physical infrastructure.**

Visual flow:

```text
AI
↓
SOFTWARE
↓
DATA
↓
NETWORK
↓
BUILDING SYSTEM
↓
ENGINEERING
↓
SPACE
```

Purpose:

Explain why Aftech can operate across technology and physical infrastructure.

---

# 10. WHAT WE DO

Four main service categories.

## 01 — TECHNOLOGY

```text
Software Development
AI Solutions
IT Infrastructure
Cloud
Network
Cybersecurity
System Integration
Digital Transformation
```

## 02 — MECHANICAL & ELECTRICAL

```text
Mechanical Systems
Electrical Systems
HVAC
Plumbing
Fire Protection
Building Systems
```

## 03 — CIVIL

```text
Building Construction
Warehouse
Renovation
Structural Works
Infrastructure
Project Execution
```

## 04 — INTERIOR

```text
Office Interior
Commercial Interior
Retail
Fit-Out
Furniture
Renovation
```

Each service item should include:

- number
- title
- short statement
- image
- hover
- arrow
- route

---

# 11. INTEGRATED SOLUTIONS

Headline:

> **One partner. Multiple capabilities.**

## Smart Building

```text
IT
+
Network
+
Security
+
Electrical
+
Building Systems
```

## Digital Construction

```text
Software
+
Project Management
+
Data
+
Engineering
+
Construction
```

## Enterprise Infrastructure

```text
Server
+
Network
+
Cloud
+
Cybersecurity
+
Monitoring
```

Each solution:

- problem
- solution
- capabilities
- relevant projects
- CTA

This section is strategically important because it positions Aftech as a solution provider rather than a collection of unrelated services.

---

# 12. SELECTED WORKS

Headline:

> **Selected Works**

Filters:

```text
ALL
TECHNOLOGY
ME
CIVIL
INTERIOR
INTEGRATED
```

Visual style:

- editorial masonry
- large image
- asymmetric composition
- minimal metadata
- strong typography

Example:

```text
PROJECT IMAGE

Enterprise IT Infrastructure
Jakarta · 2026
Technology
```

Hover:

- image scale 1.03
- title reveal
- arrow
- subtle overlay

Never fabricate project information.

---

# 13. PROJECT DETAIL

Route:

```text
/projects/:slug
```

Structure:

```text
Hero
↓
Project Overview
↓
Scope of Work
↓
Technical Details
↓
Gallery
↓
Project Outcome
↓
Related Projects
↓
CTA
```

Data:

```ts
interface Project {
  id: string;
  slug: string;
  title: string;
  category:
    | "technology"
    | "me"
    | "civil"
    | "interior"
    | "integrated";
  client?: string;
  location?: string;
  year?: number;
  duration?: string;
  status?: "completed" | "ongoing";
  description: string;
  scope: string[];
  coverImage: string;
  gallery: string[];
  featured: boolean;
}
```

Confidential client/project information must never be published without approval.

---

# 14. CAPABILITIES

Headline:

> **Built around capability.**

Visual matrix:

```text
TECHNOLOGY
Software
AI
Infrastructure
Cloud
Network
Cybersecurity

ENGINEERING
Mechanical
Electrical
HVAC
Plumbing
Fire Protection

CONSTRUCTION
Civil
Warehouse
Renovation
Infrastructure

SPACE
Interior
Fit-Out
Furniture
Renovation
```

Do not use fake percentage progress bars.

---

# 15. HALORA

Headline:

> **Built together.**

Copy:

> Through our affiliated company Halora, Aftech extends its capabilities into civil construction and interior works.

Visual:

```text
AFTECH
Technology
Engineering
        +
HALORA
Civil
Interior
```

Route:

```text
/halora
```

Halora page:

```text
Hero
↓
Introduction
↓
Civil Capability
↓
Interior Capability
↓
Selected Projects
↓
Relationship / Ecosystem
↓
CTA
```

Important legal rule:

Only describe Halora as an affiliated company if that relationship is officially accurate. Do not state subsidiary, sister company, ownership, or legal structure unless verified.

---

# 16. CLIENTS / TRUST

Headline:

> **Trusted by organizations that build and move forward.**

Logo wall:

```text
CLIENT
CLIENT
CLIENT
CLIENT
CLIENT
CLIENT
```

Rules:

- only approved logos
- monochrome preferred
- no false endorsement
- no fabricated client list

---

# 17. INSIGHTS

Headline:

> **Aftech Insights**

Categories:

```text
Technology
Engineering
Construction
Business
```

Potential topics:

```text
AI for Business
Digital Transformation
IT Infrastructure
Smart Building
Project Management
Construction Technology
Cost Control
Cybersecurity
```

Article card:

```text
Category
Title
Excerpt
Date
Read Article →
```

Purpose:

- authority
- SEO
- thought leadership
- lead generation

---

# 18. ABOUT

Route:

```text
/about
```

Structure:

```text
Hero
↓
Company Overview
↓
Vision
↓
Mission
↓
Values
↓
Capabilities
↓
Leadership
↓
Affiliated Ecosystem
↓
CTA
```

Suggested values:

```text
Innovation
Integrity
Execution
Reliability
Collaboration
Continuous Improvement
```

All factual company information must be verified before publication.

---

# 19. SERVICE DETAIL PAGES

Template:

```text
Hero
↓
Introduction
↓
Capabilities
↓
Solutions
↓
Process
↓
Projects
↓
FAQ
↓
CTA
```

## Technology

```text
Software Development
AI
Data
Cloud
Server
Network
Cybersecurity
Automation
System Integration
```

## Mechanical & Electrical

```text
Mechanical
Electrical
HVAC
Plumbing
Fire Protection
Building Systems
```

## Civil

```text
Building
Warehouse
Renovation
Structural
Infrastructure
Project Execution
```

## Interior

```text
Office
Commercial
Retail
Fit-Out
Furniture
Renovation
```

---

# 20. CONTACT

Headline:

> **Have a project in mind?**

Copy:

> Tell us what you are building. Our team will help identify the right technology, engineering or construction approach.

Form:

```text
Full Name *
Company
Email *
Phone / WhatsApp
Project Type *
Budget Range
Location
Project Timeline
Message *
Attachment (optional)

Submit Inquiry
```

Project types:

```text
Technology
Mechanical & Electrical
Civil
Interior
Integrated Solution
Other
```

Validation:

- required fields
- email validation
- phone validation
- message length
- spam protection
- success state
- error state

---

# 21. HOSTINGER CONTACT FORM

Preferred V1:

```text
React Frontend
      ↓
Hostinger PHP Endpoint
      ↓
Validation + Sanitization
      ↓
SMTP / Hostinger Mail
      ↓
Company Email
```

Example:

```text
/api/contact.php
```

Rules:

- SMTP credentials stay server-side
- never expose secrets in Vite variables
- validate server-side
- sanitize input
- prevent header injection
- rate-limit where possible
- honeypot spam field
- return JSON response

If a third-party form provider is chosen, keep the frontend adapter isolated so it can be replaced later.

---

# 22. TECH STACK

## Frontend

```text
React
Vite
TypeScript
Tailwind CSS
Framer Motion
React Router
Lucide React
React Helmet Async
```

## Why this stack?

- modern
- fast
- maintainable
- easy to deploy to Hostinger
- static production output
- strong component architecture
- future CMS compatibility

## Production architecture

```text
Developer
   ↓
React + Vite
   ↓
npm run build
   ↓
dist/
   ↓
Hostinger
   ↓
public_html/
```

No Node.js runtime required in production for the static frontend.

---

# 23. PROJECT STRUCTURE

```text
aftech-corporate/
│
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   └── ImageReveal.tsx
│   │   ├── home/
│   │   ├── projects/
│   │   ├── services/
│   │   └── insights/
│   │
│   ├── data/
│   │   ├── company.ts
│   │   ├── projects.ts
│   │   ├── services.ts
│   │   └── insights.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Halora.tsx
│   │   ├── Insights.tsx
│   │   ├── InsightDetail.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── router/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 24. REUSABLE COMPONENTS

Required:

```text
Navbar
Footer
Container
Section
SectionHeading
Button
LinkArrow
ImageReveal
ProjectCard
ProjectGrid
ServiceCard
ServiceGrid
InsightCard
ClientLogoGrid
Stats
Marquee
Breadcrumb
ContactForm
PageHero
Gallery
```

Do not duplicate large JSX structures.

---

# 25. ANIMATION

Use Framer Motion.

Animation types:

### Page

Fade + translate.

### Image

Clip reveal / scale.

### Text

Staggered reveal.

### Hover

```text
scale 1 → 1.03
```

### Navigation

Smooth transition.

Accessibility:

```css
@media (prefers-reduced-motion: reduce)
```

Disable non-essential animation.

Do not let animations delay content accessibility.

---

# 26. IMAGE STRATEGY

Priority:

1. Actual Aftech projects
2. Actual engineering work
3. Actual interior projects
4. Actual IT infrastructure
5. Authorized professional photography
6. Carefully selected/generated abstract technology visuals

Recommended ratios:

```text
Hero: 16:9 / 21:9
Project: 16:10
Service: 4:3
Mobile Hero: 4:5
```

Optimization:

- WebP
- AVIF where supported
- responsive srcset
- lazy loading below fold
- width/height attributes
- compressed images
- eager loading only for hero

---

# 27. SEO

Every public route:

```text
title
description
canonical
Open Graph
Twitter/X metadata
structured data
```

Homepage example:

```text
Title:
PT Aftech Daya Solusindo | Technology, Engineering & Construction

Description:
PT Aftech Daya Solusindo delivers integrated technology, engineering, mechanical, electrical, civil and interior solutions.
```

Structured data where appropriate:

```text
Organization
WebSite
BreadcrumbList
Article
CreativeWork / Project
```

Never create misleading structured data.

---

# 28. PERFORMANCE

Targets:

```text
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

Priorities:

- image optimization
- lazy loading
- code splitting
- minimal JS
- no unnecessary libraries
- no oversized video
- preload only critical resources
- optimize fonts
- avoid layout shift

---

# 29. ACCESSIBILITY

Requirements:

- semantic HTML
- keyboard navigation
- visible focus
- descriptive alt text
- sufficient contrast
- correct heading hierarchy
- labels for form controls
- accessible mobile menu
- reduced motion
- accessible error messages

---

# 30. RESPONSIVE

Breakpoints:

```text
Mobile     < 640px
Tablet     640–1023px
Desktop    1024–1439px
Large      1440px+
```

Test:

```text
375
390
768
1024
1280
1440
1920
```

Must not have horizontal overflow.

---

# 31. DATA ARCHITECTURE — V1

Use TypeScript/local data:

```text
src/data/company.ts
src/data/services.ts
src/data/projects.ts
src/data/insights.ts
```

No database required for V1.

Benefits:

- simpler Hostinger deployment
- faster site
- fewer failure points
- cheaper infrastructure
- easy Git-based updates

Architecture must remain CMS-ready.

---

# 32. FUTURE CMS

Potential:

```text
Supabase
Sanity
Directus
Strapi
WordPress Headless
```

Future admin:

```text
Projects
Services
Insights
Clients
Team
Company Information
Contact Inquiries
SEO
Media
```

Roles:

```text
Super Admin
Editor
Author
```

Out of scope for V1.

---

# 33. ENVIRONMENT VARIABLES

`.env.example`:

```env
VITE_SITE_URL=https://www.example.com
VITE_SITE_NAME=PT Aftech Daya Solusindo
VITE_GA_ID=
VITE_CONTACT_ENDPOINT=
```

Never store:

```text
SMTP password
private API key
secret token
database password
```

in frontend Vite variables.

---

# 34. HOSTINGER DEPLOYMENT

Build:

```bash
npm install
npm run build
```

Output:

```text
dist/
```

Upload the contents of `dist/` to:

```text
public_html/
```

For React Router, use:

```apache
RewriteEngine On

RewriteBase /

RewriteRule ^index\.html$ - [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

RewriteRule . /index.html [L]
```

Verify:

- direct route access
- refresh on nested route
- asset paths
- HTTPS
- canonical domain
- www redirect

---

# 35. ANALYTICS

Recommended:

```text
Google Analytics 4
Google Search Console
```

Events:

```text
page_view
service_view
project_view
contact_start
contact_submit
cta_click
phone_click
whatsapp_click
email_click
```

Only use analytics consistent with applicable privacy requirements.

---

# 36. WHATSAPP

Optional CTA:

```text
Chat with Aftech
```

Do not hardcode an unverified number.

Use official company number once confirmed.

---

# 37. FOOTER

```text
AFTECH DAYA SOLUSINDO

Technology
Engineering
Construction

ABOUT
SERVICES
PROJECTS
HALORA
INSIGHTS
CONTACT

[Verified Address]

[Verified Email]
[Verified Phone]
[Verified WhatsApp]
[Verified Social Links]

© 2026 PT Aftech Daya Solusindo
All Rights Reserved.
```

---

# 38. LEGAL

Recommended:

```text
/privacy-policy
/terms
```

Optional:

```text
/cookie-policy
```

Legal text must be reviewed before publication.

---

# 39. CONTENT GOVERNANCE

Never invent:

- clients
- project values
- project counts
- years of experience
- awards
- certifications
- licenses
- partnerships
- government relationships
- legal ownership
- subsidiaries

Use placeholders:

```text
[CLIENT NAME]
[PROJECT NAME]
[LOCATION]
[YEAR]
```

until verified.

---

# 40. BILINGUAL READY

Architecture should support:

```text
/id/
/en/
```

or current Indonesian default with English added later.

Language switch:

```text
ID | EN
```

Do not publish incomplete translations.

---

# 41. ERROR PAGE

Route:

```text
404
```

Copy direction:

> **This page took another route.**

CTA:

```text
Back to Home →
```

---

# 42. SECURITY

Frontend:

- no secrets
- no credentials
- sanitize external content
- avoid unsafe HTML

Contact endpoint:

- server-side validation
- sanitization
- anti-spam
- rate limiting where possible
- header injection protection
- secure SMTP configuration

---

# 43. DEVELOPMENT RULES

Use strict TypeScript.

Avoid:

```ts
any
```

unless documented.

Rules:

- reusable components
- typed data
- semantic naming
- clean modules
- no giant components
- no duplicated layouts
- no unnecessary dependencies

---

# 44. NPM COMMANDS

Required:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

Recommended scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

---

# 45. GIT WORKFLOW

Branches:

```text
main
develop
feature/*
fix/*
```

Examples:

```text
feat: add technology service page
feat: add project portfolio
feat: add contact form
fix: mobile navigation
perf: optimize hero images
seo: add organization schema
```

---

# 46. QA CHECKLIST

## Functional

```text
[ ] Navigation works
[ ] Service filters work
[ ] Project filters work
[ ] Project details work
[ ] Service details work
[ ] Contact form validates
[ ] Contact email arrives
[ ] Mobile menu works
[ ] 404 works
```

## Visual

```text
[ ] Logo correct
[ ] Colors correct
[ ] Typography consistent
[ ] Images optimized
[ ] No layout shift
[ ] No horizontal overflow
[ ] Animations smooth
```

## SEO

```text
[ ] Page titles
[ ] Descriptions
[ ] Canonicals
[ ] Sitemap
[ ] Robots
[ ] OG image
[ ] Structured data
```

---

# 47. ACCEPTANCE CRITERIA

Website V1 is complete when:

1. Aftech's Technology-first positioning is obvious within the first viewport.
2. IT receives the strongest visual treatment.
3. ME, Civil and Interior are clearly represented.
4. Halora is presented accurately.
5. Project portfolio is visually dominant.
6. Website is fully responsive.
7. Vite production build succeeds.
8. `dist/` is deployable to Hostinger.
9. React routes work using `.htaccess`.
10. Contact form works.
11. SEO metadata exists for public pages.
12. Accessibility requirements are implemented.
13. No confidential or unverified claims are published.
14. No frontend secrets are exposed.
15. Performance is optimized.
16. Future CMS integration will not require rebuilding the entire frontend.

---

# 48. DEVELOPMENT PHASES

## Phase 1 — Foundation

```text
React
Vite
TypeScript
Tailwind
Router
Design system
Navbar
Footer
SEO
```

## Phase 2 — Homepage

```text
Hero
Technology
Digital → Physical
Services
Integrated Solutions
Selected Works
Capabilities
Halora
Clients
Insights
CTA
```

## Phase 3 — Inner Pages

```text
About
Services
Service Detail
Projects
Project Detail
Halora
Insights
Insight Detail
Contact
```

## Phase 4 — Production

```text
Performance
SEO
Accessibility
Contact endpoint
Analytics
Hostinger
```

## Phase 5 — Future

```text
CMS
Admin
CRM
Quotation
Career
Client Portal
AI Project Assistant
```

---

# 49. FUTURE LEAD PIPELINE

Potential evolution:

```text
Website Inquiry
↓
Lead
↓
Qualification
↓
Quotation
↓
Project
```

Future AI intake:

```text
Tell us about your project
↓
AI classification
↓
Technology / ME / Civil / Interior / Integrated
↓
Assign team
```

This is intentionally not part of V1.

---

# 50. FINAL HOMEPAGE NARRATIVE

```text
AFTECH
Technology × Engineering × Construction
        ↓
Technology is our core
        ↓
Digital Intelligence
        ↓
Engineering Capability
        ↓
Physical Infrastructure
        ↓
Space
        ↓
Integrated Solutions
        ↓
Selected Works
        ↓
Halora
        ↓
Trust
        ↓
Insights
        ↓
Have a project in mind?
        ↓
Let's build something that matters.
```

---

# 51. FINAL DESIGN PRINCIPLES

1. Technology-first positioning.
2. Premium architecture-inspired visual language.
3. Blue-white Aftech identity.
4. Large visual storytelling.
5. Real projects whenever possible.
6. Minimal but meaningful animation.
7. Whitespace over clutter.
8. Typography-driven hierarchy.
9. Projects over generic claims.
10. Performance over visual gimmicks.
11. Mobile-first implementation.
12. SEO from day one.
13. Hostinger-compatible static production.
14. No unnecessary backend in V1.
15. CMS-ready architecture.
16. Original design rather than a reference-site clone.
17. Every visual element must support credibility.
18. The website should feel like a technology company that can also execute physical infrastructure.

---

# 52. DEVELOPER HANDOFF PROMPT

Build the PT Aftech Daya Solusindo corporate website according to this PRD.

Use:

```text
React
Vite
TypeScript
Tailwind CSS
Framer Motion
React Router
Lucide React
React Helmet Async
```

Production must target Hostinger shared hosting.

The application must compile into a static `dist/` directory and must not require a Node.js runtime in production.

The design must feel like a premium technology × engineering × architecture company.

Use the Aftech blue-white identity.

Technology/IT is the strongest positioning. Mechanical & Electrical, Civil and Interior remain important capabilities. Halora is presented as an affiliated company only where officially accurate.

Build:

- immersive hero
- technology-first section
- digital-to-physical storytelling
- services
- integrated solutions
- selected works
- project detail
- capabilities
- Halora
- clients
- insights
- about
- contact

Use reusable components and typed data.

Use local TypeScript data for V1.

Do not invent clients, project values, awards, certifications, statistics, partnerships or legal claims.

Implement:

- responsive design
- accessibility
- SEO
- Open Graph
- structured data
- sitemap
- robots
- performance optimization
- image optimization
- reduced-motion support
- Hostinger SPA routing
- contact form architecture

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

The final `dist/` folder must be ready to upload to Hostinger `public_html`.

---

# 53. DEFINITION OF DONE

```text
[✓] Technology-first positioning
[✓] ME capability
[✓] Civil capability
[✓] Interior capability
[✓] Halora ecosystem
[✓] Premium visual direction
[✓] Homepage architecture
[✓] Project portfolio
[✓] Project detail
[✓] Service pages
[✓] About
[✓] Insights
[✓] Contact
[✓] SEO
[✓] Accessibility
[✓] Performance
[✓] Hostinger deployment
[✓] Static production architecture
[✓] CMS-ready architecture
[✓] Security baseline
[✓] Analytics-ready
[✓] Responsive specification
[✓] Developer handoff
```

---

## END

**PT Aftech Daya Solusindo**  
**Technology × Engineering × Construction**

**Version 1.0.0**
