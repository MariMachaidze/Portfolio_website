import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { useAuth } from "../../hooks/useAuth";

export function AdminLoginPage() {
  const { login, authenticated, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && authenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(password, totpCode);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Invalid credentials.");
      setTotpCode("");
    }
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8"
      >
        <h1 className="mb-6 text-xl font-semibold text-text">Admin Login</h1>

        <div className="mb-4">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-primary"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="totp" className="mb-1.5 block text-sm font-medium text-text">
            Authenticator code
          </label>
          <input
            id="totp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
            autoComplete="one-time-code"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tracking-widest text-text outline-none transition-colors duration-200 focus:border-primary"
          />
        </div>

        {error && <p className="mb-4 text-sm text-accent-2">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full justify-center">
          {submitting ? "Checking..." : "Log in"}
        </Button>
      </form>
    </Container>
  );
}
