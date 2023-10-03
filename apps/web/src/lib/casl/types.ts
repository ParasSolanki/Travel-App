import { RawRule } from "@casl/ability";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects =
  | "guest"
  | "auth"
  | "users"
  | "destinations"
  | "bookings"
  | "pickup-points"
  | "agents"
  | "hotels";

export type AbilityRule = RawRule<[Actions, Subjects]>;
