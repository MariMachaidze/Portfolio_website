export interface SocialLinks {
  github: string;
  linkedin: string;
  /** Full profile URL, e.g. https://x.com/alexrivera_dev */
  twitter: string;
  /** Handle without "@", used for the X widget embed and social links */
  twitterHandle: string;
  email: string;
}

export interface Profile {
  name: string;
  role: string;
  yearsExperience?: number;
  /** Whether the years-of-experience text renders next to the role in the Hero. */
  showYearsExperience?: boolean;
  badge?: string;
  /** Whether the badge pill renders above the name in the Hero. */
  showBadge?: boolean;
  blurb: string;
  location: string;
  phone: string;
  email: string;
  avatarAlt: string;
  /** Uploaded photo URL; falls back to a generated placeholder avatar when empty. */
  avatarUrl?: string;
  social: SocialLinks;
}

export interface SkillItem {
  id: string;
  name: string;
  /** "Where I used it" blurb shown in the skills chip's detail panel. */
  usage: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  /** Hex color used for this category's pin markers and legend swatch (bold accent). */
  color: string;
  /** Hex color used for the lighter accent variant (e.g. the detail panel's category dot). */
  light: string;
  items: SkillItem[];
}

export interface SkillsContent {
  categories: SkillCategory[];
  /** Freeform "Additional tools" line shown below the skills chip. */
  additionalTools: string;
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

export type ProjectStatus = "in-progress" | "finished" | "paused";

export interface ProjectLinks {
  codeUrl?: string;
  /** Optional written report (e.g. a thesis PDF), linked next to the repository. */
  thesisUrl?: string;
}
/** Which animated figure the Projects section draws next to the card. */
export type ProjectVisual = "sorter" | "mcp" | "jobs" | "pointing" | "trust" | "duckie" | "portfolio";

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

export interface ProjectGalleryImage {
  id: string;
  src: string;
  alt: string;
}

export type ProjectVideo =
  | { type: "video"; src: string; poster?: string }
  | { type: "youtube"; ytId: string }
  | { type: "vimeo"; vimeoId: string };

export interface Project {
  /** Stable internal identity — never shown or edited directly. Keep `slug` (the public URL) and this separate: `slug` is meant to change, this isn't. */
  id: string;
  slug: string;
  title: string;
  /** Small label above the title, e.g. "Embedded AI · Robotics". */
  category?: string;
  summary: string;
  /** Seed used to deterministically generate the placeholder cover art */
  coverSeed: string;
  status: ProjectStatus;
  /** "2023-03" style */
  startDate: string;
  endDate: string | "Present";
  tech: string[];
  links: ProjectLinks;
  /** Animated figure drawn on the card; cards without one show text only. */
  visual?: ProjectVisual;
  /** Wide card with the text and figure side by side. */
  featured?: boolean;
  /** Write-up shown next to the gallery on the project's own page. */
  description?: string;
  /** Photo dump, laid out 2-per-row next to the description. */
  gallery?: ProjectGalleryImage[];
  /** Single optional video, shown full-width below the gallery/description. */
  video?: ProjectVideo;
  /** Bento-grid showcase — not currently rendered (paused in favor of the simpler gallery/description/video layout above), kept so nothing already built is lost. */
  showcase?: ProjectShowcase;
}
