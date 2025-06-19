import { isoCurrencySchema } from '@modules/internationalisation/currency';
import { recurringBillingPeriodSchema } from '@modules/product/billingPeriod';
import { z } from 'zod';

export const fulfilmentOptionsSchema = z.enum([
	'HomeDelivery',
	'NationalDelivery',
	'Collection',
	'Domestic',
	'RestOfWorld',
	'NoFulfilmentOptions',
]);

const productOptionsSchema = z.enum([
	'NoProductOptions',
	'Saturday',
	'SaturdayPlus',
	'Sunday',
	'SundayPlus',
	'Weekend',
	'WeekendPlus',
	'Sixday',
	'SixdayPlus',
	'Everyday',
	'EverydayPlus',
	'NewspaperArchive',
]);

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
	readerType: z.string(), //TODO this can be removed now that digital subscription gifts are no longer supported but we'll need to remove it from the scala code as well
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
