export type ServiceCategory = "technology" | "mechanical-electrical" | "integrated-solutions";

export type ProjectCategory = "technology" | "me" | "integrated";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  client?: string;
  location?: string;
  year?: number;
  duration?: string;
  status?: "completed" | "ongoing";
  description: string;
  scope: string[];
  coverImage: string;
  gallery: { image: string; caption?: string }[];
  featured: boolean;
}

export interface Service {
  slug: ServiceCategory;
  number: string;
  title: string;
  shortStatement: string;
  intro: string;
  capabilities: string[];
  process: string[];
  faq: { question: string; answer: string }[];
  highlights?: string[];
  videoUrl?: string;
}

export interface Insight {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Technology" | "Engineering" | "Construction" | "Business";
  date: string;
  content: string[];
}

export interface NavItem {
  label: string;
  to: string;
  external?: boolean;
  children?: { label: string; to: string }[];
}
