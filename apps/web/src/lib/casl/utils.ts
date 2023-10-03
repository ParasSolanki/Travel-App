import { ADMIN_ABILITIES, GUESTS_ABILITIES, USER_ABILITIES } from "./config";

export function getAbilitiesOfUserByRole(role?: string) {
  if (role === "ADMIN") return ADMIN_ABILITIES;
  else if (role === "USER") return USER_ABILITIES;
  return GUESTS_ABILITIES;
}
