import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/data-table-column-header";
import { AgentsTableActions } from "./agents-table-actions";
import { AgentColumn } from "~/types";

export const columns: ColumnDef<AgentColumn>[] = [
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
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => <AgentsTableActions row={row} table={table} />,
  },
];
