import { lazy, useCallback, useState } from "react";
import { Row, Table } from "@tanstack/react-table";
import { MoreHorizontalIcon, Trash2Icon, PencilIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { pickupPointsResponseSchema } from "@travel-app/api/schema";
import { useQueryClient } from "@tanstack/react-query";

const LazyEditPickupPointDialog = lazy(
  () => import("~/components/pickup-point/edit-pickup-point-dialog"),
);
const LazyDeletePickupPointDialog = lazy(
  () => import("~/components/pickup-point/delete-pickup-point-dialog"),
);

interface PickupPointTableActionsProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
}

export function PickupPointTableActions<TData>({
  table,
  row,
}: PickupPointTableActionsProps<TData>) {
  const queryClient = useQueryClient();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState(false);
  const pickupPoint = pickupPointsResponseSchema.parse(row.original);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [
        "pickup-points",
        {
          search: table.getState().globalFilter,
          page: table.getState().pagination.pageIndex,
          perPage: table.getState().pagination.pageSize,
        },
      ],
    });
  }, [queryClient, table]);

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
        <LazyEditPickupPointDialog
          open={openEditDialog}
          pickupPoint={pickupPoint}
          onOpenChange={setOpenEditDialog}
          onSuccess={onSuccess}
        />
      )}
      {openDeleteAlertDialog && (
        <LazyDeletePickupPointDialog
          open={openDeleteAlertDialog}
          pickupPointId={pickupPoint.id}
          onOpenChange={setOpenDeleteAlertDialog}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
