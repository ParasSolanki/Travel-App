import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/utils/api";

export function useSession() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: sessionData, isInitialLoading } = useQuery({
    queryKey: ["session"],
    queryFn: api.session,
    retry: 0,
  });

  useEffect(() => {
    if (isInitialLoading) setIsLoading(false);
  }, [isInitialLoading]);

  const user = sessionData?.data?.user ?? undefined;

  const session = user ? { user } : undefined;

  return { session, isLoading };
}
