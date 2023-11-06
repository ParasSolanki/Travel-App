import { useQuery } from "@tanstack/react-query";
import { User } from "~/types";
import { sessionQueires } from "~/common/queries";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";
type Session = undefined | null | { user: User };

export function useSession() {
  const { data: sessionData, isPending } = useQuery(sessionQueires.get());

  const session: Session = isPending
    ? undefined
    : sessionData?.ok && sessionData.data?.user
    ? { user: sessionData.data.user }
    : null;

  const status: SessionStatus = isPending
    ? "loading"
    : session
    ? "authenticated"
    : "unauthenticated";

  return { session, status };
}
