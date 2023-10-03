import { Can } from "~/components/can";
import { AddPickupPointDialog } from "~/components/pickup-point/add-pickup-point-dialog";
import { PickupPointTable } from "~/components/pickup-point/pickup-point-table/pickup-point-table";
import { SectionHeader } from "~/components/section-header";

export default function PickupPointsModule() {
  return (
    <Can action="manage" subject="pickup-points" redirectTo="/unauthorized">
      <SectionHeader title="Pickup Points" right={<AddPickupPointDialog />} />
      <PickupPointTable />
    </Can>
  );
}
