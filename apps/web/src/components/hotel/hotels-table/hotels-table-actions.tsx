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
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { hotelsResponseSchema } from "@travel-app/api/schema";

const LazyDeleteHotelDialog = lazy(
  () => import("~/components/hotel/delete-hotel-dialog"),
);

interface HotelsTableActionsProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
}

export function HotelsTableActions<TData>({
  table,
  row,
}: HotelsTableActionsProps<TData>) {
  const queryClient = useQueryClient();
  const hotel = hotelsResponseSchema.parse(row.original);
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState(false);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [
        "hotels",
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
          <DropdownMenuItem asChild className="focus:cursor-pointer">
            <Link to="/hotels/$hotelId/edit" params={{ hotelId: hotel.id }}>
              <PencilIcon className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500 focus:cursor-pointer focus:bg-destructive focus:text-white"
            onSelect={() => setOpenDeleteAlertDialog(true)}
          >
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openDeleteAlertDialog && (
        <LazyDeleteHotelDialog
          open={openDeleteAlertDialog}
          hotelId={hotel.id}
          onOpenChange={setOpenDeleteAlertDialog}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
