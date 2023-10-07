import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signinSchema } from "~/common/schema/validation/auth";
import { SocialAuth } from "~/components/social-auth";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";
import { useSignin } from "~/hooks/use-signin";
import { useAbilityContext } from "~/hooks/use-ability-context";
import { route as SignInRoute } from "~/routes/signin";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { signinErrorMessages } from "@travel-app/api/schema";

export default function SignInModule() {
  const search = useSearch({ from: SignInRoute.id });
  const ability = useAbilityContext((s) => s.ability);
  const { isLoading, mutateAsync } = useSignin();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (search.error) toast.error(signinErrorMessages[search.error]);
  }, [search.error]);

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    await mutateAsync({
      method: "email-signin",
      data: values,
    });
  }

  if (ability.can("manage", "auth")) return <Navigate to="/" />;

  return (
    <main className="flex h-screen">
      <div className="hidden h-screen w-6/12 bg-gradient-to-r from-primary via-green-700 to-green-900 md:block">
        <div className="mx-auto mt-20 max-w-xl ">
          <h1 className="px-2 font-cal-sans text-5xl font-bold text-white">
            Welcome Back,
          </h1>
        </div>
      </div>
      <div className="relative w-full md:w-6/12">
        <div className="bg-grid absolute inset-0"></div>
        <div className="relative flex h-full items-center">
          <div className="mx-auto w-full max-w-xl space-y-4 px-4">
            <h3 className=" text-4xl font-bold text-foreground">Sign in</h3>
            <SocialAuth />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 ">
                <fieldset disabled={isLoading} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} placeholder="Password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="text-white"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </Button>
                </fieldset>
              </form>
            </Form>

            <p className="mt-4 font-medium text-muted-foreground">
              Not registered yet?{" "}
              <Link
                to="/signup"
                className="font-bold text-primary hover:underline focus:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
