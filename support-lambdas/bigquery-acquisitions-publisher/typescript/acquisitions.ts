import { z } from 'zod';
import {
	ProductTypeSchema,
	IsoCountrySchema,
	IsoCurrencySchema,
	ContributionTypeSchema,
	PaymentMethodSchema,
} from './dependencies';

// Items to write to BigQuery (datalake:fact_acquisition_event)
// From scala : AcquistionDataRowMapper.mapToTableRow
export const AcquisitionsProductZod = z.object({
	amount: z.number(),
	componentId: z.string().nullable(),
	componentType: z.string().nullable(),
	campaignCode: z.string(),
	source: z.string().nullable(),
	referrerUrl: z.string().nullable(),
	abTests: z.object({ name: z.string(), variant: z.string() }).array(),
	paymentProvider: z.enum(PaymentMethodSchema), // ???
	printOptions: z
		.object({ product: z.string(), delivery_country_code: z.string() })
		.array()
		.nullable(),
	browserId: z.string().nullable(),
	identityId: z.string(), // 200381287
	pageViewId: z.string(), // m7ezxppo1x1qg5b4q1x8
	referrerPageViewId: z.string(),
	promoCode: z.string().nullable(),
	zuoraSubscriptionNumber: z.string().nullable(),
	contributionId: z.string(), //f7c7aef7-f12d-476b-ba68-5ae79237cd8f
	paymentId: z.string(), // PAYID-M64KYRY1DX444112D060283M
});
export type AcquisitionsProduct = z.infer<typeof AcquisitionsProductZod>;

// Items not required by BigQuery
export const AcquisitionsProductDetailsZod = z.object({
	eventTimeStamp: z.date(),
	product: z.enum(ProductTypeSchema),
	country: z.enum(IsoCountrySchema),
	currency: z.enum(IsoCurrencySchema),
	paymentFrequency: z.enum(ContributionTypeSchema),
	labels: z.string().array().nullable(), // one-time-checkout
	reusedExistingPaymentMethod: z.boolean(),
	readerType: z.string(), // Direct
	acquisitionType: z.string(), // Purchase
	queryParameters: z
		.object({ key: z.string(), value: z.string() })
		.array()
		.nullable(),
	platform: z.string(), // SUPPORT
	postalCode: z.string().nullable(),
	state: z.string().nullable(),
	email: z.string(),
});
export type AcquisitionsProductDetail = z.infer<
	typeof AcquisitionsProductDetailsZod
>;

export type AcquisitionsProductDetails = {
	details: [AcquisitionsProductDetail];
};

export const aquisitionProduct: AcquisitionsProduct = {
	amount: 10.0,
	componentId: null,
	componentType: null,
	campaignCode: '',
	source: null,
	referrerUrl: null,
	abTests: [{ name: 'oneTimeConfirmEmail', variant: 'variant' }],
	paymentProvider: 'PayPal',
	printOptions: null,
	browserId: null,
	identityId: '200381287',
	pageViewId: 'm7ezxppo1x1qg5b4q1x8',
	referrerPageViewId: '',
	promoCode: null,
	zuoraSubscriptionNumber: null,
	contributionId: 'f7c7aef7-f12d-476b-ba68-5ae79237cd8f',
	paymentId: 'PAYID-M64KYRY1DX444112D060283M',
};

export const aquisitionProductDetail: AcquisitionsProductDetail = {
	eventTimeStamp: new Date(),
	product: 'Contribution',
	country: 'GB',
	currency: 'GBP',
	paymentFrequency: 'ONE_OFF',
	labels: ['one-time-checkout'],
	reusedExistingPaymentMethod: false,
	readerType: 'Direct',
	acquisitionType: 'Purchase',
	queryParameters: [],
	platform: 'SUPPORT',
	postalCode: '',
	state: 'CA',
	email: '',
	...aquisitionProduct,
};

export const aquisitionProductDetails: AcquisitionsProductDetails = {
	details: [aquisitionProductDetail],
};
