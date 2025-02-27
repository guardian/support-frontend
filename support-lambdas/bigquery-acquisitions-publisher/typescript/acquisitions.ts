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
export const AcquisitionProductSchema = z.object({
	eventTimeStamp: z.date(),
	product: z.enum(ProductTypeSchema),
	amount: z.number(),
	country: z.enum(IsoCountrySchema),
	currency: z.enum(IsoCurrencySchema),
	componentId: z.string().nullable(),
	componentType: z.string().nullable(),
	campaignCodes: z.string().array(),
	source: z.string().nullable(),
	referrerUrl: z.string().nullable(),
	abTests: z.object({ name: z.string(), variant: z.string() }).array(),
	paymentFrequency: z.enum(ContributionTypeSchema),
	paymentProvider: z.enum(PaymentMethodSchema), // ???
	printOptions: z
		.object({ product: z.string(), delivery_country_code: z.string() })
		.array()
		.nullable(),
	browserId: z.string().nullable(),
	identityId: z.string(), // 200381287
	pageViewId: z.string(), // m7ezxppo1x1qg5b4q1x8
	referrerPageViewId: z.string(),
	platform: z.string(), // SUPPORT
	labels: z.string().array().nullable(), // one-time-checkout
	promoCode: z.string().nullable(),
	queryParameters: z
		.object({ key: z.string(), value: z.string() })
		.array()
		.nullable(),
	reusedExistingPaymentMethod: z.boolean(),
	acquisitionType: z.string(), // Purchase
	readerType: z.string(), // Direct
	zuoraSubscriptionNumber: z.string().nullable(),
	contributionId: z.string(), //f7c7aef7-f12d-476b-ba68-5ae79237cd8f
	paymentId: z.string(), // PAYID-M64KYRY1DX444112D060283M
});
export type AcquisitionProduct = z.infer<typeof AcquisitionProductSchema>;

// Items not required by BigQuery
export const AcquisitionProductDetailSchema = z.object({
	postalCode: z.string().nullable(),
	state: z.string().nullable(),
	email: z.string(),
});
export type AcquisitionProductDetail = z.infer<
	typeof AcquisitionProductDetailSchema
> &
	AcquisitionProduct;

export type AcquisitionProductDetails = {
	details: [AcquisitionProductDetail];
};

export const aquisitionProductDetail: AcquisitionProductDetail = {
	eventTimeStamp: new Date(),
	product: 'Contribution',
	amount: 10.0,
	country: 'GB',
	currency: 'GBP',
	componentId: null,
	componentType: null,
	campaignCodes: [''],
	source: null,
	referrerUrl: null,
	abTests: [{ name: 'oneTimeConfirmEmail', variant: 'variant' }],
	paymentFrequency: 'ONE_OFF',
	paymentProvider: 'PayPal',
	printOptions: null,
	browserId: null,
	identityId: '200381287',
	pageViewId: 'm7ezxppo1x1qg5b4q1x8',
	referrerPageViewId: '',
	platform: 'SUPPORT',
	labels: ['one-time-checkout'],
	promoCode: null,
	queryParameters: [],
	reusedExistingPaymentMethod: false,
	acquisitionType: 'Purchase',
	readerType: 'Direct',
	zuoraSubscriptionNumber: null,
	contributionId: 'f7c7aef7-f12d-476b-ba68-5ae79237cd8f',
	paymentId: 'PAYID-M64KYRY1DX444112D060283M',
	postalCode: '',
	state: 'CA',
	email: '',
};
