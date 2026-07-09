import { countryCodeSchema } from '@guardian/support-service-lambdas/modules/internationalisation/src/schemas';
import { z } from 'zod';
import { IsoCurrencySchema } from './currencySchema';

export const ProductTypeSchema = z.enum([
	'CONTRIBUTION',
	'PRINT_SUBSCRIPTION',
	'DIGITAL_SUBSCRIPTION',
	'RECURRING_CONTRIBUTION',
	'SUPPORTER_PLUS',
	'TIER_THREE',
	'APP_PREMIUM_TIER',
	'GUARDIAN_AD_LITE',
	'FEAST_APP',
]);
export type Product = z.infer<typeof ProductTypeSchema>;

export const PaymentFrequencySchema = z.enum([
	'ONE_OFF',
	'MONTHLY',
	'QUARTERLY',
	'SIX_MONTHLY',
	'ANNUALLY',
]);
export type PaymentFrequency = z.infer<typeof PaymentFrequencySchema>;

export const PaymentProviderSchema = z.enum([
	'STRIPE',
	'STRIPE_APPLE_PAY',
	'STRIPE_PAYMENT_REQUEST_BUTTON',
	'STRIPE_SEPA',
	'PAYPAL',
	'GOCARDLESS',
	'IN_APP_PURCHASE',
]);
export type PaymentProvider = z.infer<typeof PaymentProviderSchema>;

const PrintProductSchema = z.enum([
	'HOME_DELIVERY_EVERYDAY',
	'HOME_DELIVERY_EVERYDAY_PLUS',
	'HOME_DELIVERY_SIXDAY',
	'HOME_DELIVERY_SIXDAY_PLUS',
	'HOME_DELIVERY_WEEKEND',
	'HOME_DELIVERY_WEEKEND_PLUS',
	'HOME_DELIVERY_SATURDAY',
	'HOME_DELIVERY_SATURDAY_PLUS',
	'HOME_DELIVERY_SUNDAY',
	'HOME_DELIVERY_SUNDAY_PLUS',
	'NATIONAL_DELIVERY_EVERYDAY',
	'NATIONAL_DELIVERY_SIXDAY',
	'NATIONAL_DELIVERY_WEEKEND',
	'NATIONAL_DELIVERY_EVERYDAY_PLUS',
	'NATIONAL_DELIVERY_SIXDAY_PLUS',
	'NATIONAL_DELIVERY_WEEKEND_PLUS',
	'VOUCHER_EVERYDAY',
	'VOUCHER_EVERYDAY_PLUS',
	'VOUCHER_SIXDAY',
	'VOUCHER_SIXDAY_PLUS',
	'VOUCHER_WEEKEND',
	'VOUCHER_WEEKEND_PLUS',
	'VOUCHER_SATURDAY',
	'VOUCHER_SATURDAY_PLUS',
	'VOUCHER_SUNDAY',
	'VOUCHER_SUNDAY_PLUS',
	'GUARDIAN_WEEKLY',
]);

export const PrintOptionsSchema = z
	.object({ product: PrintProductSchema, deliveryCountry: countryCodeSchema })
	.nullish();
export type PrintOptions = z.infer<typeof PrintOptionsSchema>;

export const ReaderTypeSchema = z.enum(['Direct', 'Gift']);
export type ReaderType = z.infer<typeof ReaderTypeSchema>;

// This defines the schema for the data we expect to receive in the acquisition event.
// It should be kept in sync with the AcquisitionDataRow Scala case class used
// to generate the event:
// https://github.com/guardian/support-frontend/blob/main/support-modules/acquisition-events/src/main/scala/com/gu/support/acquisitions/models/AcquisitionDataRow.scala#L15
export const AcquisitionProductSchema = z.object({
	eventTimeStamp: z.string(),
	country: countryCodeSchema,
	componentId: z.string().nullish(),
	componentType: z.string().nullish(),
	campaignCode: z.string().nullish(),
	referrerUrl: z.string().nullish(),
	abTests: z.object({ name: z.string(), variant: z.string() }).array(),
	paymentFrequency: PaymentFrequencySchema,
	paymentProvider: PaymentProviderSchema.nullish(),
	printOptions: PrintOptionsSchema,
	browserId: z.string().nullish(),
	identityId: z.string().nullish(),
	pageViewId: z.string().nullish(),
	referrerPageViewId: z.string().nullish(),
	promoCode: z.string().nullish(),
	queryParameters: z.object({ name: z.string(), value: z.string() }).array(),
	reusedExistingPaymentMethod: z.boolean(),
	acquisitionType: z.string(),
	readerType: ReaderTypeSchema,
	zuoraSubscriptionNumber: z.string().nullish(),
	contributionId: z.string().nullish(),
	paymentId: z.string().nullish(),
	product: ProductTypeSchema,
	amount: z.number().nullish(),
	currency: IsoCurrencySchema,
	source: z.string().nullish(),
	platform: z.string().nullish(),
	labels: z.string().array(),
});
export type AcquisitionProduct = z.infer<typeof AcquisitionProductSchema>;

export const AcquisitionProductEventSchema = z.object({
	detail: AcquisitionProductSchema,
});
export type AcquisitionProductEvent = z.infer<
	typeof AcquisitionProductEventSchema
>;
