import { useState, type FormEvent } from "react";
import type { Project, ProjectGalleryImage, ProjectStatus, ProjectVideo } from "../../../types";
import { useContentEditor } from "../../../hooks/useContentEditor";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { ReorderableList } from "../ReorderableList";
import { ImagePickerField } from "../ImagePickerField";
import { Button } from "../../ui/Button";
import { TextField, TextAreaField, DelimitedListField } from "./fields";
import { ShowcaseGridEditor } from "../ShowcaseGridEditor";
import { SaveIssuesList } from "../SaveIssuesList";

const STATUS_OPTIONS: ProjectStatus[] = ["in-progress", "finished", "paused"];
const EMPTY_SHOWCASE = { widgets: [], stickers: [] };
const DEFAULT_COMMIT_MESSAGE = "Update projects";

type VideoKind = "none" | ProjectVideo["type"];

function emptyVideo(type: ProjectVideo["type"]): ProjectVideo {
  switch (type) {
    case "video":
      return { type: "video", src: "" };
    case "youtube":
      return { type: "youtube", ytId: "" };
    case "vimeo":
      return { type: "vimeo", vimeoId: "" };
  }
}

function emptyProject(): Project {
  const seed = `new-project-${Date.now()}`;
  return {
    id: crypto.randomUUID(),
    slug: seed,
    title: "New project",
    summary: "",
    coverSeed: seed,
    status: "in-progress",
    startDate: "",
    endDate: "Present",
    tech: [],
    links: {},
    showcase: { widgets: [], stickers: [] },
  };
}

