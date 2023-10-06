import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
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
import { columns } from "./users-table-columns";
import { UsersTableToolbar } from "./users-table-toolbar";
import { api } from "~/utils/api";
import { DataTablePagination } from "../ui/data-table/data-table-pagination";
import { route as UsersRoute } from "~/routes/_auth/users";

export function UsersTable() {
  const navigate = useNavigate();
  const search = useSearch({ from: UsersRoute.id });
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
    queryKey: [
      "users",
      {
        search: globalFilter,
        page: pageIndex,
        perPage: pageSize,
      },
    ],
    queryFn: () =>
      api.users({
        queries: {
          search: globalFilter,
          page: pageIndex,
          perPage: pageSize,
        },
      }),
    keepPreviousData: true,
  });

  const table = useReactTable({
    data: data?.data.users ?? [],
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
      to: "/users",
      search: {
        search: globalFilter,
        page: pageIndex,
      },
      replace: true,
    });
  }, [navigate, globalFilter, pageIndex]);

  return (
    <div className="mt-10 space-y-4">
      <UsersTableToolbar table={table} />
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
                  No Users.
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