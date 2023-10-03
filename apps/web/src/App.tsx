import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, Router } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import nprogress from "nprogress";
import { routeTree } from "./routeTree.gen.ts";
import { queryClient } from "~/lib/tanstack-query/query-client.ts";
import { AbilityContextProvider } from "~/contexts/ability.tsx";
import { useTheme } from "~/hooks/use-theme.ts";

const router = new Router({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
  onRouteChange: () => {
    nprogress.start();
    nprogress.done();
  },
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
