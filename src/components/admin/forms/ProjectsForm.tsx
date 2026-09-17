import { useState, type FormEvent } from "react";
import type { Project, ProjectStatus } from "../../../types";
import { useContentEditor } from "../../../hooks/useContentEditor";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { ReorderableList } from "../ReorderableList";
import { Button } from "../../ui/Button";
import { TextField, TextAreaField } from "./fields";

const STATUS_OPTIONS: ProjectStatus[] = ["live", "in-progress", "archived"];

function emptyProject(): Project {
  const seed = `new-project-${Date.now()}`;
  return {
    slug: seed,
    title: "New project",
    summary: "",
    description: "",
    coverSeed: seed,
    status: "in-progress",
    tech: [],
    highlights: [],
    links: {},
    gallery: [],
  };
}

function galleryDraftsFrom(projects: Project[]): Record<string, string> {
  const drafts: Record<string, string> = {};
  for (const p of projects) drafts[p.slug] = JSON.stringify(p.gallery, null, 2);
  return drafts;
}

export function ProjectsForm() {
  const editor = useContentEditor<Project[]>("projects");
  const { draft, setDraft } = editor;
  const [galleryDrafts, setGalleryDrafts] = useState<Record<string, string>>({});
  const [galleryErrors, setGalleryErrors] = useState<Record<string, string>>({});
  const [syncedSavedData, setSyncedSavedData] = useState<Project[] | null>(null);

  // Re-derive the gallery JSON textareas whenever the server-loaded/saved
  // snapshot changes (initial load, manual reload, or a successful save) —
  // same render-time-sync approach useContentEditor uses for `draft` itself.
  if (editor.savedData !== syncedSavedData) {
    setSyncedSavedData(editor.savedData);
    setGalleryDrafts(editor.savedData ? galleryDraftsFrom(editor.savedData) : {});
    setGalleryErrors({});
  }

  if (editor.loading) return <p className="text-sm text-muted">Loading projects...</p>;
  if (editor.loadError) return <p className="text-sm text-accent-2">{editor.loadError}</p>;
  if (!draft) return null;

  function update(slug: string, patch: Partial<Project>) {
    setDraft((prev) => prev && prev.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  }

  function removeProject(slug: string) {
    setDraft((prev) => prev && prev.filter((p) => p.slug !== slug));
  }

  function addProject() {
    const p = emptyProject();
    setDraft((prev) => [p, ...(prev ?? [])]);
    setGalleryDrafts((prev) => ({ ...prev, [p.slug]: "[]" }));
  }

  function handleGalleryChange(slug: string, text: string) {
    setGalleryDrafts((prev) => ({ ...prev, [slug]: text }));
    try {
      const parsed = JSON.parse(text);
      update(slug, { gallery: parsed });
      setGalleryErrors((prev) => ({ ...prev, [slug]: "" }));
    } catch {
      setGalleryErrors((prev) => ({ ...prev, [slug]: "Invalid JSON — not saved yet" }));
    }
  }

  const hasGalleryError = Object.values(galleryErrors).some(Boolean);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft || hasGalleryError) return;
    await editor.save(draft);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Button type="button" variant="secondary" onClick={addProject} className="mb-4">
        + Add project
      </Button>

      <ReorderableList
        items={draft}
        getId={(p) => p.slug}
        onReorder={setDraft}
        renderItem={(project) => (
          <div className="mb-4 rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex justify-end">
              <Button type="button" variant="ghost" onClick={() => removeProject(project.slug)}>
                Remove
              </Button>
            </div>
            <TextField
              label="Slug"
              htmlFor={`proj-slug-${project.slug}`}
              hint="URL: /projects/<slug>, lowercase-with-hyphens"
              value={project.slug}
              onChange={(e) => update(project.slug, { slug: e.target.value })}
            />
            <TextField
              label="Title"
              htmlFor={`proj-title-${project.slug}`}
              value={project.title}
              onChange={(e) => update(project.slug, { title: e.target.value })}
            />
            <TextAreaField
              label="Summary"
              htmlFor={`proj-summary-${project.slug}`}
              rows={2}
              value={project.summary}
              onChange={(e) => update(project.slug, { summary: e.target.value })}
            />
            <TextAreaField
              label="Description"
              htmlFor={`proj-description-${project.slug}`}
              rows={4}
              value={project.description}
              onChange={(e) => update(project.slug, { description: e.target.value })}
            />
            <TextField
              label="Cover seed"
              htmlFor={`proj-coverSeed-${project.slug}`}
              hint="unique string, used for the placeholder cover pattern"
              value={project.coverSeed}
              onChange={(e) => update(project.slug, { coverSeed: e.target.value })}
            />

            <div className="mb-4">
              <label htmlFor={`proj-status-${project.slug}`} className="mb-1.5 block text-sm font-medium text-text">
                Status
              </label>
              <select
                id={`proj-status-${project.slug}`}
                value={project.status}
                onChange={(e) => update(project.slug, { status: e.target.value as ProjectStatus })}
                className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <label className="mb-4 flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={Boolean(project.featured)}
                onChange={(e) => update(project.slug, { featured: e.target.checked })}
              />
              Featured
            </label>

            <TextField
              label="Tech"
              htmlFor={`proj-tech-${project.slug}`}
              hint="comma separated"
              value={project.tech.join(", ")}
              onChange={(e) =>
                update(project.slug, {
                  tech: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />
            <TextAreaField
              label="Highlights"
              htmlFor={`proj-highlights-${project.slug}`}
              hint="one per line"
              rows={3}
              value={project.highlights.join("\n")}
              onChange={(e) =>
                update(project.slug, {
                  highlights: e.target.value
                    .split("\n")
                    .map((h) => h.trim())
                    .filter(Boolean),
                })
              }
            />
            <TextField
              label="Demo URL"
              htmlFor={`proj-demoUrl-${project.slug}`}
              value={project.links.demoUrl ?? ""}
              onChange={(e) => update(project.slug, { links: { ...project.links, demoUrl: e.target.value || undefined } })}
            />
            <TextField
              label="Code URL"
              htmlFor={`proj-codeUrl-${project.slug}`}
              value={project.links.codeUrl ?? ""}
              onChange={(e) => update(project.slug, { links: { ...project.links, codeUrl: e.target.value || undefined } })}
            />

            <TextAreaField
              label="Gallery"
              htmlFor={`proj-gallery-${project.slug}`}
              hint="raw JSON for now — a proper image picker is coming in a later phase"
              rows={8}
              value={galleryDrafts[project.slug] ?? "[]"}
              onChange={(e) => handleGalleryChange(project.slug, e.target.value)}
              className="font-mono text-xs"
            />
            {galleryErrors[project.slug] && (
              <p className="-mt-3 mb-4 text-sm text-accent-2">{galleryErrors[project.slug]}</p>
            )}
          </div>
        )}
      />

      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={editor.saving || hasGalleryError}>
          {editor.saving ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            editor.discard();
            if (editor.savedData) setGalleryDrafts(galleryDraftsFrom(editor.savedData));
            setGalleryErrors({});
          }}
          disabled={editor.saving}
        >
          Discard changes
        </Button>
      </div>
      {hasGalleryError && <p className="mt-3 text-sm text-accent-2">Fix the invalid gallery JSON above before saving.</p>}
      {editor.saveError && <p className="mt-3 text-sm text-accent-2">{editor.saveError}</p>}
      <div className="mt-3">
        <SaveStatusIndicator {...editor.deployStatus} />
      </div>
    </form>
  );
}
