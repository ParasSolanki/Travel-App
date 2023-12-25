import { FileRoute, Link, Navigate } from "@tanstack/react-router";
import { useSession } from "~/hooks/use-session";

export const Route = new FileRoute('/unauthorized').createRoute({
  component: () => {
    const { session } = useSession();

    if (!session) return <Navigate to="/signin" />;

    return (
      <main className="flex h-screen items-center justify-center">
        <div className="mx-auto max-w-2xl space-y-3 px-4 text-center">
          <h4 className="font-cal-sans text-6xl font-semibold text-foreground">
            Unauthorized
          </h4>
          <p className="text-2xl text-muted-foreground">
            You are not authorized to view that page.
          </p>
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Go Home
          </Link>
        </div>
      </main>
    );
  },
});
