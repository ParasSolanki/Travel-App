import { useEffect, useMemo, useState } from "react";
import { useNavigate, RouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  SortingState,
  VisibilityState,
  PaginationState,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { columns } from "./agents-table-columns";
import { AgentsTableToolbar } from "./agents-table-toolbar";
import { agentQueries } from "~/common/queries";
import { DataTablePagination } from "~/components/ui/data-table/data-table-pagination";

const agentsRoute = new RouteApi({ id: "/_auth/agents" });

export function AgentsTable() {
  const navigate = useNavigate();
  const search = agentsRoute.useSearch({
    select: ({ page, search }) => ({ page, search }),
  });
  const [globalFilter, setGlobalFilter] = useState(search.search);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: search.page,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const { data } = useQuery({
    ...agentQueries.list({
      search: globalFilter,
      page: pageIndex,
      perPage: pageSize,
    }),
    placeholderData: (previousData) => previousData,
  });

  const table = useReactTable({
    data: data?.data.agents ?? [],
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      globalFilter,
    },
    pageCount:
      data && data.data.pagination.total > 0 ? data.data.pagination.total : 1, // total page
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: search.page }));
  }, [search.page]);

  useEffect(() => {
    navigate({
      to: "/agents",
      search: {
        search: globalFilter,
        page: pageIndex,
      },
      replace: true,
    });
  }, [navigate, globalFilter, pageIndex]);

  return (
    <div className="mt-10 space-y-4">
      <AgentsTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Agents.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
