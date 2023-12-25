import type { RegisteredRouter, RouteIds } from "@tanstack/react-router";

type Paths = Extract<
  RouteIds<RegisteredRouter["routeTree"]>,
  "/users" | "/signin" | "/bookings"
>;

export function getUrlBasedOnUserRole(role?: string): Paths {
  if (!role) return "/signin";

  return role === "ADMIN" ? "/users" : "/bookings";
}
