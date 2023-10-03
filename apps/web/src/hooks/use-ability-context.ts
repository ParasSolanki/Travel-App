import { useContext } from "react";
import { useStore } from "zustand";
import { AbilityContextProps, AbilityContext } from "~/contexts/ability";

export function useAbilityContext<T>(
  selector: (state: AbilityContextProps) => T,
): T {
  const store = useContext(AbilityContext);

  if (store === undefined) {
    throw new Error(
      "useAbilityContext must be used within a AbilityContextProvider",
    );
  }

  return useStore(store, selector);
}
