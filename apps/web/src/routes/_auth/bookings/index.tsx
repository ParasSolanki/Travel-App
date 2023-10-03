import { FileRoute } from "@tanstack/react-router";
import { SectionHeader } from "~/components/section-header";

export const route = new FileRoute("/bookings").createRoute({
  component: () => {
    return (
      <section>
        <SectionHeader title="Bookings" />
      </section>
    );
  },
});
