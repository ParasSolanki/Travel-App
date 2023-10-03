import { Navigate, RegisteredRoutesInfo } from "@tanstack/react-router";
import { useAbilityContext } from "~/hooks/use-ability-context";
import { Actions, Subjects } from "~/lib/casl/types";

type CanProps = React.PropsWithChildren<{
  action: Actions;
  subject: Subjects;
  redirectTo?: RegisteredRoutesInfo["routePaths"];
}>;

export function Can({ action, subject, children, redirectTo }: CanProps) {
  const ability = useAbilityContext((s) => s.ability);
  const can = ability.can(action, subject);

  if (!can && redirectTo) return <Navigate to={redirectTo} />;
  if (!can) return null;

  return children;
}
