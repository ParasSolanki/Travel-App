import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
import { useAbilityContext } from "~/hooks/use-ability-context";
import { api } from "~/utils/api";
import { getUrlBasedOnUserRole } from "~/utils/get-url-based-on-user-role";

export default function SignInModule() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ability = useAbilityContext((s) => s.ability);
  const updateAbility = useAbilityContext((s) => s.updateAbility);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signinMutateAsync, isLoading } = useMutation({
    mutationKey: ["signin"],
    mutationFn: api.signin,
    onSuccess(data) {
      if (!data.ok) return;
      toast.success("Signed in successfully");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      flushSync(() => {
        updateAbility(data.data.user);
      });
      navigate({
        to: getUrlBasedOnUserRole(data.data.user.role.name),
      });
    },
    onError(error) {
      let message = "Something went wrong while signing";
      if (error instanceof AxiosError && error.response?.data?.error?.message) {
        message = error.response?.data?.error?.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    await signinMutateAsync({
      email: values.email,
      password: values.password,
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

            <div className=" text-center">
              <span className="text-sm text-muted-foreground">OR</span>
            </div>

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
