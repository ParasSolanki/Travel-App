import { useMemo } from "react";
import {
  Link,
  type RouteIds,
  type RegisteredRouter,
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  type LucideIcon,
  UsersIcon,
  MapPinIcon,
  BookIcon,
  HotelIcon,
  MapIcon,
  Users2Icon,
} from "lucide-react";
import { useAbilityContext } from "~/hooks/use-ability-context";
import { ScrollArea } from "./ui/scroll-area";
import type { Actions, Subjects } from "~/lib/casl/types";

type SidebarLink = {
  name: string;
  href: RouteIds<RegisteredRouter["routeTree"]>;
  icon: LucideIcon;
  action: Actions;
  subject: Subjects;
};

const links = [
  {
    name: "Manage Users",
    href: "/users",
    icon: UsersIcon,
    action: "manage",
    subject: "users",
  },
  {
    name: "Destinations",
    href: "/destinations",
    icon: MapPinIcon,
    action: "manage",
    subject: "destinations",
  },
  {
    name: "Hotels",
    href: "/hotels",
    icon: HotelIcon,
    action: "manage",
    subject: "hotels",
  },
  {
    name: "Pickup Points",
    href: "/pickup-points",
    icon: MapIcon,
    action: "manage",
    subject: "pickup-points",
  },
  {
    name: "Bookings",
    href: "/bookings",
    icon: BookIcon,
    action: "manage",
    subject: "bookings",
  },
  {
    name: "Agents",
    href: "/agents",
    icon: Users2Icon,
    action: "manage",
    subject: "agents",
  },
] satisfies SidebarLink[];

export function Sidebar() {
  const ability = useAbilityContext((s) => s.ability);
  const accessedLinks = useMemo(() => {
    return links.filter((l) => ability.can(l.action, l.subject));
  }, [ability]);

  return (
    <motion.aside
      initial={false}
      style={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.3, delay: 0.1 }}
      className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-muted-foreground/50 bg-background pt-20"
      aria-label="Sidebar"
    >
      <ScrollArea className="h-full overflow-y-auto px-3 pb-4">
        <ul className="space-y-2 font-medium">
          {accessedLinks.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className="group flex items-center rounded-lg p-2 text-foreground hover:bg-primary hover:text-white"
                title={l.name}
                activeProps={{ className: "bg-primary text-white" }}
              >
                <l.icon className="h-5 w-5" />
                <span className="ml-3">{l.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </motion.aside>
  );
}
