import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./auth-context-value";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/.netlify/functions/auth-check", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (password: string, totpCode: string) => {
    const res = await fetch("/.netlify/functions/auth-login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, totpCode }),
    });
    setAuthenticated(res.ok);
    if (res.ok) return { ok: true };

    const data = await res.json().catch(() => null);
    return { ok: false, error: data?.error as string | undefined };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/.netlify/functions/auth-logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
