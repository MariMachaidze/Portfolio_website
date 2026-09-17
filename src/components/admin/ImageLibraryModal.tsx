import { useEffect, useState, type ChangeEvent } from "react";
import { listImages, type UploadedImage } from "../../lib/adminApi";
import { compressAndUploadImage } from "../../lib/imageUpload";
import { Button } from "../ui/Button";

interface ImageLibraryModalProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function ImageLibraryModal({ onSelect, onClose }: ImageLibraryModalProps) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [images, setImages] = useState<UploadedImage[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listImages()
      .then((imgs) => {
        if (!cancelled) setImages(imgs);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load images");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const uploaded = await compressAndUploadImage(file);
      onSelect(uploaded.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Choose an image</h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-text" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setTab("library")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              tab === "library" ? "border-primary text-primary" : "border-transparent text-muted hover:text-text"
            }`}
          >
            Library
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              tab === "upload" ? "border-primary text-primary" : "border-transparent text-muted hover:text-text"
            }`}
          >
            Upload new
          </button>
        </div>

        {tab === "library" && (
          <div>
            {loadError && <p className="text-sm text-accent-2">{loadError}</p>}
            {!loadError && images === null && <p className="text-sm text-muted">Loading...</p>}
            {images !== null && images.length === 0 && (
              <p className="text-sm text-muted">No images uploaded yet — switch to &quot;Upload new&quot;.</p>
            )}
            {images !== null && images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <button
                    key={img.key}
                    type="button"
                    onClick={() => onSelect(img.url)}
                    className="aspect-square overflow-hidden rounded-lg border border-border transition-colors duration-200 hover:border-primary"
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "upload" && (
          <div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-text"
            />
            {uploading && <p className="mt-3 text-sm text-muted">Compressing and uploading...</p>}
            {uploadError && <p className="mt-3 text-sm text-accent-2">{uploadError}</p>}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
