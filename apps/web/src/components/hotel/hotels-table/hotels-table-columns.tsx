import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/data-table-column-header";
import { HotelsTableActions } from "./hotels-table-actions";
import { HotelColumn } from "~/types";

export const columns: ColumnDef<HotelColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "destination",
    accessorFn: (data) => {
      return data.destination.name;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => <HotelsTableActions row={row} table={table} />,
  },
];
