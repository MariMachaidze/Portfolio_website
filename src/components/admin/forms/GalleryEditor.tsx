import type { MediaItem } from "../../../types";
import { ReorderableList } from "../ReorderableList";
import { ImagePickerField } from "../ImagePickerField";
import { Button } from "../../ui/Button";
import { TextField } from "./fields";
import { MEDIA_TYPES, emptyMediaItem, type GalleryEntry, type MediaKind } from "./galleryEntry";

interface GalleryEditorProps {
  entries: GalleryEntry[];
  onChange: (entries: GalleryEntry[]) => void;
}

export function GalleryEditor({ entries, onChange }: GalleryEditorProps) {
  function updateEntry(entryId: string, nextItem: MediaItem) {
    onChange(entries.map((e) => (e.entryId === entryId ? { entryId, item: nextItem } : e)));
  }

  function removeEntry(entryId: string) {
    onChange(entries.filter((e) => e.entryId !== entryId));
  }

  function addEntry(type: MediaKind) {
    onChange([...entries, { entryId: crypto.randomUUID(), item: emptyMediaItem(type) }]);
  }

  function changeType(entryId: string, type: MediaKind) {
    onChange(entries.map((e) => (e.entryId === entryId ? { entryId, item: emptyMediaItem(type) } : e)));
  }

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-text">Gallery</label>

      {entries.length > 0 && (
        <ReorderableList
          items={entries}
          getId={(e) => e.entryId}
          onReorder={onChange}
          className="mb-3"
          renderItem={(entry) => {
            const { item } = entry;
            return (
              <div className="mb-3 rounded-lg border border-border bg-bg p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <select
                    value={item.type}
                    onChange={(e) => changeType(entry.entryId, e.target.value as MediaKind)}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
                  >
                    {MEDIA_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <Button type="button" variant="ghost" onClick={() => removeEntry(entry.entryId)}>
                    Remove
                  </Button>
                </div>

                {item.type === "image" && (
                  <>
                    <ImagePickerField
                      label="Image"
                      value={item.src}
                      onChange={(url) => updateEntry(entry.entryId, { ...item, src: url })}
                    />
                    <TextField
                      label="Alt text"
                      htmlFor={`gallery-alt-${entry.entryId}`}
                      value={item.alt}
                      onChange={(e) => updateEntry(entry.entryId, { ...item, alt: e.target.value })}
                    />
                  </>
                )}

                {item.type === "video" && (
                  <>
                    <TextField
                      label="Video URL"
                      htmlFor={`gallery-src-${entry.entryId}`}
                      hint="e.g. /projects/slug/demo.mp4"
                      value={item.src}
                      onChange={(e) => updateEntry(entry.entryId, { ...item, src: e.target.value })}
                    />
                    <TextField
                      label="Caption"
                      htmlFor={`gallery-caption-${entry.entryId}`}
                      value={item.caption ?? ""}
                      onChange={(e) => updateEntry(entry.entryId, { ...item, caption: e.target.value || undefined })}
                    />
                  </>
                )}

                {(item.type === "youtube" || item.type === "vimeo") && (
                  <>
                    <TextField
                      label={item.type === "youtube" ? "YouTube video ID" : "Vimeo video ID"}
                      htmlFor={`gallery-id-${entry.entryId}`}
                      value={item.id}
                      onChange={(e) => updateEntry(entry.entryId, { ...item, id: e.target.value })}
                    />
                    <TextField
                      label="Caption"
                      htmlFor={`gallery-caption-${entry.entryId}`}
                      value={item.caption ?? ""}
                      onChange={(e) => updateEntry(entry.entryId, { ...item, caption: e.target.value || undefined })}
                    />
                  </>
                )}
              </div>
            );
          }}
        />
      )}

      <div className="flex flex-wrap gap-2">
        {MEDIA_TYPES.map((t) => (
          <Button key={t} type="button" variant="secondary" onClick={() => addEntry(t)}>
            + Add {t}
          </Button>
        ))}
      </div>
    </div>
  );
}
