import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/data-table-column-header";
import { DestinationsTableActions } from "./destinations-table-actions";
import { Destination } from "~/types";

export const columns: ColumnDef<Destination>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "shortCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short Code" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DestinationsTableActions row={row} />,
  },
];
