import { z } from 'zod';

export const userTypeSchema = z.union([z.literal('new'), z.literal('current')]);
export type UserType = z.infer<typeof userTypeSchema>;
