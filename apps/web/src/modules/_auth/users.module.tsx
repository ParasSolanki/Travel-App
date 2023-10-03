import { Can } from "~/components/can";
import { SectionHeader } from "~/components/section-header";
import { UsersTable } from "~/components/users-table/users-table";

export default function UsersModule() {
  return (
    <Can action="manage" subject="users" redirectTo="/unauthorized">
      <SectionHeader title="Users" />
      <UsersTable />
    </Can>
  );
}
