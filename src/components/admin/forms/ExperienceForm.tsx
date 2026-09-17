import type { FormEvent } from "react";
import type { ExperienceEntry } from "../../../types";
import { useContentEditor } from "../../../hooks/useContentEditor";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { ReorderableList } from "../ReorderableList";
import { Button } from "../../ui/Button";
import { TextField, TextAreaField } from "./fields";

function emptyEntry(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    role: "New role",
    company: "Company",
    startDate: "",
    endDate: "Present",
    location: "",
    summary: "",
    bullets: [],
    tech: [],
  };
}

export function ExperienceForm() {
  const editor = useContentEditor<ExperienceEntry[]>("experience");
  const { draft, setDraft } = editor;

  if (editor.loading) return <p className="text-sm text-muted">Loading experience...</p>;
  if (editor.loadError) return <p className="text-sm text-accent-2">{editor.loadError}</p>;
  if (!draft) return null;

  function update(id: string, patch: Partial<ExperienceEntry>) {
    setDraft((prev) => prev && prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function removeEntry(id: string) {
    setDraft((prev) => prev && prev.filter((e) => e.id !== id));
  }

  function addEntry() {
    setDraft((prev) => [emptyEntry(), ...(prev ?? [])]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (draft) await editor.save(draft);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Button type="button" variant="secondary" onClick={addEntry} className="mb-4">
        + Add role
      </Button>

      <ReorderableList
        items={draft}
        getId={(entry) => entry.id}
        onReorder={setDraft}
        renderItem={(entry) => (
          <div className="mb-4 rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex justify-end">
              <Button type="button" variant="ghost" onClick={() => removeEntry(entry.id)}>
                Remove
              </Button>
            </div>
            <TextField
              label="Role"
              htmlFor={`exp-role-${entry.id}`}
              value={entry.role}
              onChange={(e) => update(entry.id, { role: e.target.value })}
            />
            <TextField
              label="Company"
              htmlFor={`exp-company-${entry.id}`}
              value={entry.company}
              onChange={(e) => update(entry.id, { company: e.target.value })}
            />
            <TextField
              label="Company URL"
              htmlFor={`exp-companyUrl-${entry.id}`}
              value={entry.companyUrl ?? ""}
              onChange={(e) => update(entry.id, { companyUrl: e.target.value || undefined })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Start date"
                htmlFor={`exp-start-${entry.id}`}
                hint="YYYY-MM"
                value={entry.startDate}
                onChange={(e) => update(entry.id, { startDate: e.target.value })}
              />
              <TextField
                label="End date"
                htmlFor={`exp-end-${entry.id}`}
                hint='YYYY-MM or "Present"'
                value={entry.endDate}
                onChange={(e) => update(entry.id, { endDate: e.target.value })}
              />
            </div>
            <TextField
              label="Location"
              htmlFor={`exp-location-${entry.id}`}
              value={entry.location}
              onChange={(e) => update(entry.id, { location: e.target.value })}
            />
            <div className="mb-4">
              <label htmlFor={`exp-locationType-${entry.id}`} className="mb-1.5 block text-sm font-medium text-text">
                Location type
              </label>
              <select
                id={`exp-locationType-${entry.id}`}
                value={entry.locationType ?? ""}
                onChange={(e) =>
                  update(entry.id, {
                    locationType: (e.target.value || undefined) as ExperienceEntry["locationType"],
                  })
                }
                className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary"
              >
                <option value="">—</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <TextAreaField
              label="Summary"
              htmlFor={`exp-summary-${entry.id}`}
              rows={2}
              value={entry.summary}
              onChange={(e) => update(entry.id, { summary: e.target.value })}
            />
            <TextAreaField
              label="Bullets"
              htmlFor={`exp-bullets-${entry.id}`}
              hint="one per line"
              rows={4}
              value={entry.bullets.join("\n")}
              onChange={(e) =>
                update(entry.id, {
                  bullets: e.target.value
                    .split("\n")
                    .map((b) => b.trim())
                    .filter(Boolean),
                })
              }
            />
            <TextField
              label="Tech"
              htmlFor={`exp-tech-${entry.id}`}
              hint="comma separated"
              value={entry.tech.join(", ")}
              onChange={(e) =>
                update(entry.id, {
                  tech: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
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
      <div className="mt-3">
        <SaveStatusIndicator {...editor.deployStatus} />
      </div>
    </form>
  );
}
