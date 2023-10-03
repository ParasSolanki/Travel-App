import { z } from 'zod';
import { destinationId, destinationName } from './destination.schema.js';

export const hotelId = z.string().nonempty('Hotel is required');
const email = z.string().email();
const name = z
  .string()
  .min(1, 'Name must contain at least 1 character(s)')
  .max(50, 'Name must contain at most 50 character(s)');
const address = z
  .string()
  .nonempty('Address must contain at least 1 character(s)')
  .max(150, 'Address must contain at most 150 character(s)');
const phoneNumber = z
  .string()
  .min(9, 'Phone must contain at least 9 character(s)')
  .max(11, 'Phone must contain at most 11 character(s)');

const roomTypeId = z.string();

const roomTypeSchema = z.object({
  id: roomTypeId.nonempty('Hotel room type is required'),
  hotelId,
  type: z
    .string()
    .min(1, 'Room type must contain at least 1 character(s)')
    .max(50, 'Room type must contain at most 50 character(s)'),
});

export const createHotelSchema = z.object({
  name,
  email,
  address,
  phoneNumber,
  destinationId,
  roomTypes: z
    .object({
      type: roomTypeSchema.shape.type,
    })
    .array(),
});

export const editHotelSchema = z.object({
  name,
  email,
  address,
  phoneNumber,
  destinationId,
  roomTypes: z
    .object({
      id: roomTypeId.optional(),
      type: roomTypeSchema.shape.type,
    })
    .array(),
});

export const hotelsResponseSchema = z.object({
  id: hotelId,
  name,
  email,
  address,
  phoneNumber,
  destination: z.object({
    id: destinationId,
    name: destinationName,
  }),
  roomTypes: z
    .object({
      id: roomTypeSchema.shape.id,
      type: roomTypeSchema.shape.type,
    })
    .array(),
});

export const hotelsSearchSchema = z.object({
  search: z.coerce.string().optional().catch(undefined), // it will convert to string
  page: z.number().min(0, 'Page must be greater than or equal to 0').catch(0),
  perPage: z
    .number()
    .max(100, 'Perpage must be less than or equal to 100')
    .catch(10),
});
