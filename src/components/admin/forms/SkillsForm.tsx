import { useState, type FormEvent } from "react";
import type { SkillCategory, SkillItem, SkillsContent } from "../../../types";
import { useContentEditor } from "../../../hooks/useContentEditor";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { ReorderableList } from "../ReorderableList";
import { Button } from "../../ui/Button";
import { TextField, TextAreaField } from "./fields";
import { SaveIssuesList } from "../SaveIssuesList";

const DEFAULT_COMMIT_MESSAGE = "Update skills";

function emptyCategory(): SkillCategory {
  return { id: crypto.randomUUID(), title: "New category", color: "#345e83", light: "#8aafc8", items: [] };
}

function emptyItem(): SkillItem {
  return { id: crypto.randomUUID(), name: "", usage: "" };
}

export function SkillsForm() {
  const editor = useContentEditor<SkillsContent>("skills");
  const { draft, setDraft } = editor;
  const [commitMessage, setCommitMessage] = useState(DEFAULT_COMMIT_MESSAGE);

  if (editor.loading) return <p className="text-sm text-muted">Loading skills...</p>;
  if (editor.loadError) return <p className="text-sm text-accent-2">{editor.loadError}</p>;
  if (!draft) return null;

  function setCategories(categories: SkillCategory[]) {
    setDraft((prev) => prev && { ...prev, categories });
  }

  function updateCategory(id: string, patch: Partial<SkillCategory>) {
    setCategories(draft!.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCategory(id: string) {
    setCategories(draft!.categories.filter((c) => c.id !== id));
  }

  function addCategory() {
    setCategories([...draft!.categories, emptyCategory()]);
  }

  function setItems(categoryId: string, items: SkillItem[]) {
    updateCategory(categoryId, { items });
  }

  function updateItem(categoryId: string, itemId: string, patch: Partial<SkillItem>) {
    const category = draft!.categories.find((c) => c.id === categoryId);
    if (!category) return;
    setItems(
      categoryId,
      category.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
  }

  function addItem(categoryId: string) {
    const category = draft!.categories.find((c) => c.id === categoryId);
    if (!category) return;
    setItems(categoryId, [...category.items, emptyItem()]);
  }

  function removeItem(categoryId: string, itemId: string) {
    const category = draft!.categories.find((c) => c.id === categoryId);
    if (!category) return;
    setItems(
      categoryId,
      category.items.filter((item) => item.id !== itemId),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const ok = await editor.save(draft, commitMessage);
    if (ok) setCommitMessage(DEFAULT_COMMIT_MESSAGE);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <p className="mb-4 text-xs text-muted">
        Skills render as a pinout chip: pin numbers are just each skill&apos;s position here, grouped by category
        &mdash; reordering a category or a skill within it renumbers everything after it. That&apos;s expected.
      </p>

      <ReorderableList
        items={draft.categories}
        getId={(c) => c.id}
        onReorder={setCategories}
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
                <label htmlFor={`cat-color-${category.id}`} className="mb-1.5 block text-sm font-medium text-text">
                  Color
                </label>
                <input
                  id={`cat-color-${category.id}`}
                  type="color"
                  value={category.color}
                  onChange={(e) => updateCategory(category.id, { color: e.target.value })}
                  className="h-[42px] w-14 rounded-lg border border-border bg-bg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`cat-light-${category.id}`} className="mb-1.5 block text-sm font-medium text-text">
                  Light accent
                </label>
                <input
                  id={`cat-light-${category.id}`}
                  type="color"
                  value={category.light}
                  onChange={(e) => updateCategory(category.id, { light: e.target.value })}
                  className="h-[42px] w-14 rounded-lg border border-border bg-bg"
                />
              </div>
              <Button type="button" variant="ghost" onClick={() => removeCategory(category.id)}>
                Remove
              </Button>
            </div>

            <ReorderableList
              items={category.items}
              getId={(item) => item.id}
              onReorder={(items) => setItems(category.id, items)}
              className="mb-3 space-y-3"
              renderItem={(item) => (
                <div className="rounded-lg border border-border bg-bg p-3">
                  <TextField
                    label="Skill name"
                    htmlFor={`skill-name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateItem(category.id, item.id, { name: e.target.value })}
                  />
                  <TextAreaField
                    label="Where I used it"
                    htmlFor={`skill-usage-${item.id}`}
                    rows={2}
                    value={item.usage}
                    onChange={(e) => updateItem(category.id, item.id, { usage: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(category.id, item.id)}
                    className="text-xs text-muted underline hover:text-accent-2"
                  >
                    Remove skill
                  </button>
                </div>
              )}
            />
            <Button type="button" variant="secondary" onClick={() => addItem(category.id)}>
              + Add skill
            </Button>
          </div>
        )}
      />

      <Button type="button" variant="secondary" onClick={addCategory} className="mb-6">
        + Add category
      </Button>

      <TextAreaField
        label="Additional tools"
        htmlFor="skills-additional-tools"
        hint="freeform line shown below the chip, e.g. for things not worth their own pin"
        rows={2}
        value={draft.additionalTools}
        onChange={(e) => setDraft((prev) => prev && { ...prev, additionalTools: e.target.value })}
      />

      <TextField
        label="Commit message"
        htmlFor="skills-commit-message"
        hint="shown as the commit title on GitHub"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
      />

      <div className="flex items-center gap-3">
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