export function ProjectsForm() {
  const editor = useContentEditor<Project[]>("projects");
  const { draft, setDraft } = editor;
  const [commitMessage, setCommitMessage] = useState(DEFAULT_COMMIT_MESSAGE);

  if (editor.loading) return <p className="text-sm text-muted">Loading projects...</p>;
  if (editor.loadError) return <p className="text-sm text-accent-2">{editor.loadError}</p>;
  if (!draft) return null;

  function update(id: string, patch: Partial<Project>) {
    setDraft((prev) => prev && prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removeProject(id: string) {
    setDraft((prev) => prev && prev.filter((p) => p.id !== id));
  }

  function setGallery(id: string, gallery: ProjectGalleryImage[]) {
    update(id, { gallery });
  }

  function addGalleryImage(project: Project) {
    setGallery(project.id, [...(project.gallery ?? []), { id: crypto.randomUUID(), src: "", alt: "" }]);
  }

  function updateGalleryImage(project: Project, id: string, patch: Partial<ProjectGalleryImage>) {
    setGallery(
      project.id,
      (project.gallery ?? []).map((img) => (img.id === id ? { ...img, ...patch } : img)),
    );
  }

  function removeGalleryImage(project: Project, id: string) {
    setGallery(project.id, (project.gallery ?? []).filter((img) => img.id !== id));
  }

  function setVideoKind(id: string, kind: VideoKind) {
    update(id, { video: kind === "none" ? undefined : emptyVideo(kind) });
  }

  function addProject() {
    setDraft((prev) => [emptyProject(), ...(prev ?? [])]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const ok = await editor.save(draft, commitMessage);
    if (ok) setCommitMessage(DEFAULT_COMMIT_MESSAGE);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <Button type="button" variant="secondary" onClick={addProject} className="mb-4">
        + Add project
      </Button>

      <ReorderableList
        items={draft}
        getId={(p) => p.id}
        onReorder={setDraft}
        renderItem={(project) => (
          <div className="mb-4 rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex justify-end">
              <Button type="button" variant="ghost" onClick={() => removeProject(project.id)}>
                Remove
              </Button>
            </div>
            <TextField
              label="Slug"
              htmlFor={`proj-slug-${project.id}`}
              hint="URL: /projects/<slug>, lowercase-with-hyphens"
              value={project.slug}
              onChange={(e) => update(project.id, { slug: e.target.value })}
            />
            <TextField
              label="Title"
              htmlFor={`proj-title-${project.id}`}
              value={project.title}
              onChange={(e) => update(project.id, { title: e.target.value })}
            />
            <TextField
              label="Summary"
              htmlFor={`proj-summary-${project.id}`}
              value={project.summary}
              onChange={(e) => update(project.id, { summary: e.target.value })}
            />
            <TextField
              label="Cover seed"
              htmlFor={`proj-coverSeed-${project.id}`}
              hint="unique string, used for the placeholder cover pattern"
              value={project.coverSeed}
              onChange={(e) => update(project.id, { coverSeed: e.target.value })}
            />

            <div className="mb-4">
              <label htmlFor={`proj-status-${project.id}`} className="mb-1.5 block text-sm font-medium text-text">
                Status
              </label>
              <select
                id={`proj-status-${project.id}`}
                value={project.status}
                onChange={(e) => update(project.id, { status: e.target.value as ProjectStatus })}
                className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Start date"
                htmlFor={`proj-start-${project.id}`}
                hint="YYYY-MM"
                value={project.startDate}
                onChange={(e) => update(project.id, { startDate: e.target.value })}
              />
              <TextField
                label="End date"
                htmlFor={`proj-end-${project.id}`}
                hint='YYYY-MM or "Present"'
                value={project.endDate}
                onChange={(e) => update(project.id, { endDate: e.target.value })}
              />
            </div>

            <DelimitedListField
              label="Tech"
              htmlFor={`proj-tech-${project.id}`}
              hint="comma separated"
              delimiter=","
              value={project.tech}
              onChange={(tech) => update(project.id, { tech })}
            />
            <TextField
              label="Code URL"
              htmlFor={`proj-codeUrl-${project.id}`}
              value={project.links.codeUrl ?? ""}
              onChange={(e) => update(project.id, { links: { codeUrl: e.target.value || undefined } })}
            />

            <h4 className="mb-2 mt-4 text-sm font-semibold text-text">
              Project page content <span className="font-normal text-muted">(shown on this project's own page)</span>
            </h4>

            <TextAreaField
              label="Description"
              htmlFor={`proj-description-${project.id}`}
              rows={4}
              value={project.description ?? ""}
              onChange={(e) => update(project.id, { description: e.target.value || undefined })}
            />

            <h5 className="mb-2 text-sm font-medium text-text">Photo gallery</h5>
            <ReorderableList
              items={project.gallery ?? []}
              getId={(img) => img.id}
              onReorder={(gallery) => setGallery(project.id, gallery)}
              className="mb-3 space-y-3"
              renderItem={(image) => (
                <div className="rounded-lg border border-border bg-bg p-3">
                  <ImagePickerField
                    label="Photo"
                    value={image.src}
                    onChange={(url) => updateGalleryImage(project, image.id, { src: url })}
                  />
                  <TextField
                    label="Alt text"
                    htmlFor={`proj-gallery-alt-${image.id}`}
                    value={image.alt}
                    onChange={(e) => updateGalleryImage(project, image.id, { alt: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(project, image.id)}
                    className="text-xs text-muted underline hover:text-accent-2"
                  >
                    Remove photo
                  </button>
                </div>
              )}
            />
            <Button type="button" variant="secondary" onClick={() => addGalleryImage(project)} className="mb-4">
              + Add photo
            </Button>

            <h5 className="mb-2 text-sm font-medium text-text">Video</h5>
            <div className="mb-4">
              <label
                htmlFor={`proj-video-kind-${project.id}`}
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Video type
              </label>
              <select
                id={`proj-video-kind-${project.id}`}
                value={project.video?.type ?? "none"}
                onChange={(e) => setVideoKind(project.id, e.target.value as VideoKind)}
                className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary"
              >
                <option value="none">None</option>
                <option value="video">Direct video URL</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
              </select>
            </div>
            {project.video?.type === "video" && (
              <TextField
                label="Video URL"
                htmlFor={`proj-video-src-${project.id}`}
                value={project.video.src}
                onChange={(e) => update(project.id, { video: { type: "video", src: e.target.value } })}
              />
            )}
            {project.video?.type === "youtube" && (
              <TextField
                label="YouTube video ID"
                htmlFor={`proj-video-yt-${project.id}`}
                value={project.video.ytId}
                onChange={(e) => update(project.id, { video: { type: "youtube", ytId: e.target.value } })}
              />
            )}
            {project.video?.type === "vimeo" && (
              <TextField
                label="Vimeo video ID"
                htmlFor={`proj-video-vimeo-${project.id}`}
                value={project.video.vimeoId}
                onChange={(e) => update(project.id, { video: { type: "vimeo", vimeoId: e.target.value } })}
              />
            )}

            <h4 className="mb-2 mt-6 text-sm font-semibold text-text">
              Showcase grid{" "}
              <span className="font-normal text-muted">
                (paused — not currently shown on the page, replaced by the content above)
              </span>
            </h4>
            <ShowcaseGridEditor
              showcase={project.showcase ?? EMPTY_SHOWCASE}
              onChange={(showcase) => update(project.id, { showcase })}
            />
          </div>
        )}
      />

      <TextField
        label="Commit message"
        htmlFor="projects-commit-message"
        hint="shown as the commit title on GitHub"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
      />

      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={editor.saving}>
          {editor.saving ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={editor.discard} disabled={editor.saving}>
          Discard changes
        </Button>
      </div>
      {editor.saveError && <p className="mt-3 text-sm text-accent-2">{editor.saveError}</p>}
      <SaveIssuesList issues={editor.saveIssues} />
      <div className="mt-3">
        <SaveStatusIndicator {...editor.deployStatus} />
      </div>
    </form>
  );
}
