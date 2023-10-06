import { useQuery } from "@tanstack/react-query";
import { api } from "~/utils/api";

export function useSession() {
  const { data: sessionData, isInitialLoading } = useQuery({
    queryKey: ["session"],
    queryFn: api.session,
    retry: 0,
  });

  // TODO: add error handling

  const user = sessionData?.data?.user ?? undefined;

  const session = user ? { user } : undefined;

  return { session, isInitialLoading };
}
