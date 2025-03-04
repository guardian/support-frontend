import {
	AcquisitionProduct,
	AcquisitionProductBigQueryType,
	transformAcquisitionProductForBigQuery,
} from './acquisitions';

describe('index', () => {
	const testInputAcquisition: AcquisitionProduct = {
		eventTimeStamp: '2025-03-04 12:22:40.378000 UTC',
		country: 'US',
		componentId: null,
		componentType: null,
		campaignCode: null,
		referrerUrl: null,
		abTests: [{ name: 'test', variant: 'variant' }],
		paymentFrequency: 'ONE_OFF',
		paymentProvider: 'STRIPE',
		printOptions: null,
		browserId: null,
		identityId: '200131218',
		pageViewId: 'm7uglc67vllj2cigko3l',
		referrerPageViewId: null,
		promoCode: 'PROMO',
		queryParameters: [],
		reusedExistingPaymentMethod: false,
		acquisitionType: 'Purchase',
		readerType: 'Direct',
		zuoraSubscriptionNumber: null,
		contributionId: '487f7eb6-fd4e-4eb2-97ab-f800bf6d655d',
		paymentId: 'ch_3QyuUdCbpG0cQtlb0shCfEF6',
		product: 'CONTRIBUTION',
		amount: 1.0,
		currency: 'GBP',
		source: null,
		platform: 'SUPPORT',
		labels: ['label'],
	};

	const testOutputAcquisition: AcquisitionProductBigQueryType = {
		event_timestamp: '2025-03-04 12:22:40.378000 UTC',
		product: 'CONTRIBUTION',
		amount: 1.0,
		currency: 'GBP',
		country_code: 'US',
		component_id: null,
		component_type: null,
		campaign_codes: [],
		referrer_url: null,
		ab_tests: [{ name: 'test', variant: 'variant' }],
		payment_frequency: 'ONE_OFF',
		payment_provider: 'STRIPE',
		print_options: null,
		browser_id: null,
		identity_id: '200131218',
		page_view_id: 'm7uglc67vllj2cigko3l',
		referrer_page_view_id: null,
		promo_code: 'PROMO',
		query_parameters: [],
		reused_existing_payment_method: false,
		acquisition_type: 'Purchase',
		reader_type: 'Direct',
		zuora_subscription_number: null,
		contribution_id: '487f7eb6-fd4e-4eb2-97ab-f800bf6d655d',
		payment_id: 'ch_3QyuUdCbpG0cQtlb0shCfEF6',
		platform: 'SUPPORT',
	};

	test('example test', () => {
		expect(1 + 1).toBe(2);
	});

	test('transformAcquisitionProductForBigQuery', () => {
		expect(
			transformAcquisitionProductForBigQuery(testInputAcquisition),
		).toEqual(testOutputAcquisition);
	});
});
