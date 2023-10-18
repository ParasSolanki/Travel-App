import { type ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { destinationsResponseSchema } from "@travel-app/api/schema";

type Destination = z.infer<typeof destinationsResponseSchema>;

export function DestinationForm({
  schema,
  destination,
  isPending,
  onSubmit,
  onCancel,
}: {
  schema: ZodType;
  destination?: Destination;
  isPending: boolean;
  onSubmit: (values: z.infer<typeof schema>) => void;
  onCancel: () => void;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: destination?.name ?? "",
      shortCode: destination?.shortCode ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isPending} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Code</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              disabled={isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="text-white">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
