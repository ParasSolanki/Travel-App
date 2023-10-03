import { Can } from "~/components/can";
import { AddDestinationDialog } from "~/components/destination/add-destination-dialog";
import { DestinationsTable } from "~/components/destination/destinations-table/destinations-table";
import { SectionHeader } from "~/components/section-header";

export default function DestinationsModule() {
  return (
    <Can action="manage" subject="destinations" redirectTo="/unauthorized">
      <SectionHeader title="Destinations" right={<AddDestinationDialog />} />
      <DestinationsTable />
    </Can>
  );
}
