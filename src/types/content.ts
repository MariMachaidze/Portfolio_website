export const CONTENT_KEYS = ["profile", "skills", "experience", "projects"] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];
