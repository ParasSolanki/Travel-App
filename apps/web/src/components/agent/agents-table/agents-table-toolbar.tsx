import { Table } from "@tanstack/react-table";
import { useDebounce } from "usehooks-ts";

import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { DataTableViewOptions } from "~/components/ui/data-table/data-table-view-options";

interface AgentsToolbarProps<TData> {
  table: Table<TData>;
}

export function AgentsTableToolbar<TData>({
  table,
}: AgentsToolbarProps<TData>) {
  const [searchTerm, setSearchTerm] = useState(table.getState().globalFilter);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    table.setGlobalFilter(debouncedSearchTerm);
  }, [debouncedSearchTerm, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search name, email, phone number or address"
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
