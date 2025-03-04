import { z } from 'zod';
import {
	ProductTypeSchema,
	IsoCountrySchema,
	IsoCurrencySchema,
	ContributionTypeSchema,
	PaymentMethodSchema,
	IsoCountryType,
	ContributionType,
	ProductType,
	IsoCurrencyType,
	PaymentMethodType,
} from './dependencies';

// Items to write to BigQuery (datalake:fact_acquisition_event)
export const AcquisitionProductSchema = z.object({
	eventTimeStamp: z.string(),
	country: z.enum(IsoCountrySchema),
	componentId: z.string().nullable(),
	componentType: z.string().nullable(),
	campaignCode: z.string().nullable(),
	referrerUrl: z.string().nullable(),
	abTests: z.object({ name: z.string(), variant: z.string() }).array(),
	paymentFrequency: z.enum(ContributionTypeSchema),
	paymentProvider: z.enum(PaymentMethodSchema), // ???
	printOptions: z
		.object({ product: z.string(), delivery_country_code: z.string() })
		.array()
		.nullable(),
	browserId: z.string().nullable(),
	identityId: z.string(),
	pageViewId: z.string(),
	referrerPageViewId: z.string().nullable(),
	promoCode: z.string().nullable(),
	queryParameters: z.object({ key: z.string(), value: z.string() }).array(),
	reusedExistingPaymentMethod: z.boolean(),
	acquisitionType: z.string(),
	readerType: z.string(),
	zuoraSubscriptionNumber: z.string().nullable(),
	contributionId: z.string().nullable(),
	paymentId: z.string().nullable(),
	product: z.enum(ProductTypeSchema),
	amount: z.number().nullable(),
	currency: z.enum(IsoCurrencySchema),
	source: z.string().nullable(),
	platform: z.string().nullable(),
	labels: z.string().array(),
});
export type AcquisitionProduct = z.infer<typeof AcquisitionProductSchema>;
export const AcquisitionProductEventSchema = z.object({
	detail: AcquisitionProductSchema,
});
export type AcquisitionProductEvent = z.infer<
	typeof AcquisitionProductEventSchema
>;

export type AcquisitionProductBigQueryType = {
	event_timestamp: string;
	product: ProductType;
	amount: number | null;
	currency: IsoCurrencyType;
	country_code: IsoCountryType;
	component_id: string | null;
	component_type: string | null;
	campaign_codes: [string] | [];
	referrer_url: string | null;
	ab_tests: { name: string; variant: string }[];
	payment_frequency: ContributionType;
	payment_provider: PaymentMethodType;
	print_options: { product: string; delivery_country_code: string }[] | null;
	browser_id: string | null;
	identity_id: string;
	page_view_id: string;
	referrer_page_view_id: string | null;
	promo_code: string | null;
	query_parameters: { key: string; value: string }[];
	reused_existing_payment_method: boolean;
	acquisition_type: string;
	reader_type: string;
	zuora_subscription_number: string | null;
	contribution_id: string | null;
	payment_id: string | null;
	platform: string | null;
};

export const transformAcquisitionProductForBigQuery = (
	acquisitionProduct: AcquisitionProduct,
): AcquisitionProductBigQueryType => {
	return {
		event_timestamp: acquisitionProduct.eventTimeStamp,
		product: acquisitionProduct.product,
		amount: acquisitionProduct.amount,
		currency: acquisitionProduct.currency,
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
		// TODO: map to key/value like the Scala code
		query_parameters: acquisitionProduct.queryParameters,
		reused_existing_payment_method:
			acquisitionProduct.reusedExistingPaymentMethod,
		acquisition_type: acquisitionProduct.acquisitionType,
		reader_type: acquisitionProduct.readerType,
		zuora_subscription_number: acquisitionProduct.zuoraSubscriptionNumber,
		contribution_id: acquisitionProduct.contributionId,
		payment_id: acquisitionProduct.paymentId,
		// TODO: Pull in the mappings from the Scala code (e.g. iOS/Android)
		platform: acquisitionProduct.platform || 'SUPPORT',
	};
};
