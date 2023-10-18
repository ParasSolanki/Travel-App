import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signupSchema } from "~/common/schema/validation/auth";
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
import { useAbilityContext } from "~/hooks/use-ability-context";
import { useSignin } from "~/hooks/use-signin";

function SignupForm() {
  const { mutateAsync, isPending } = useSignin();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    await mutateAsync({
      method: "email-signup",
      data: values,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 ">
        <fieldset disabled={isPending} className="space-y-4">
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

          <Button type="submit" disabled={isPending} className="text-white">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}

export default function SignupModule() {
  const ability = useAbilityContext((s) => s.ability);

  if (ability.can("manage", "auth")) return <Navigate to="/" />;

  return (
    <main className="flex h-screen">
      <div className="hidden h-screen w-6/12 bg-gradient-to-r from-primary via-green-700 to-green-900 lg:block">
        <div className="mx-auto mt-20 max-w-xl px-2">
          <h1 className="px-2 font-cal-sans text-5xl font-bold text-white">
            Create New Account,
          </h1>
        </div>
      </div>
      <div className="relative w-full lg:w-6/12">
        <div className="bg-grid absolute inset-0"></div>
        <div className="relative flex h-full items-center">
          <div className="mx-auto w-full max-w-xl space-y-4 px-4">
            <h1 className="text-4xl font-bold text-foreground">Sign Up</h1>

            <SocialAuth />
            <SignupForm />

            <p className="mt-4 font-medium text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-bold text-primary hover:underline focus:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
