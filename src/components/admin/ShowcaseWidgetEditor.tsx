import { useEffect, useState } from "react";
import type { ShowcaseWidget } from "../../types";
import { suggestGridSize } from "../../lib/showcaseGridGeometry";
import { WIDGET_TYPES, type WidgetKind } from "../../lib/showcaseWidgets";
import { ImagePickerField } from "./ImagePickerField";
import { TextField, TextAreaField } from "./forms/fields";

interface SizeSuggestion {
  w: number;
  h: number;
  label: string;
}

function useSizeSuggestion(src: string, kind: "image" | "video"): SizeSuggestion | null {
  const [suggestion, setSuggestion] = useState<SizeSuggestion | null>(null);
  const [trackedSrc, setTrackedSrc] = useState(src);

  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setSuggestion(null);
  }

  useEffect(() => {
    if (!src) return;
    let cancelled = false;

    if (kind === "image") {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        const { w, h } = suggestGridSize(img.naturalWidth, img.naturalHeight);
        setSuggestion({ w, h, label: `${img.naturalWidth}×${img.naturalHeight}` });
      };
      img.src = src;
    } else {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        if (cancelled) return;
        const { w, h } = suggestGridSize(video.videoWidth, video.videoHeight);
        setSuggestion({ w, h, label: `${video.videoWidth}×${video.videoHeight}` });
      };
      video.src = src;
    }

    return () => {
      cancelled = true;
    };
  }, [src, kind]);

  return suggestion;
}

function SizeSuggestionHint({
  suggestion,
  current,
  onApply,
}: {
  suggestion: SizeSuggestion | null;
  current: { w: number; h: number };
  onApply: (w: number, h: number) => void;
}) {
  if (!suggestion || (suggestion.w === current.w && suggestion.h === current.h)) return null;
  return (
    <p className="-mt-2 mb-3 text-xs text-muted">
      {suggestion.label} — suggested size {suggestion.w}×{suggestion.h}{" "}
      <button
        type="button"
        onClick={() => onApply(suggestion.w, suggestion.h)}
        className="font-medium text-primary underline"
      >
        Use suggested size
      </button>
    </p>
  );
}

interface ShowcaseWidgetEditorProps {
  widget: ShowcaseWidget;
  onChange: (widget: ShowcaseWidget) => void;
  onTypeChange: (type: WidgetKind) => void;
}

export function ShowcaseWidgetEditor({ widget, onChange, onTypeChange }: ShowcaseWidgetEditorProps) {
  const imageSuggestion = useSizeSuggestion(widget.type === "image" ? widget.src : "", "image");
  const videoSuggestion = useSizeSuggestion(widget.type === "video" ? widget.src : "", "video");

  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <select
          value={widget.type}
          onChange={(e) => onTypeChange(e.target.value as WidgetKind)}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary"
        >
          {WIDGET_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted">
          {widget.w}×{widget.h} grid cells
        </span>
      </div>

      {widget.type === "text" && (
        <>
          <TextField
            label="Heading"
            htmlFor={`showcase-heading-${widget.id}`}
            value={widget.heading ?? ""}
            onChange={(e) => onChange({ ...widget, heading: e.target.value || undefined })}
          />
          <TextAreaField
            label="Body"
            htmlFor={`showcase-body-${widget.id}`}
            rows={3}
            value={widget.body}
            onChange={(e) => onChange({ ...widget, body: e.target.value })}
          />
        </>
      )}

      {widget.type === "image" && (
        <>
          <ImagePickerField label="Image" value={widget.src} onChange={(url) => onChange({ ...widget, src: url })} />
          <SizeSuggestionHint
            suggestion={imageSuggestion}
            current={widget}
            onApply={(w, h) => onChange({ ...widget, w, h })}
          />
          <TextField
            label="Alt text"
            htmlFor={`showcase-alt-${widget.id}`}
            value={widget.alt}
            onChange={(e) => onChange({ ...widget, alt: e.target.value })}
          />
          <TextField
            label="Caption"
            htmlFor={`showcase-caption-${widget.id}`}
            value={widget.caption ?? ""}
            onChange={(e) => onChange({ ...widget, caption: e.target.value || undefined })}
          />
        </>
      )}

      {widget.type === "video" && (
        <>
          <TextField
            label="Video URL"
            htmlFor={`showcase-src-${widget.id}`}
            value={widget.src}
            onChange={(e) => onChange({ ...widget, src: e.target.value })}
          />
          <SizeSuggestionHint
            suggestion={videoSuggestion}
            current={widget}
            onApply={(w, h) => onChange({ ...widget, w, h })}
          />
          <TextField
            label="Caption"
            htmlFor={`showcase-caption-${widget.id}`}
            value={widget.caption ?? ""}
            onChange={(e) => onChange({ ...widget, caption: e.target.value || undefined })}
          />
        </>
      )}

      {widget.type === "youtube" && (
        <>
          <TextField
            label="YouTube video ID"
            htmlFor={`showcase-id-${widget.id}`}
            value={widget.ytId}
            onChange={(e) => onChange({ ...widget, ytId: e.target.value })}
          />
          <TextField
            label="Caption"
            htmlFor={`showcase-caption-${widget.id}`}
            value={widget.caption ?? ""}
            onChange={(e) => onChange({ ...widget, caption: e.target.value || undefined })}
          />
        </>
      )}

      {widget.type === "vimeo" && (
        <>
          <TextField
            label="Vimeo video ID"
            htmlFor={`showcase-id-${widget.id}`}
            value={widget.vimeoId}
            onChange={(e) => onChange({ ...widget, vimeoId: e.target.value })}
          />
          <TextField
            label="Caption"
            htmlFor={`showcase-caption-${widget.id}`}
            value={widget.caption ?? ""}
            onChange={(e) => onChange({ ...widget, caption: e.target.value || undefined })}
          />
        </>
      )}

      {widget.type === "highlights" && (
        <>
          <TextField
            label="Heading"
            htmlFor={`showcase-heading-${widget.id}`}
            value={widget.heading ?? ""}
            onChange={(e) => onChange({ ...widget, heading: e.target.value || undefined })}
          />
          <TextAreaField
            label="Highlights"
            htmlFor={`showcase-items-${widget.id}`}
            hint="one per line"
            rows={4}
            value={widget.items.join("\n")}
            onChange={(e) =>
              onChange({
                ...widget,
                items: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
              })
            }
          />
        </>
      )}

      {widget.type === "tech" && (
        <>
          <TextField
            label="Heading"
            htmlFor={`showcase-heading-${widget.id}`}
            value={widget.heading ?? ""}
            onChange={(e) => onChange({ ...widget, heading: e.target.value || undefined })}
          />
          <TextField
            label="Tech"
            htmlFor={`showcase-items-${widget.id}`}
            hint="comma separated"
            value={widget.items.join(", ")}
            onChange={(e) =>
              onChange({
                ...widget,
                items: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
          />
        </>
      )}

      {widget.type === "links" && (
        <>
          <TextField
            label="Demo URL"
            htmlFor={`showcase-demoUrl-${widget.id}`}
            value={widget.demoUrl ?? ""}
            onChange={(e) => onChange({ ...widget, demoUrl: e.target.value || undefined })}
          />
          <TextField
            label="Code URL"
            htmlFor={`showcase-codeUrl-${widget.id}`}
            value={widget.codeUrl ?? ""}
            onChange={(e) => onChange({ ...widget, codeUrl: e.target.value || undefined })}
          />
        </>
      )}
    </div>
  );
}
