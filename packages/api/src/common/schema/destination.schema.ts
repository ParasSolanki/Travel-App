import { z } from 'zod';

export const destinationId = z.string().nonempty('Destination is required');

export const destinationName = z
  .string()
  .min(1, 'Name must contain at least 1 character(s)')
  .max(50, 'Name must contain at most 50 character(s)');

export const shortCode = z
  .string()
  .min(1, 'Short code must contain at least 1 character(s)')
  .max(20, 'Short code must contain at most 20 character(s)')
  .regex(
    new RegExp(/^[A-Z0-9]*$/),
    'Short code must only contain uppercase and number letter(s)',
  )
  .refine((s) => !s.includes(' '), 'No spaces allowed in short code');

export const createDestinationSchema = z.object({
  name: destinationName,
  shortCode,
});

export const editDestinationSchema = z.object({
  name: destinationName,
  shortCode,
});

export const destinationsResponseSchema = z.object({
  id: destinationId,
  name: destinationName,
  shortCode,
});

export const destinationsSearchSchema = z.object({
  search: z.coerce.string().optional().catch(undefined), // it will convert to string
  page: z.number().min(0, 'Page must be greater than or equal to 0').catch(0),
  perPage: z
    .number()
    .max(100, 'Perpage must be less than or equal to 100')
    .catch(10),
});
