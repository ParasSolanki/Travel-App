import { z } from 'zod';
import { destinationId, destinationName } from './destination.schema.js';

export const pickupPointId = z.string();

export const pickupPointName = z
  .string()
  .min(1, 'Name must contain at least 1 character(s)')
  .max(50, 'Name must contain at most 50 character(s)');

export const createPickupPointSchema = z.object({
  name: pickupPointName,
  destinationId,
});

export const editPickupPointSchema = z.object({
  name: pickupPointName,
  destinationId,
});

export const pickupPointsResponseSchema = z.object({
  id: pickupPointId,
  name: pickupPointName,
  destination: z.object({
    id: destinationId,
    name: destinationName,
  }),
});

export const pickupPointsSearchSchema = z.object({
  search: z.coerce.string().optional().catch(undefined), // it will convert to string
  page: z.number().min(0, 'Page must be greater than or equal to 0').catch(0),
  perPage: z
    .number()
    .max(100, 'Perpage must be less than or equal to 100')
    .catch(10),
});
