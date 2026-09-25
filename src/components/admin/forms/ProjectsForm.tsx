import type { FormEvent } from "react";
import type { Project, ProjectStatus } from "../../../types";
import { useContentEditor } from "../../../hooks/useContentEditor";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { ReorderableList } from "../ReorderableList";
import { Button } from "../../ui/Button";
import { TextField } from "./fields";
import { ShowcaseGridEditor } from "../ShowcaseGridEditor";
import { SaveIssuesList } from "../SaveIssuesList";

const STATUS_OPTIONS: ProjectStatus[] = ["in-progress", "finished", "paused"];
const EMPTY_SHOWCASE = { widgets: [], stickers: [] };

function emptyProject(): Project {
  const seed = `new-project-${Date.now()}`;
  return {
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
    setDraft((prev) => [emptyProject(), ...(prev ?? [])]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    await editor.save(draft);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
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
            <TextField
              label="Summary"
              htmlFor={`proj-summary-${project.slug}`}
              value={project.summary}
              onChange={(e) => update(project.slug, { summary: e.target.value })}
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

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Start date"
                htmlFor={`proj-start-${project.slug}`}
                hint="YYYY-MM"
                value={project.startDate}
                onChange={(e) => update(project.slug, { startDate: e.target.value })}
              />
              <TextField
                label="End date"
                htmlFor={`proj-end-${project.slug}`}
                hint='YYYY-MM or "Present"'
                value={project.endDate}
                onChange={(e) => update(project.slug, { endDate: e.target.value })}
              />
            </div>

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
            <TextField
              label="Code URL"
              htmlFor={`proj-codeUrl-${project.slug}`}
              value={project.links.codeUrl ?? ""}
              onChange={(e) => update(project.slug, { links: { codeUrl: e.target.value || undefined } })}
            />

            <h4 className="mb-2 mt-4 text-sm font-semibold text-text">
              Showcase grid <span className="font-normal text-muted">(shown on this project's own page)</span>
            </h4>
            <ShowcaseGridEditor
              showcase={project.showcase ?? EMPTY_SHOWCASE}
              onChange={(showcase) => update(project.slug, { showcase })}
            />
          </div>
        )}
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
