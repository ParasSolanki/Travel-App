import { useQuery } from "@tanstack/react-query";
import { useNavigate, RouteApi } from "@tanstack/react-router";
import {
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { DataTablePagination } from "~/components/ui/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/utils/api";
import { columns } from "./pickup-point-columns";
import { PickupPointTableToolbar } from "./pickup-point-table-toolbar";

const pickupPointsRoute = new RouteApi({ id: "/auth/pickup-points" });

export function PickupPointTable() {
  const navigate = useNavigate();
  const search = pickupPointsRoute.useSearch({
    select: ({ page, search }) => ({ page, search }),
  });
  const [globalFilter, setGlobalFilter] = useState(search.search);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: search.page,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );
  const { data } = useQuery({
    queryKey: [
      "pickup-points",
      {
        search: globalFilter,
        page: pageIndex,
        perPage: pageSize,
      },
    ],
    queryFn: () =>
      api.pickupPoints({
        queries: {
          search: globalFilter,
          page: pageIndex,
          perPage: pageSize,
        },
      }),
    placeholderData: (previousData) => previousData,
  });

  const table = useReactTable({
    data: data?.data.pickupPoints ?? [],
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
      to: "/pickup-points",
      search: {
        search: globalFilter,
        page: pageIndex,
      },
      replace: true,
    });
  }, [navigate, globalFilter, pageIndex]);

  return (
    <div className="mt-10 space-y-4">
      <PickupPointTableToolbar table={table} />
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
                  No Pickup Points.
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
