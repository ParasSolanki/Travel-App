import { type AbilityRule } from "./types";

const AUTH_RULE = { action: "manage", subject: "auth" } satisfies AbilityRule;

export const GUESTS_ABILITIES = [
  { action: "manage", subject: "guest" },
] satisfies AbilityRule[];

export const USER_ABILITIES = [
  { ...AUTH_RULE },
  { action: "manage", subject: "bookings" },
] satisfies AbilityRule[];

export const ADMIN_ABILITIES = [
  { ...AUTH_RULE },
  { action: "manage", subject: "users" },
  { action: "manage", subject: "destinations" },
  { action: "manage", subject: "bookings" },
  { action: "manage", subject: "agents" },
  { action: "manage", subject: "pickup-points" },
  { action: "manage", subject: "hotels" },
  { action: "create", subject: "hotels" },
  { action: "update", subject: "hotels" },
] satisfies AbilityRule[];
