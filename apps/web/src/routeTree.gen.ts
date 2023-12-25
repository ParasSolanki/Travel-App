import { Route as rootRoute } from "./routes/__root";
import { Route as UnauthorizedRoute } from "./routes/unauthorized";
import { Route as SignupRoute } from "./routes/signup";
import { Route as SigninRoute } from "./routes/signin";
import { Route as AuthRoute } from "./routes/_auth";
import { Route as Route } from "./routes/$";
import { Route as AuthUsersRoute } from "./routes/_auth.users";
import { Route as AuthProfileRoute } from "./routes/_auth.profile";
import { Route as AuthPickupPointsRoute } from "./routes/_auth.pickup-points";
import { Route as AuthDestinationsRoute } from "./routes/_auth.destinations";
import { Route as AuthChangePasswordRoute } from "./routes/_auth.change-password";
import { Route as AuthBookingsRoute } from "./routes/_auth.bookings";
import { Route as AuthAgentsRoute } from "./routes/_auth.agents";
import { Route as AuthIndexRoute } from "./routes/_auth.index";
import { Route as AuthHotelsNewRoute } from "./routes/_auth/hotels/new";
import { Route as AuthHotelsIndexRoute } from "./routes/_auth/hotels";
import { Route as AuthHotelsHotelIdEditRoute } from "./routes/_auth/hotels/$hotelId.edit";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/$": {
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
    "/unauthorized": {
      parentRoute: typeof rootRoute;
    };
    "/_auth/": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/agents": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/bookings": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/change-password": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/destinations": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/pickup-points": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/profile": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/users": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/hotels/": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/hotels/new": {
      parentRoute: typeof AuthRoute;
    };
    "/_auth/hotels/$hotelId/edit": {
      parentRoute: typeof AuthRoute;
    };
  }
}

Object.assign(Route.options, {
  path: "/$",
  getParentRoute: () => rootRoute,
});

Object.assign(AuthRoute.options, {
  id: "/_auth",
  getParentRoute: () => rootRoute,
});

Object.assign(SigninRoute.options, {
  path: "/signin",
  getParentRoute: () => rootRoute,
});

Object.assign(SignupRoute.options, {
  path: "/signup",
  getParentRoute: () => rootRoute,
});

Object.assign(UnauthorizedRoute.options, {
  path: "/unauthorized",
  getParentRoute: () => rootRoute,
});

Object.assign(AuthIndexRoute.options, {
  path: "/",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthAgentsRoute.options, {
  path: "/agents",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthBookingsRoute.options, {
  path: "/bookings",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthChangePasswordRoute.options, {
  path: "/change-password",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthDestinationsRoute.options, {
  path: "/destinations",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthPickupPointsRoute.options, {
  path: "/pickup-points",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthProfileRoute.options, {
  path: "/profile",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthUsersRoute.options, {
  path: "/users",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthHotelsIndexRoute.options, {
  path: "/hotels/",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthHotelsNewRoute.options, {
  path: "/hotels/new",
  getParentRoute: () => AuthRoute,
});

Object.assign(AuthHotelsHotelIdEditRoute.options, {
  path: "/hotels/$hotelId/edit",
  getParentRoute: () => AuthRoute,
});

export const routeTree = rootRoute.addChildren([
  Route,
  AuthRoute.addChildren([
    AuthIndexRoute,
    AuthAgentsRoute,
    AuthBookingsRoute,
    AuthChangePasswordRoute,
    AuthDestinationsRoute,
    AuthPickupPointsRoute,
    AuthProfileRoute,
    AuthUsersRoute,
    AuthHotelsIndexRoute,
    AuthHotelsNewRoute,
    AuthHotelsHotelIdEditRoute,
  ]),
  SigninRoute,
  SignupRoute,
  UnauthorizedRoute,
]);
