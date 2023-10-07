import { Link } from "@tanstack/react-router";
import { LockIcon, LogOut, User2Icon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { useSession } from "~/hooks/use-session";
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
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

export function UserMenu() {
  const { session } = useSession();
  const userInitials = useMemo(() => {
    if (!session) return undefined;
    if (!session.user.name) return undefined;

    const splited = session.user.name.split(" ");

    return `${splited[0] ? splited[0].charAt(0).toUpperCase() : ""}${
      splited[1] ? splited[1].charAt(0).toUpperCase() : ""
    }`;
  }, [session]);

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["signout"],
    mutationFn: () => api.signout(),
    onSuccess() {
      // manually reload the page it will reset all auth states
      window.location.href = "/signin";
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
          disabled={isLoading}
          onClick={async () => await mutateAsync()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
