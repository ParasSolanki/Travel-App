import { Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAbilityContext } from "~/hooks/use-ability-context";
import { useSession } from "~/hooks/use-session";
import { getUrlBasedOnUserRole } from "~/utils/get-url-based-on-user-role";

export default function AuthIndexModule() {
  const { session, isInitialLoading } = useSession();
  const ability = useAbilityContext((s) => s.ability);

  if (isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-foreground" />
      </div>
    );
  }

  if (!session || ability.cannot("manage", "auth")) {
    return <Navigate to="/signin" />;
  }

  const to = getUrlBasedOnUserRole(session.user.role.name);

  return <Navigate to={to} />;
}
