import { useQueryClient } from "@tanstack/react-query";
import { Row, Table } from "@tanstack/react-table";
import { destinationsResponseSchema } from "@travel-app/api/schema";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { lazy, useCallback, useState } from "react";
import { destinationKeys } from "~/common/queries";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const LazyEditDestination = lazy(() =>
  import("~/components/destination/destination-dialogs").then((r) => ({
    default: r.EditDestinationDialog,
  })),
);
const LazyDeleteDestinationDialog = lazy(() =>
  import("~/components/destination/destination-dialogs").then((r) => ({
    default: r.DeleteDestinationDialog,
  })),
);

interface DestinationTableActionsProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
}

export function DestinationsTableActions<TData>({
  table,
  row,
}: DestinationTableActionsProps<TData>) {
  const queryClient = useQueryClient();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState(false);
  const destination = destinationsResponseSchema.parse(row.original);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: destinationKeys.all,
    });
  }, [queryClient]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="focus:cursor-pointer"
            onSelect={() => setOpenEditDialog(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500 focus:cursor-pointer focus:bg-destructive focus:text-white"
            onSelect={() => setOpenDeleteAlertDialog(true)}
          >
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openEditDialog && (
        <LazyEditDestination
          open={openEditDialog}
          destination={destination}
          onOpenChange={setOpenEditDialog}
          onSuccess={onSuccess}
        />
      )}
      {openDeleteAlertDialog && (
        <LazyDeleteDestinationDialog
          open={openDeleteAlertDialog}
          destinationId={destination.id}
          onOpenChange={setOpenDeleteAlertDialog}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
