import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { password } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { SectionHeader } from "~/components/section-header";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { PasswordInput } from "~/components/ui/password-input";
import { api } from "~/utils/api";

const changePasswordSchema = z
  .object({
    oldPassword: password,
    newPassword: password,
    confirmPassword: password,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Old password and New Password cant be the same",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password doesnt match",
    path: ["confirmPassword"],
  });

function ChangePasswordForm() {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { isLoading, mutateAsync } = useMutation({
    mutationKey: ["me", "change-password"],
    mutationFn: api.changePassword,
    onSettled() {
      form.reset(); // reset form if error or success
    },
    onSuccess() {
      toast.success("Password updated successfully");
    },
    onError(error) {
      let message = "Something went wrong while updating password";

      if (error instanceof AxiosError && error.response?.data?.error?.message) {
        message = error.response.data.error.message;
      }

      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    await mutateAsync({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 ">
        <fieldset disabled={isLoading} className="space-y-4">
          <div className="-mx-3 flex flex-col space-y-3 md:flex-row md:space-y-0">
            <div className="w-full px-3 md:w-4/12">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="Old Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full px-3 md:w-4/12">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="New Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full px-3 md:w-4/12">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Confirm Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="text-white" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}

export default function ChangePassword() {
  return (
    <section>
      <SectionHeader
        title="Change Password"
        description="Complete the fields below to change your password. You will need to
            enter your current password first."
      />
      <ChangePasswordForm />
    </section>
  );
}
