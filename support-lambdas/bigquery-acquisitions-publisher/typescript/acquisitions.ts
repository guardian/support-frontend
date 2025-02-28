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
	eventTimeStamp: z.string(),
	country: z.enum(IsoCountrySchema),
	componentId: z.string().nullable(),
	componentType: z.string().nullable(),
	campaignCode: z.string().nullable(),
	referrerUrl: z.string().nullable(),
	abTests: z.object({ name: z.string(), variant: z.string() }),
	paymentFrequency: z.enum(ContributionTypeSchema),
	paymentProvider: z.enum(PaymentMethodSchema), // ???
	printOptions: z
		.object({ product: z.string(), delivery_country_code: z.string() })
		.array()
		.nullable(),
	browserId: z.string().nullable(),
	identityId: z.string(), // 200381287
	pageViewId: z.string(), // m7ezxppo1x1qg5b4q1x8
	referrerPageViewId: z.string().nullable(),
	promoCode: z.string().nullable(),
	queryParameters: z.object({ key: z.string(), value: z.string() }).array(),
	reusedExistingPaymentMethod: z.boolean(),
	acquisitionType: z.string(), // Purchase
	readerType: z.string(), // Direct
	zuoraSubscriptionNumber: z.string().nullable(),
	contributionId: z.string().nullable(), //f7c7aef7-f12d-476b-ba68-5ae79237cd8f
	paymentId: z.string().nullable(), // PAYID-M64KYRY1DX444112D060283M
	product: z.enum(ProductTypeSchema),
	amount: z.number().nullable(),
	currency: z.enum(IsoCurrencySchema),
	source: z.string().nullable(),
	platform: z.string().nullable(), // SUPPORT
	labels: z.string().array(), // one-time-checkout
});

export const AcquisitionProductEventSchema = z.object({
	detail: AcquisitionProductSchema,
});

export type AcquisitionProductEvent = z.infer<
	typeof AcquisitionProductEventSchema
>;
export type AcquisitionProduct = z.infer<typeof AcquisitionProductSchema>;

// TODO: create a test for this function
export const transformAcquisitionProductForBigQuery = (
	acquisitionProduct: AcquisitionProduct,
) => {
	return {
		event_timestamp: acquisitionProduct.eventTimeStamp,
		country_code: acquisitionProduct.country,
		component_id: acquisitionProduct.componentId,
		component_type: acquisitionProduct.componentType,
		campaign_codes: acquisitionProduct.campaignCode
			? [acquisitionProduct.campaignCode]
			: [],
		referrer_url: acquisitionProduct.referrerUrl,
		ab_tests: acquisitionProduct.abTests,
		payment_frequency: acquisitionProduct.paymentFrequency,
		payment_provider: acquisitionProduct.paymentProvider,
		print_options: acquisitionProduct.printOptions,
		browser_id: acquisitionProduct.browserId,
		identity_id: acquisitionProduct.identityId,
		page_view_id: acquisitionProduct.pageViewId,
		referrer_page_view_id: acquisitionProduct.referrerPageViewId,
		promo_code: acquisitionProduct.promoCode,
		query_parameters: acquisitionProduct.queryParameters,
		reused_existing_payment_method:
			acquisitionProduct.reusedExistingPaymentMethod,
		acquisition_type: acquisitionProduct.acquisitionType,
		reader_type: acquisitionProduct.readerType,
		zuora_subscription_number: acquisitionProduct.zuoraSubscriptionNumber,
		contribution_id: acquisitionProduct.contributionId,
		payment_id: acquisitionProduct.paymentId,
	};
};
