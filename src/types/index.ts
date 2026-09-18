export type IconKey =
  | "code"
  | "server"
  | "palette"
  | "database"
  | "cloud"
  | "wrench"
  | "terminal"
  | "layout";

export interface SocialLinks {
  github: string;
  linkedin: string;
  /** Full profile URL, e.g. https://x.com/alexrivera_dev */
  twitter: string;
  /** Handle without "@", used for the X widget embed and social links */
  twitterHandle: string;
  email: string;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  role: string;
  yearsExperience: number;
  badge: string;
  heading: string;
  blurb: string;
  location: string;
  phone: string;
  email: string;
  avatarAlt: string;
  /** Uploaded photo URL; falls back to a generated placeholder avatar when empty. */
  avatarUrl?: string;
  /** Path to a downloadable resume PDF under /public, e.g. "/resume.pdf" */
  resumeUrl: string;
  stats: ProfileStat[];
  social: SocialLinks;
}

export interface SkillItem {
  name: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: IconKey;
  description?: string;
  items: SkillItem[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  /** "2023-03" style */
  startDate: string;
  endDate: string | "Present";
  location: string;
  locationType?: "Remote" | "Hybrid" | "On-site";
  summary: string;
  bullets: string[];
  tech: string[];
}

export type ProjectStatus = "live" | "in-progress" | "archived";

export type MediaItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "youtube"; id: string; caption?: string }
  | { type: "vimeo"; id: string; caption?: string };

export interface ProjectLinks {
  demoUrl?: string;
  codeUrl?: string;
}

export type ShowcaseWidget =
  | { id: string; x: number; y: number; w: number; h: number; type: "text"; heading?: string; body: string }
  | {
      id: string;
      x: number;
      y: number;
      w: number;
      h: number;
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      id: string;
      x: number;
      y: number;
      w: number;
      h: number;
      type: "video";
      src: string;
      poster?: string;
      caption?: string;
    }
  | { id: string; x: number; y: number; w: number; h: number; type: "youtube"; ytId: string; caption?: string }
  | { id: string; x: number; y: number; w: number; h: number; type: "vimeo"; vimeoId: string; caption?: string }
  | { id: string; x: number; y: number; w: number; h: number; type: "highlights"; heading?: string; items: string[] }
  | { id: string; x: number; y: number; w: number; h: number; type: "tech"; heading?: string; items: string[] }
  | { id: string; x: number; y: number; w: number; h: number; type: "links"; demoUrl?: string; codeUrl?: string };

export interface ShowcaseSticker {
  id: string;
  x: number;
  y: number;
  /** Built-in library key (see src/data/stickers.ts), or "custom" for an uploaded image */
  stickerKey: string;
  /** Required when stickerKey === "custom" */
  customSrc?: string;
}

export interface ProjectShowcase {
  widgets: ShowcaseWidget[];
  stickers: ShowcaseSticker[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  /** Seed used to deterministically generate the placeholder cover art */
  coverSeed: string;
  status: ProjectStatus;
  tech: string[];
  highlights: string[];
  links: ProjectLinks;
  gallery: MediaItem[];
  featured?: boolean;
  /** Optional bento-grid showcase rendered on the project's own page only. */
  showcase?: ProjectShowcase;
}
