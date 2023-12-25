import { FileRoute } from "@tanstack/react-router";
import { SectionHeader } from "~/components/section-header";

export const Route = new FileRoute('/_auth/bookings').createRoute({
  component: () => {
    return (
      <section>
        <SectionHeader title="Bookings" />
      </section>
    );
  },
});
