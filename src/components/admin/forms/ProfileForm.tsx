import type { FormEvent } from "react";
import type { Profile } from "../../../types";
import { useContentEditor } from "../../../hooks/useContentEditor";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { ImagePickerField } from "../ImagePickerField";
import { SaveIssuesList } from "../SaveIssuesList";
import { Button } from "../../ui/Button";
import { TextField, TextAreaField } from "./fields";

export function ProfileForm() {
  const editor = useContentEditor<Profile>("profile");
  const { draft, setDraft } = editor;

  if (editor.loading) return <p className="text-sm text-muted">Loading profile...</p>;
  if (editor.loadError) return <p className="text-sm text-accent-2">{editor.loadError}</p>;
  if (!draft) return null;

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateSocial<K extends keyof Profile["social"]>(key: K, value: string) {
    setDraft((prev) => (prev ? { ...prev, social: { ...prev.social, [key]: value } } : prev));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (draft) await editor.save(draft);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <ImagePickerField
        label="Photo"
        hint="shown on the homepage — leave empty to keep the generated placeholder"
        value={draft.avatarUrl ?? ""}
        onChange={(url) => update("avatarUrl", url)}
      />
      <TextField
        label="Name"
        htmlFor="profile-name"
        value={draft.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <TextField
        label="Role"
        htmlFor="profile-role"
        value={draft.role}
        onChange={(e) => update("role", e.target.value)}
      />
      <TextField
        label="Years of experience"
        htmlFor="profile-years"
        type="number"
        value={draft.yearsExperience ?? ""}
        onChange={(e) => update("yearsExperience", e.target.value === "" ? undefined : Number(e.target.value))}
      />
      <label className="-mt-3 mb-4 flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={Boolean(draft.showYearsExperience)}
          onChange={(e) => update("showYearsExperience", e.target.checked)}
        />
        Show on site
      </label>
      <TextField
        label="Badge"
        htmlFor="profile-badge"
        value={draft.badge ?? ""}
        onChange={(e) => update("badge", e.target.value || undefined)}
      />
      <label className="-mt-3 mb-4 flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={Boolean(draft.showBadge)}
          onChange={(e) => update("showBadge", e.target.checked)}
        />
        Show on site
      </label>
      <TextAreaField
        label="Blurb"
        htmlFor="profile-blurb"
        rows={4}
        value={draft.blurb}
        onChange={(e) => update("blurb", e.target.value)}
      />
      <TextField
        label="Location"
        htmlFor="profile-location"
        value={draft.location}
        onChange={(e) => update("location", e.target.value)}
      />
      <TextField
        label="Phone"
        htmlFor="profile-phone"
        value={draft.phone}
        onChange={(e) => update("phone", e.target.value)}
      />
      <TextField
        label="Email"
        htmlFor="profile-email"
        type="email"
        value={draft.email}
        onChange={(e) => update("email", e.target.value)}
      />
      <TextField
        label="Avatar alt text"
        htmlFor="profile-avatarAlt"
        value={draft.avatarAlt}
        onChange={(e) => update("avatarAlt", e.target.value)}
      />

      <h3 className="mb-2 mt-6 text-sm font-semibold text-text">Social links</h3>
      <TextField
        label="GitHub"
        htmlFor="social-github"
        value={draft.social.github}
        onChange={(e) => updateSocial("github", e.target.value)}
      />
      <TextField
        label="LinkedIn"
        htmlFor="social-linkedin"
        value={draft.social.linkedin}
        onChange={(e) => updateSocial("linkedin", e.target.value)}
      />
      <TextField
        label="X (Twitter) URL"
        htmlFor="social-twitter"
        value={draft.social.twitter}
        onChange={(e) => updateSocial("twitter", e.target.value)}
      />
      <TextField
        label="X handle"
        htmlFor="social-twitterHandle"
        hint="no @"
        value={draft.social.twitterHandle}
        onChange={(e) => updateSocial("twitterHandle", e.target.value)}
      />
      <TextField
        label="Social email"
        htmlFor="social-email"
        type="email"
        value={draft.social.email}
        onChange={(e) => updateSocial("email", e.target.value)}
      />

      <div className="mt-6 flex items-center gap-3">
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
