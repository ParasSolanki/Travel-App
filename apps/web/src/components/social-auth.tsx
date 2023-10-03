import { GoogleIcon } from "./icons/google-icon";
import { buttonVariants } from "./ui/button";
import { cn } from "~/lib/utils";

export function SocialAuth() {
  return (
    <div>
      <a
        href="/api/auth/signin/google"
        className={cn(
          buttonVariants(),
          "w-full bg-white py-4 font-semibold hover:bg-white/90",
        )}
      >
        <GoogleIcon className="mr-2 h-6 w-6" />
        Continue with Google
      </a>
    </div>
  );
}
