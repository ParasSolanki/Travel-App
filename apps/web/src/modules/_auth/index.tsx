import { Navigate } from "@tanstack/react-router";
import { useAbilityContext } from "~/hooks/use-ability-context";
import { useSession } from "~/hooks/use-session";
import { getUrlBasedOnUserRole } from "~/utils/get-url-based-on-user-role";

export default function AuthIndexModule() {
  const { session } = useSession();
  const ability = useAbilityContext((s) => s.ability);

  if (!session || ability.cannot("manage", "auth")) {
    return <Navigate to="/signin" />;
  }

  const to = getUrlBasedOnUserRole(session.user.role.name);

  return <Navigate to={to} />;
}
