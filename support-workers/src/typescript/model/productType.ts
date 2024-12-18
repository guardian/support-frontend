import { z } from 'zod';
import { billingPeriodSchema } from './billingPeriod';
import { currencySchema } from './currency';

export const contributionProductSchema = z.object({
	amount: z.number(),
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	productType: z.literal('Contribution'),
});
export const supporterPlusProductSchema = z.object({
	amount: z.number(),
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	productType: z.literal('SupporterPlus'),
});
export const tierThreeProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	fulfilmentOptions: z.string(), //TODO type this properly
	productOptions: z.string(), //TODO type this properly
	productType: z.literal('TierThree'),
});
export const paperProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	fulfilmentOptions: z.string(), //TODO type this properly
	productOptions: z.string(), //TODO type this properly
	productType: z.literal('Paper'),
});
export const guardianWeeklyProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	fulfilmentOptions: z.string(), //TODO type this properly
	productType: z.literal('GuardianWeekly'),
});
export const digitalPackProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	readerType: z.string(), //TODO type this properly
	productType: z.literal('DigitalPack'),
});
export const productTypeSchema = z.discriminatedUnion('productType', [
	contributionProductSchema,
	supporterPlusProductSchema,
	tierThreeProductSchema,
	guardianWeeklyProductSchema,
	paperProductSchema,
	digitalPackProductSchema,
]);
