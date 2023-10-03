import { route as rootRoute } from "~/routes/__root";
import { route as NotFoundRoute } from "~/routes/404";
import { route as UnauthorizedRoute } from "~/routes/unauthorized";
import { route as SignInRoute } from "~/routes/signin";
import { route as SignUpRoute } from "~/routes/signup";
import { route as AuthLayoutRoute } from "~/routes/_auth";
import { route as IndexRoute } from "~/routes/_auth/index";
import { route as ProfileRoute } from "~/routes/_auth/profile";
import { route as ChangePasswordRoute } from "~/routes/_auth/change-password";
import { route as DestinationsRoute } from "~/routes/_auth/destinations";
import { route as AgentsRoute } from "~/routes/_auth/agents";
import { route as PickupPointsRoute } from "~/routes/_auth/pickup-points";
import { route as UsersRoute } from "~/routes/_auth/users";
import { route as BookingsRoute } from "~/routes/_auth/bookings/index";
import { route as HotelsRoute } from "~/routes/_auth/hotels/index";
import { route as NewHotelRoute } from "~/routes/_auth/hotels/new";
import { route as EditHotelRoute } from "~/routes/_auth/hotels/$hotelId.edit";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "*": {
      parentRoute: typeof rootRoute;
    };
    "/unauthorized": {
      parentRoute: typeof rootRoute;
    };
    "/_auth": {
      parentRoute: typeof rootRoute;
    };
    "/signin": {
      parentRoute: typeof rootRoute;
    };
    "/signup": {
      parentRoute: typeof rootRoute;
    };
    "/": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/profile": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/change-password": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/users": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/destinations": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/bookings": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/agents": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/pickup-points": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/hotels": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/hotels/new": {
      parentRoute: typeof AuthLayoutRoute;
    };
    "/hotels/$hotelId/edit": {
      parentRoute: typeof AuthLayoutRoute;
    };
  }
}

Object.assign(NotFoundRoute.options, {
  path: "*",
  getParentRoute: () => rootRoute,
});

Object.assign(UnauthorizedRoute.options, {
  path: "/unauthorized",
  getParentRoute: () => rootRoute,
});

Object.assign(AuthLayoutRoute.options, {
  id: "/auth",
  getParentRoute: () => rootRoute,
});

Object.assign(SignInRoute.options, {
  path: "/signin",
  getParentRoute: () => rootRoute,
});

Object.assign(SignUpRoute.options, {
  path: "/signup",
  getParentRoute: () => rootRoute,
});

Object.assign(IndexRoute.options, {
  path: "/",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(ProfileRoute.options, {
  path: "/profile",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(ChangePasswordRoute.options, {
  path: "/change-password",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(DestinationsRoute.options, {
  path: "/destinations",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(UsersRoute.options, {
  path: "/users",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(BookingsRoute.options, {
  path: "/bookings",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(AgentsRoute.options, {
  path: "/agents",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(PickupPointsRoute.options, {
  path: "/pickup-points",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(HotelsRoute.options, {
  path: "/hotels",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(NewHotelRoute.options, {
  path: "/hotels/new",
  getParentRoute: () => AuthLayoutRoute,
});

Object.assign(EditHotelRoute.options, {
  path: "/hotels/$hotelId/edit",
  getParentRoute: () => AuthLayoutRoute,
});

export const routeTree = rootRoute.addChildren([
  SignInRoute,
  SignUpRoute,
  NotFoundRoute,
  UnauthorizedRoute,
  AuthLayoutRoute.addChildren([
    IndexRoute,
    UsersRoute,
    AgentsRoute,
    ProfileRoute,
    BookingsRoute,
    PickupPointsRoute,
    DestinationsRoute,
    ChangePasswordRoute,
    HotelsRoute,
    NewHotelRoute,
    EditHotelRoute,
  ]),
]);
