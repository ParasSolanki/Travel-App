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
import { agentsResponseSchema } from "@travel-app/api/schema";
import { useQueryClient } from "@tanstack/react-query";
import { agentQueries } from "~/common/queries";

const LazyEditAgentDialog = lazy(
  () => import("~/components/agent/edit-agent-dialog"),
);
const LazyDeleteAgentDialog = lazy(
  () => import("~/components/agent/delete-agent-dialog"),
);

interface AgentsTableActionsProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
}

export function AgentsTableActions<TData>({
  table,
  row,
}: AgentsTableActionsProps<TData>) {
  const queryClient = useQueryClient();
  const agent = agentsResponseSchema.parse(row.original);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenDeleteAlertDialog, setIsOpenDeleteAlertDialog] = useState(false);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries(
      agentQueries.list({
        search: table.getState().globalFilter,
        page: table.getState().pagination.pageIndex,
        perPage: table.getState().pagination.pageSize,
      }),
    );
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
            onSelect={() => setIsOpenEditDialog(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500 focus:cursor-pointer focus:bg-destructive focus:text-white"
            onSelect={() => setIsOpenDeleteAlertDialog(true)}
          >
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpenEditDialog && (
        <LazyEditAgentDialog
          open={isOpenEditDialog}
          agent={agent}
          onOpenChange={setIsOpenEditDialog}
          onSuccess={onSuccess}
        />
      )}
      {isOpenDeleteAlertDialog && (
        <LazyDeleteAgentDialog
          open={isOpenDeleteAlertDialog}
          agentId={agent.id}
          onOpenChange={setIsOpenDeleteAlertDialog}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
