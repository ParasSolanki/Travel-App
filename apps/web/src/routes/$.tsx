import { FileRoute, Link } from "@tanstack/react-router";

export const Route = new FileRoute('/$').createRoute({
  component: () => (
    <main className="flex h-screen items-center justify-center">
      <div className="mx-auto max-w-2xl space-y-3 px-4 text-center">
        <h4 className="font-cal-sans text-9xl font-semibold text-foreground">
          404
        </h4>
        <p className="text-2xl text-muted-foreground">
          Oops! the page you are looking for does not exists.
        </p>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Go Home
        </Link>
      </div>
    </main>
  ),
});
