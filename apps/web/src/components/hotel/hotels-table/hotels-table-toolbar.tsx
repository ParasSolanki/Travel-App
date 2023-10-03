import { Table } from "@tanstack/react-table";
import { useDebounce } from "usehooks-ts";

import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { DataTableViewOptions } from "~/components/ui/data-table/data-table-view-options";

interface HotelsToolbarProps<TData> {
  table: Table<TData>;
}

export function HotelsTableToolbar<TData>({
  table,
}: HotelsToolbarProps<TData>) {
  const [searchTerm, setSearchTerm] = useState(table.getState().globalFilter);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    table.setGlobalFilter(debouncedSearchTerm);
  }, [debouncedSearchTerm, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search name, phone number, address or destination"
          defaultValue={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
          className="h-10 w-[250px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
