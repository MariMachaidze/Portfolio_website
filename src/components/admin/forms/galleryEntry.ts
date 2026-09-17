import type { MediaItem } from "../../../types";

export type MediaKind = MediaItem["type"];
export const MEDIA_TYPES: MediaKind[] = ["image", "video", "youtube", "vimeo"];

export interface GalleryEntry {
  entryId: string;
  item: MediaItem;
}

export function emptyMediaItem(type: MediaKind): MediaItem {
  switch (type) {
    case "image":
      return { type: "image", src: "", alt: "" };
    case "video":
      return { type: "video", src: "" };
    case "youtube":
      return { type: "youtube", id: "" };
    case "vimeo":
      return { type: "vimeo", id: "" };
  }
}

export function tagGallery(items: MediaItem[]): GalleryEntry[] {
  return items.map((item) => ({ entryId: crypto.randomUUID(), item }));
}
