import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router, RouterProvider } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
// import nprogress from "nprogress";
import { QueryClient } from "@tanstack/react-query";
import { AbilityContextProvider } from "~/contexts/ability.tsx";
import { useTheme } from "~/hooks/use-theme.ts";
import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient();

const router = new Router({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Loader2 className="h-10 w-10 animate-spin text-foreground" />
    </div>
  ),
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AbilityContextProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          containerClassName="font-inter"
          toastOptions={{
            className:
              "bg-background text-foreground dark:border dark:border-forground dark:shadow-forground",
          }}
        />
      </AbilityContextProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default App;
