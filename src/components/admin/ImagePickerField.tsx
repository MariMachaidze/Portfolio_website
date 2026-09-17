import { useState } from "react";
import { ImageLibraryModal } from "./ImageLibraryModal";
import { Button } from "../ui/Button";

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImagePickerField({ label, value, onChange, hint }: ImagePickerFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-text">
        {label}
        {hint && <span className="ml-1.5 font-normal text-muted">{hint}</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">None</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
            Choose image
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-left text-xs text-muted underline hover:text-text"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {open && (
        <ImageLibraryModal
          onSelect={(url) => {
            onChange(url);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
