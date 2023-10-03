import { useMemo } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme, Theme } from "~/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

function ThemeIcon({ theme }: { theme: (typeof Theme)[keyof typeof Theme] }) {
  if (theme === "Light") return <SunIcon className="h-4 w-4" />;
  if (theme === "Dark") return <MoonIcon className="h-4 w-4" />;
  return <MonitorIcon className="h-4 w-4" />;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const themes = useMemo(() => Object.values(Theme), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="text-foreground">
          <ThemeIcon theme={theme} />
          <span className="sr-only">Current {theme} theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((t) => (
          <DropdownMenuCheckboxItem
            key={t}
            checked={t === theme}
            onCheckedChange={() => setTheme(t)}
          >
            {t}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
