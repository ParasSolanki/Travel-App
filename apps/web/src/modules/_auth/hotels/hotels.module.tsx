import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Can } from "~/components/can";
import { HotelsTable } from "~/components/hotel/hotels-table/hotels-table";
import { SectionHeader } from "~/components/section-header";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function Hotels() {
  return (
    <Can action="manage" subject="hotels" redirectTo="/unauthorized">
      <SectionHeader
        title="Hotels"
        right={
          <Link to="/hotels/new" className={cn(buttonVariants(), "text-white")}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Hotel
          </Link>
        }
      />
      <HotelsTable />
    </Can>
  );
}
