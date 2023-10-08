import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  createHotelSchema,
  hotelsResponseSchema,
} from "@travel-app/api/schema";
import { Loader2, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z, type ZodType } from "zod";
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
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

type Hotel = z.infer<typeof hotelsResponseSchema>;

export function HotelForm({
  schema,
  hotel,
  isLoading,
  onSubmit,
}: {
  schema: ZodType;
  hotel?: Hotel;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof schema>) => void;
}) {
  const { data, error } = useQuery({
    queryKey: ["destinations", "all"],
    queryFn: api.allDestinations,
  });

  const form = useForm<z.infer<typeof createHotelSchema>>({
    resolver: zodResolver(createHotelSchema),
    values: {
      name: hotel?.name ?? "",
      email: hotel?.email ?? "",
      phoneNumber: hotel?.phoneNumber ?? "",
      destinationId: hotel?.destination.id ?? "",
      address: hotel?.address ?? "",
      roomTypes: hotel?.roomTypes ?? [{ type: "" }],
    },
  });
  const {
    fields: roomTypeFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "roomTypes",
  });

  useEffect(() => {
    if (error) toast.error("Cant retrive destinations list");
  }, [error]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
        <fieldset disabled={isLoading} className="space-y-4">
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="-mx-3 flex flex-col space-y-3 md:flex-row md:space-y-0">
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

            <div className="w-full px-3 md:w-4/12">
              <FormField
                control={form.control}
                name="destinationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="max-h-[200px]">
                          {data?.data.destinations.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="-mx-3 flex flex-col flex-wrap gap-y-3 md:flex-row">
            {roomTypeFields.map((field, index) => (
              <div key={field.id} className="w-full px-3 md:w-4/12">
                <Label
                  htmlFor={field.id}
                  className={cn(
                    // @ts-ignore
                    !!form.formState.errors.roomTypes?.[index]?.type?.message &&
                      "text-destructive",
                  )}
                >
                  Room Type
                </Label>
                <div className="flex items-end justify-between space-x-2">
                  <Input
                    id={field.id}
                    className={cn(
                      "flex-grow",
                      !!// @ts-ignore
                      form.formState.errors.roomTypes?.[index]?.type?.message &&
                        "focus-visible:ring-destructive",
                    )}
                    aria-invalid={
                      // @ts-ignore
                      !!form.formState.errors.roomTypes?.[index]?.type?.message
                    }
                    placeholder="Room type"
                    {...form.register(`roomTypes.${index}.type`)}
                  />
                  <Button
                    size="icon"
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <span className="sr-only">Remove Room type</span>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
                {/* @ts-ignore */}
                {form.formState.errors.roomTypes?.[index]?.type?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {/* @ts-ignore */}
                    {form.formState.errors.roomTypes[index]?.type?.message}
                  </p>
                )}
              </div>
            ))}
            <div className="w-full px-3 md:w-4/12">
              <Button
                type="button"
                variant="secondary"
                className="sm:mt-6"
                onClick={() => append({ type: "" })}
              >
                <PlusIcon className="mr-1 h-4 w-4" />
                Add Room type
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="text-white">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
