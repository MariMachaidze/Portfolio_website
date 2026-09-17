import type { FormEvent } from "react";
import type { IconKey, SkillCategory } from "../../../types";
import { useContentEditor } from "../../../hooks/useContentEditor";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { ReorderableList } from "../ReorderableList";
import { Button } from "../../ui/Button";
import { TextField } from "./fields";

const ICON_OPTIONS: IconKey[] = [
  "code",
  "server",
  "palette",
  "database",
  "cloud",
  "wrench",
  "terminal",
  "layout",
];

function emptyCategory(): SkillCategory {
  return { id: crypto.randomUUID(), title: "New category", icon: "code", items: [] };
}

export function SkillsForm() {
  const editor = useContentEditor<SkillCategory[]>("skills");
  const { draft, setDraft } = editor;

  if (editor.loading) return <p className="text-sm text-muted">Loading skills...</p>;
  if (editor.loadError) return <p className="text-sm text-accent-2">{editor.loadError}</p>;
  if (!draft) return null;

  function updateCategory(id: string, patch: Partial<SkillCategory>) {
    setDraft((prev) => prev && prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCategory(id: string) {
    setDraft((prev) => prev && prev.filter((c) => c.id !== id));
  }

  function addCategory() {
    setDraft((prev) => [...(prev ?? []), emptyCategory()]);
  }

  function updateItemName(categoryId: string, index: number, name: string) {
    setDraft(
      (prev) =>
        prev &&
        prev.map((c) =>
          c.id === categoryId ? { ...c, items: c.items.map((it, i) => (i === index ? { name } : it)) } : c,
        ),
    );
  }

  function addItem(categoryId: string) {
    setDraft(
      (prev) => prev && prev.map((c) => (c.id === categoryId ? { ...c, items: [...c.items, { name: "" }] } : c)),
    );
  }

  function removeItem(categoryId: string, index: number) {
    setDraft(
      (prev) =>
        prev &&
        prev.map((c) => (c.id === categoryId ? { ...c, items: c.items.filter((_, i) => i !== index) } : c)),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (draft) await editor.save(draft);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <ReorderableList
        items={draft}
        getId={(c) => c.id}
        onReorder={setDraft}
        renderItem={(category) => (
          <div className="mb-4 rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-end gap-3">
              <TextField
                label="Category title"
                htmlFor={`cat-title-${category.id}`}
                value={category.title}
                onChange={(e) => updateCategory(category.id, { title: e.target.value })}
                wrapperClassName="flex-1"
              />
              <div className="mb-4">
                <label htmlFor={`cat-icon-${category.id}`} className="mb-1.5 block text-sm font-medium text-text">
                  Icon
                </label>
                <select
                  id={`cat-icon-${category.id}`}
                  value={category.icon}
                  onChange={(e) => updateCategory(category.id, { icon: e.target.value as IconKey })}
                  className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text outline-none focus:border-primary"
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="button" variant="ghost" onClick={() => removeCategory(category.id)}>
                Remove
              </Button>
            </div>

            <div className="space-y-2">
              {category.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={item.name}
                    onChange={(e) => updateItemName(category.id, i, e.target.value)}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    placeholder="Skill name"
                  />
                  <Button type="button" variant="ghost" onClick={() => removeItem(category.id, i)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={() => addItem(category.id)} className="mt-1">
                + Add skill
              </Button>
            </div>
          </div>
        )}
      />

      <Button type="button" variant="secondary" onClick={addCategory} className="mb-6">
        + Add category
      </Button>

      <div className="flex items-center gap-3">
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
