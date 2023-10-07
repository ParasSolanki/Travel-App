import { useLayoutEffect, useEffect } from "react";
import { Navigate, Outlet } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery, useToggle } from "usehooks-ts";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";
import { cn } from "~/lib/utils";
import { useSession } from "~/hooks/use-session";
import { Loader2 } from "lucide-react";
import { useAbilityContext } from "~/hooks/use-ability-context";

export default function AuthLayoutModule() {
  const { status } = useSession();
  const ability = useAbilityContext((a) => a.ability);
  const [isSidebarOpen, toggleSidebar, setSidebarOpen] = useToggle(false);
  const matches = useMediaQuery("(min-width: 768px)"); // tailwind md breakpoint

  useLayoutEffect(() => {
    if (matches) setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [matches, setSidebarOpen]);

  useEffect(() => {
    // on md breakpoint screens
    if (!matches) {
      if (isSidebarOpen) document.body.classList.add("overflow-hidden");
      else document.body.classList.remove("overflow-hidden");
    }
  }, [matches, isSidebarOpen]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-foreground" />
      </div>
    );
  }
  if (status === "unauthenticated" || ability.cannot("manage", "auth")) {
    return <Navigate to="/signin" />;
  }

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <Sidebar />
            {/* only on small screen */}
            {!matches && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="presentation"
                className="fixed inset-0 z-10 bg-black/50"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </>
        )}
      </AnimatePresence>

      <div
        className={cn("mt-16 h-full bg-background px-5 py-8", {
          "md:ml-64": isSidebarOpen,
        })}
      >
        <Outlet />
      </div>
    </>
  );
}
