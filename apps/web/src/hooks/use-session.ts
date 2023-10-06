import { useQuery } from "@tanstack/react-query";
import { api } from "~/utils/api";
import { User } from "~/types";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";
type Session = undefined | null | { user: User };

export function useSession() {
  const { data: sessionData, isInitialLoading } = useQuery({
    queryKey: ["session"],
    queryFn: api.session,
    retry: 0,
  });

  const session: Session = isInitialLoading
    ? undefined
    : sessionData?.ok && sessionData.data?.user
    ? { user: sessionData.data.user }
    : null;

  const status: SessionStatus = isInitialLoading
    ? "loading"
    : session
    ? "authenticated"
    : "unauthenticated";

  return { session, status };
}
