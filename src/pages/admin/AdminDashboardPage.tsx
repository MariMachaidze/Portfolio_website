import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { useAuth } from "../../hooks/useAuth";

export function AdminDashboardPage() {
  const { logout } = useAuth();

  return (
    <Container className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Admin Dashboard</h1>
        <Button variant="secondary" onClick={() => logout()}>
          Log out
        </Button>
      </div>
      <p className="text-muted">
        You&apos;re logged in. Content editing tools will appear here in later phases.
      </p>
    </Container>
  );
}
