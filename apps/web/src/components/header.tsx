import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

export function Header({
  isSidebarOpen,
  toggleSidebar,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <header>
      <nav className="fixed top-0 z-50 w-full border-b border-muted-foreground/50 bg-background">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSidebar}
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                className="text-foreground"
              >
                <span className="sr-only">
                  {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                </span>

                <MenuIcon className="h-5 w-5" />
              </Button>

              <Link to="/" className="ml-2 flex md:mr-24">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">
                  Logo
                </span>
              </Link>
            </div>
            <div className="grow-1 flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
