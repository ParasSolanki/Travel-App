import type { RoutesPath } from "~/types";

type Paths = Extract<RoutesPath, "/users" | "/signin" | "/bookings">;

export function getUrlBasedOnUserRole(role?: string): Paths {
  if (!role) return "/signin";

  return role === "ADMIN" ? "/users" : "/bookings";
}
