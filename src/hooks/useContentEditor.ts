import { useCallback, useEffect, useState } from "react";
import { AdminApiError, getContent, saveContent } from "../lib/adminApi";
import type { ContentKey } from "../types/content";
import { useDeployStatus } from "./useDeployStatus";

interface UseContentEditorResult<T> {
  draft: T | null;
  setDraft: (value: T | null | ((prev: T | null) => T | null)) => void;
  savedData: T | null;
  loading: boolean;
  loadError: string | null;
  saving: boolean;
  saveError: string | null;
  saveIssues: unknown;
  save: (next: T) => Promise<boolean>;
  discard: () => void;
  reload: () => void;
  deployStatus: ReturnType<typeof useDeployStatus>;
}

export function useContentEditor<T>(key: ContentKey): UseContentEditorResult<T> {
  const [loadedData, setLoadedData] = useState<T | null>(null);
  const [prevLoadedData, setPrevLoadedData] = useState<T | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveIssues, setSaveIssues] = useState<unknown>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const deployStatus = useDeployStatus();

  // Reset the editable draft whenever freshly loaded/saved data supersedes it
  // (initial load, manual reload, or a successful save). Done during render,
  // per React's guidance for resetting state from a changed value, instead
  // of in an effect — an effect here would cost an extra render pass for no
  // benefit since nothing external needs synchronizing.
  if (loadedData !== prevLoadedData) {
    setPrevLoadedData(loadedData);
    setDraft(loadedData);
  }

  useEffect(() => {
    let cancelled = false;
    getContent<T>(key)
      .then((res) => {
        if (cancelled) return;
        setLoadedData(res.content);
        setSha(res.sha);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load content");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key, reloadToken]);

  const save = useCallback(
    async (next: T): Promise<boolean> => {
      setSaving(true);
      setSaveError(null);
      setSaveIssues(null);
      deployStatus.markSaving();
      try {
        const result = await saveContent(key, next, sha);
        setLoadedData(next);
        setSha(result.contentSha);
        deployStatus.trackSave(result);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save";
        setSaveError(message);
        if (err instanceof AdminApiError) setSaveIssues(err.issues ?? null);
        deployStatus.markError(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [key, sha, deployStatus],
  );

  const discard = useCallback(() => setDraft(loadedData), [loadedData]);
  const reload = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    setReloadToken((t) => t + 1);
  }, []);

  return {
    draft,
    setDraft,
    savedData: loadedData,
    loading,
    loadError,
    saving,
    saveError,
    saveIssues,
    save,
    discard,
    reload,
    deployStatus,
  };
}
