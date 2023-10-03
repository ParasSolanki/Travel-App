import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { usersResponseSchema } from "@travel-app/api/schema";
import { DataTableColumnHeader } from "~/components/ui/data-table/data-table-column-header";

type User = z.infer<typeof usersResponseSchema>;

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
];
