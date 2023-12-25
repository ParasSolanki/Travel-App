import type { ParseRoute, RegisteredRouter } from "@tanstack/react-router";
import {
  agentsResponseSchema,
  destinationsResponseSchema,
  hotelsResponseSchema,
  pickupPointsResponseSchema,
  sessinonUserSchema,
} from "@travel-app/api/schema";
import { z } from "zod";

export type RoutesPath = ParseRoute<RegisteredRouter["routeTree"]>["fullPath"];

export type Token = string;

export type User = z.infer<typeof sessinonUserSchema>;

export type Destination = z.infer<typeof destinationsResponseSchema>;

export type HotelColumn = z.infer<typeof hotelsResponseSchema>;

export type AgentColumn = z.infer<typeof agentsResponseSchema>;

export type PickupPointColumn = z.infer<typeof pickupPointsResponseSchema>;
