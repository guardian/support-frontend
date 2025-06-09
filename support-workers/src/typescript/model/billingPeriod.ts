import { z } from 'zod';

export const billingPeriodSchema = z.union([
	z.literal('Monthly'), //TODO: share this with support-frontend
	z.literal('Annual'),
	z.literal('Quarterly'),
]);
export type BillingPeriod = z.infer<typeof billingPeriodSchema>;
