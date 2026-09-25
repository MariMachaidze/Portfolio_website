import { z } from "zod";

const IconKeySchema = z.enum([
  "code",
  "server",
  "palette",
  "database",
  "cloud",
  "wrench",
  "terminal",
  "layout",
]);

const SocialLinksSchema = z.object({
  github: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  twitterHandle: z.string(),
  email: z.string(),
});

export const ProfileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  yearsExperience: z.number().optional(),
  showYearsExperience: z.boolean().optional(),
  badge: z.string().optional(),
  showBadge: z.boolean().optional(),
  blurb: z.string(),
  location: z.string(),
  phone: z.string(),
  email: z.string(),
  avatarAlt: z.string(),
  avatarUrl: z.string().optional(),
  social: SocialLinksSchema,
});

const SkillItemSchema = z.object({ name: z.string().min(1) });

export const SkillsSchema = z.array(
  z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    icon: IconKeySchema,
    description: z.string().optional(),
    items: z.array(SkillItemSchema),
  }),
);

export const ExperienceSchema = z.array(
  z.object({
    id: z.string().min(1),
    role: z.string().min(1),
    company: z.string().min(1),
    companyUrl: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    location: z.string(),
    locationType: z.enum(["Remote", "Hybrid", "On-site"]).optional(),
    summary: z.string(),
    bullets: z.array(z.string()),
    tech: z.array(z.string()),
  }),
);

const ProjectLinksSchema = z.object({
  codeUrl: z.string().optional(),
});

const ShowcasePositionSchema = {
  id: z.string().min(1),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  w: z.number().int().min(1),
  h: z.number().int().min(1),
};

const ShowcaseWidgetSchema = z.discriminatedUnion("type", [
  z.object({ ...ShowcasePositionSchema, type: z.literal("text"), heading: z.string().optional(), body: z.string() }),
  z.object({
    ...ShowcasePositionSchema,
    type: z.literal("image"),
    src: z.string().min(1),
    alt: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    ...ShowcasePositionSchema,
    type: z.literal("video"),
    src: z.string().min(1),
    poster: z.string().optional(),
    caption: z.string().optional(),
  }),
  z.object({ ...ShowcasePositionSchema, type: z.literal("youtube"), ytId: z.string().min(1), caption: z.string().optional() }),
  z.object({ ...ShowcasePositionSchema, type: z.literal("vimeo"), vimeoId: z.string().min(1), caption: z.string().optional() }),
  z.object({
    ...ShowcasePositionSchema,
    type: z.literal("highlights"),
    heading: z.string().optional(),
    items: z.array(z.string()),
  }),
  z.object({
    ...ShowcasePositionSchema,
    type: z.literal("tech"),
    heading: z.string().optional(),
    items: z.array(z.string()),
  }),
  z.object({
    ...ShowcasePositionSchema,
    type: z.literal("links"),
    demoUrl: z.string().optional(),
    codeUrl: z.string().optional(),
  }),
]);

const ShowcaseStickerSchema = z.object({
  id: z.string().min(1),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  stickerKey: z.string().min(1),
  customSrc: z.string().optional(),
});

const ProjectShowcaseSchema = z.object({
  widgets: z.array(ShowcaseWidgetSchema),
  stickers: z.array(ShowcaseStickerSchema),
});

export const ProjectsSchema = z
  .array(
    z.object({
      slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, and hyphens only"),
      title: z.string().min(1),
      summary: z.string(),
      coverSeed: z.string(),
      status: z.enum(["in-progress", "finished", "paused"]),
      startDate: z.string(),
      endDate: z.string(),
      tech: z.array(z.string()),
      links: ProjectLinksSchema,
      showcase: ProjectShowcaseSchema.optional(),
    }),
  )
  .refine((projects) => new Set(projects.map((p) => p.slug)).size === projects.length, {
    message: "Project slugs must be unique",
  });

export const CONTENT_SCHEMAS = {
  profile: ProfileSchema,
  skills: SkillsSchema,
  experience: ExperienceSchema,
  projects: ProjectsSchema,
} as const;
