import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LockIcon, LogOut, User2Icon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAbilityContext } from "~/hooks/use-ability-context";
import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { flushSync } from "react-dom";

export function UserMenu() {
  const navigate = useNavigate();
  const { session } = useSession();
  const resetAbility = useAbilityContext((s) => s.resetAbility);

  const userInitials = useMemo(() => {
    if (!session?.user.name) return undefined;

    const splited = session.user.name.split(" ");

    return `${splited[0] ? splited[0].charAt(0).toUpperCase() : ""}${
      splited[1] ? splited[1].charAt(0).toUpperCase() : ""
    }`;
  }, [session]);

  const { mutateAsync: signoutMutateAsync } = useMutation({
    mutationKey: ["signout"],
    mutationFn: () => api.signout(),
    onSuccess() {
      toast.success("Log out successfully");
      flushSync(() => {
        resetAbility();
      });
      navigate({
        to: "/signin",
      });
    },
    onError() {
      toast.error("Something went wrong while logging out");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-foreground">
              {userInitials ?? <User2Icon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/change-password">
              <LockIcon className="mr-2 h-4 w-4" />
              Change Password
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500"
          onClick={async () => await signoutMutateAsync()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
