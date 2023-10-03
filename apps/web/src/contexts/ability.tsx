import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createStore } from "zustand";
import { PureAbility } from "@casl/ability";
import { useSession } from "~/hooks/use-session";
import { getAbilitiesOfUserByRole } from "~/lib/casl/utils";
import type { Actions, Subjects } from "~/lib/casl/types";
import { User } from "~/types";

export interface AbilityContextProps {
  ability: PureAbility<[Actions, Subjects], unknown>;
  updateAbility: (user: User) => void;
  resetAbility: () => void;
}

type AbilityStore = ReturnType<typeof createAbilityStore>;

const createAbilityStore = (
  initProps: Pick<AbilityContextProps, "ability">,
) => {
  return createStore<AbilityContextProps>()((set) => ({
    ability: initProps.ability,
    updateAbility: (user) =>
      set((state) => {
        const role = user?.role.name ?? undefined;
        const newAbilities = getAbilitiesOfUserByRole(role);
        state.ability.update(newAbilities);
        return state;
      }),
    resetAbility: () =>
      set((state) => {
        const newAbilities = getAbilitiesOfUserByRole(undefined);
        state.ability.update(newAbilities);
        return state;
      }),
  }));
};

export const AbilityContext = createContext<AbilityStore | undefined>(
  undefined,
);

export function AbilityContextProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const storeRef = useRef<AbilityStore>();
  const getUserAbilities = useCallback((user?: User) => {
    const role = user?.role.name ?? undefined;
    const abilities = getAbilitiesOfUserByRole(role);
    return new PureAbility<[Actions, Subjects]>(abilities);
  }, []);

  if (!storeRef.current) {
    storeRef.current = createAbilityStore({
      ability: getUserAbilities(session?.user),
    });
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.setState({ ability: getUserAbilities(session?.user) });
    }
  }, [session, getUserAbilities]);

  return (
    <AbilityContext.Provider value={storeRef.current}>
      {children}
    </AbilityContext.Provider>
  );
}
