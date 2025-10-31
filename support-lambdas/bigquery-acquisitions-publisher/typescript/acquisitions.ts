import type { IsoCurrency } from './currencySchema';
import type {
	AcquisitionProduct,
	IsoCountry,
	PaymentFrequency,
	PaymentProvider,
	PrintOptions,
	Product,
} from './schemas';

// This is the shape of the data we'll send to BigQuery
export type FactAcquisitionEventRow = {
	event_timestamp: string;
	product: Product;
	amount?: number | null;
	currency: IsoCurrency;
	country_code: IsoCountry;
	component_id?: string | null;
	component_type?: string | null;
	campaign_codes: [string] | [];
	referrer_url?: string | null;
	ab_tests: Array<{ name: string; variant: string }>;
	payment_frequency: PaymentFrequency;
	payment_provider?: PaymentProvider | null;
	print_options?: { product: string; delivery_country_code: string } | null;
	browser_id?: string | null;
	identity_id?: string | null;
	page_view_id?: string | null;
	referrer_page_view_id?: string | null;
	promo_code?: string | null;
	query_parameters: Array<{ key: string; value: string }>;
	reused_existing_payment_method: boolean;
	acquisition_type: string;
	reader_type: string;
	zuora_subscription_number?: string | null;
	contribution_id?: string | null;
	payment_id?: string | null;
	platform: string | null;
	labels: string[];
	source?: string | null;
};

const mapPlatformName = (name: string): string => {
	switch (name.toLowerCase()) {
		case 'iosnativeapp':
			return 'IOS_NATIVE_APP';
		case 'androidnativeapp':
			return 'ANDROID_NATIVE_APP';
		default:
			return name;
	}
};

const mapPrintOptions = (printOptions: PrintOptions) => {
	if (!printOptions) {
		return null;
	}

	return {
		product: printOptions.product,
		delivery_country_code: printOptions.deliveryCountry,
	};
};

export const transformAcquisitionProductForBigQuery = (
	acquisitionProduct: AcquisitionProduct,
): FactAcquisitionEventRow => {
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
		print_options: mapPrintOptions(acquisitionProduct.printOptions),
		browser_id: acquisitionProduct.browserId,
		identity_id: acquisitionProduct.identityId,
		page_view_id: acquisitionProduct.pageViewId,
		referrer_page_view_id: acquisitionProduct.referrerPageViewId,
		promo_code: acquisitionProduct.promoCode,
		query_parameters: acquisitionProduct.queryParameters.map(
			({ name, value }) => {
				return { key: name, value };
			},
		),
		reused_existing_payment_method:
			acquisitionProduct.reusedExistingPaymentMethod,
		acquisition_type: acquisitionProduct.acquisitionType,
		reader_type: acquisitionProduct.readerType,
		zuora_subscription_number: acquisitionProduct.zuoraSubscriptionNumber,
		contribution_id: acquisitionProduct.contributionId,
		payment_id: acquisitionProduct.paymentId,
		platform: mapPlatformName(acquisitionProduct.platform ?? 'SUPPORT'),
		labels: acquisitionProduct.labels,
		source: acquisitionProduct.source,
	};
};
