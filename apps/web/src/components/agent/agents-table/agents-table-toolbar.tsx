import { Table } from "@tanstack/react-table";
import { useDebounce } from "usehooks-ts";

import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { DataTableViewOptions } from "~/components/ui/data-table/data-table-view-options";
import { SearchIcon } from "lucide-react";

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
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon className="h-4 w-4" />
          </span>
          <Input
            defaultValue={searchTerm}
            className="h-10 w-[250px] pl-9 lg:w-[350px]"
            placeholder="Search name, email, phone number or address"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
