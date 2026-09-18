export interface StickerDef {
  key: string;
  emoji: string;
  label: string;
}

export const BUILTIN_STICKERS: StickerDef[] = [
  { key: "heart", emoji: "❤️", label: "Heart" },
  { key: "star", emoji: "⭐", label: "Star" },
  { key: "sparkle", emoji: "✨", label: "Sparkle" },
  { key: "rocket", emoji: "🚀", label: "Rocket" },
  { key: "fire", emoji: "🔥", label: "Fire" },
  { key: "bolt", emoji: "⚡", label: "Bolt" },
];
