import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-2 text-4xl font-semibold text-text">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button as="a" href="/" className="mt-6">
        Back to home
      </Button>
    </Container>
  );
}
