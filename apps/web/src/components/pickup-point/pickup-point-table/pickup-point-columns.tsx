import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/data-table-column-header";
import { PickupPointTableActions } from "./pickup-point-table-actions";
import { PickupPointColumn } from "~/types";

export const columns: ColumnDef<PickupPointColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "destination",
    accessorFn: (row) => {
      return row.destination.name;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => (
      <PickupPointTableActions row={row} table={table} />
    ),
  },
];
