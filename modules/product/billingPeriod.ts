import { z } from 'zod';

export enum BillingPeriod {
	Annual = 'Annual',
	Monthly = 'Monthly',
	Quarterly = 'Quarterly',
	OneTime = 'OneTime',
}

export const billingPeriodSchema = z.nativeEnum(BillingPeriod);

export const recurringBillingPeriodSchema = z.union([
	z.literal(BillingPeriod.Annual),
	z.literal(BillingPeriod.Monthly),
	z.literal(BillingPeriod.Quarterly),
]);

export type RecurringBillingPeriod = z.infer<
	typeof recurringBillingPeriodSchema
>;
