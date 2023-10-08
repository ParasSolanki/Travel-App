import { AddAgentDialog } from "~/components/agent/agent-dialogs";
import { AgentsTable } from "~/components/agent/agents-table/agents-table";
import { Can } from "~/components/can";
import { SectionHeader } from "~/components/section-header";

export default function Agents() {
  return (
    <Can action="manage" subject="agents" redirectTo="/unauthorized">
      <SectionHeader title="Agents" right={<AddAgentDialog />} />
      <AgentsTable />
    </Can>
  );
}
