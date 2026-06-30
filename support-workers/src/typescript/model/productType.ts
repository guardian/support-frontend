import { currencyCodeSchema } from '@modules/internationalisation/currency';
import {
	fulfilmentOptionsSchema,
	productOptionsSchema,
	recurringBillingPeriodSchema,
} from '@modules/product/schemas';
import { optionalDropNulls } from '@modules/schemaUtils';
import { z } from 'zod';

export const contributionProductSchema = z.object({
	amount: z.number(),
	currency: currencyCodeSchema,
	billingPeriod: recurringBillingPeriodSchema,
	productType: z.literal('Contribution'),
});
export const supporterPlusProductSchema = z.object({
	amount: z.number(),
	currency: currencyCodeSchema,
	billingPeriod: recurringBillingPeriodSchema,
	productType: z.literal('SupporterPlus'),
});
export const tierThreeProductSchema = z.object({
	currency: currencyCodeSchema,
	billingPeriod: recurringBillingPeriodSchema,
	fulfilmentOptions: fulfilmentOptionsSchema,
	productOptions: productOptionsSchema,
	productType: z.literal('TierThree'),
});
export const paperProductSchema = z.object({
	currency: currencyCodeSchema,
	billingPeriod: recurringBillingPeriodSchema,
	fulfilmentOptions: fulfilmentOptionsSchema,
	productOptions: productOptionsSchema,
	productType: z.literal('Paper'),
	deliveryAgent: optionalDropNulls(z.number()),
});
export const guardianWeeklyProductSchema = z.object({
	currency: currencyCodeSchema,
	billingPeriod: recurringBillingPeriodSchema,
	fulfilmentOptions: fulfilmentOptionsSchema,
	productType: z.literal('GuardianWeekly'),
});
export const digitalPackProductSchema = z.object({
	currency: currencyCodeSchema,
	billingPeriod: recurringBillingPeriodSchema,
	productType: z.literal('DigitalPack'),
});
export const guardianAdLiteProductSchema = z.object({
	currency: currencyCodeSchema,
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
export type ProductTypeName = ProductType['productType'];
