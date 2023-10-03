import { z } from 'zod';

export const agentId = z.string().nonempty('Agent is required');
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

export const agent = z.object({
  id: agentId,
  name,
  email,
  address,
  phoneNumber,
});

export const createAgentSchema = z.object({
  name,
  email,
  address,
  phoneNumber,
});

export const editAgentSchema = z.object({
  name,
  email,
  address,
  phoneNumber,
});

export const agentsResponseSchema = agent;

export const agentsSearchSchema = z.object({
  search: z.coerce.string().optional().catch(undefined), // it will convert to string
  page: z.number().min(0, 'Page must be greater than or equal to 0').catch(0),
  perPage: z
    .number()
    .max(100, 'Perpage must be less than or equal to 100')
    .catch(10),
});
