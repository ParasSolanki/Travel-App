import { updateProfileSchema } from "@travel-app/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
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
import { Textarea } from "~/components/ui/textarea";
import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";
import { SectionHeader } from "~/components/section-header";
import { sessionKeys } from "~/common/queries";

function UpdateProfileForm() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: session?.user.name ?? "",
      email: session?.user.email ?? "",
      address: session?.user.address ?? undefined,
      phone: session?.user.phone ?? "",
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["me"],
    mutationFn: api.updateProfile,
    onError() {
      toast.error("Something went wrong while updating profile");
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.get,
      });
      toast.success("Profile updated successfully");
    },
  });

  async function onProfieSubmit(values: z.infer<typeof updateProfileSchema>) {
    await mutateAsync({
      address: values.address,
      email: values.email,
      name: values.name,
      phone: values.phone,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onProfieSubmit)} className="mt-6 ">
        <fieldset disabled={isPending} className="space-y-4">
          <div className="-mx-3 flex flex-col space-y-3 md:flex-row md:space-y-0">
            <div className="w-full px-3 md:w-4/12">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full px-3 md:w-4/12">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full px-3 md:w-4/12">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="-mx-3 flex">
            <div className="w-full px-3 md:w-8/12">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="text-white">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}

export default function ProfileModule() {
  return (
    <section>
      <SectionHeader
        title="Edit Profile"
        description="Here you can edit your profile."
      />
      <UpdateProfileForm />
    </section>
  );
}
