import { useSignin } from "~/hooks/use-signin";
import { GoogleIcon } from "./icons/google-icon";
import { Button } from "./ui/button";

export function SocialAuth() {
  const { mutateAsync, isLoading } = useSignin();

  return (
    <>
      <ul>
        <li>
          <Button
            type="button"
            className="w-full border border-muted-foreground/40 bg-white py-4 font-semibold text-black hover:bg-neutral-100 focus-visible:bg-neutral-100 dark:border-0 dark:hover:bg-neutral-200 dark:focus-visible:bg-neutral-100"
            disabled={isLoading}
            onClick={() =>
              mutateAsync({
                method: "google",
                data: undefined,
              })
            }
          >
            <GoogleIcon className="mr-2 h-6 w-6" />
            Continue with Google
          </Button>
        </li>
      </ul>

      <span className="flex items-center gap-x-3 text-sm uppercase text-muted-foreground before:h-[1px] before:flex-1 before:bg-muted-foreground/30 after:h-[1px] after:flex-1 after:bg-muted-foreground/30">
        or
      </span>
    </>
  );
}
