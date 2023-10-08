import { z } from 'zod';

const id = z.string().nonempty('User is required');
export const email = z.string().email();
const name = z
  .string()
  .nonempty('Name must contain at least 1 character(s)')
  .max(20, 'Name must contain at most 20 character(s)');
const address = z
  .string()
  .nonempty('Address must contain at least 1 character(s)')
  .max(150, 'Address must contain at most 150 character(s)');
const phone = z
  .string()
  .min(9, 'Phone must contain at least 9 character(s)')
  .max(11, 'Phone must contain at most 11 character(s)');

export const password = z
  .string()
  .min(8, 'Password must contain at least 8 character(s)')
  .max(50, 'Password must contain at most 50 character(s)');

export const updateProfileSchema = z.object({
  name,
  email,
  phone,
  address: address.optional(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: password,
    newPassword: password,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'Old password and New Password cant be the same',
    path: ['newPassword'],
  });

export const sessinonUserSchema = z.object({
  id,
  email,
  name: name.nullable(),
  address: address.nullable(),
  phone: phone.nullable(),
  role: z.object({
    name: z.string(),
  }),
});

export const usersResponseSchema = z.object({
  id,
  email,
  name: name.nullable(),
  address: address.nullable(),
  phone: phone.nullable(),
});

export const usersSeachSchema = z.object({
  search: z.coerce.string().optional().catch(undefined), // it will convert to string
  page: z.number().min(0, 'Page must be greater than or equal to 0').catch(0),
  perPage: z
    .number()
    .max(100, 'Perpage must be less than or equal to 100')
    .catch(10),
});
