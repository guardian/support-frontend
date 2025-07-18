import { isoCurrencySchema } from '@modules/internationalisation/schemas';
import {
	fulfilmentOptionsSchema,
	productOptionsSchema,
	recurringBillingPeriodSchema,
} from '@modules/product/schemas';
import { z } from 'zod';

export const contributionProductSchema = z.object({
	amount: z.number(),
	currency: isoCurrencySchema,
	billingPeriod: recurringBillingPeriodSchema,
	productType: z.literal('Contribution'),
});
export const supporterPlusProductSchema = z.object({
	amount: z.number(),
	currency: isoCurrencySchema,
	billingPeriod: recurringBillingPeriodSchema,
	productType: z.literal('SupporterPlus'),
});
export const tierThreeProductSchema = z.object({
	currency: isoCurrencySchema,
	billingPeriod: recurringBillingPeriodSchema,
	fulfilmentOptions: fulfilmentOptionsSchema,
	productOptions: productOptionsSchema,
	productType: z.literal('TierThree'),
});
export const paperProductSchema = z.object({
	currency: isoCurrencySchema,
	billingPeriod: recurringBillingPeriodSchema,
	fulfilmentOptions: fulfilmentOptionsSchema,
	productOptions: productOptionsSchema,
	productType: z.literal('Paper'),
});
export const guardianWeeklyProductSchema = z.object({
	currency: isoCurrencySchema,
	billingPeriod: recurringBillingPeriodSchema,
	fulfilmentOptions: fulfilmentOptionsSchema,
	productType: z.literal('GuardianWeekly'),
});
export const digitalPackProductSchema = z.object({
	currency: isoCurrencySchema,
	billingPeriod: recurringBillingPeriodSchema,
	productType: z.literal('DigitalPack'),
});
export const guardianAdLiteProductSchema = z.object({
	currency: isoCurrencySchema,
	productType: z.literal('GuardianAdLite'),
});
export const productTypeSchema = z.discriminatedUnion('productType', [
	contributionProductSchema,
	supporterPlusProductSchema,
	tierThreeProductSchema,
	guardianWeeklyProductSchema,
	paperProductSchema,
	digitalPackProductSchema,
	guardianAdLiteProductSchema,
]);
export type ProductType = z.infer<typeof productTypeSchema>;
