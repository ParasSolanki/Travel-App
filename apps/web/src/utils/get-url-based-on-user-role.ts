import { type RegisteredRoutesInfo } from "@tanstack/react-router";

type Paths = Extract<
  RegisteredRoutesInfo["routePaths"],
  "/users" | "/bookings" | "/signin"
>;

export function getUrlBasedOnUserRole(role?: string): Paths {
  if (!role) return "/signin";

  return role === "ADMIN" ? "/users" : "/bookings";
}
