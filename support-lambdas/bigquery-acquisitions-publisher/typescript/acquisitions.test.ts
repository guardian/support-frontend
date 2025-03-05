import { describe, expect, it } from 'vitest';
import {
	AcquisitionProduct,
	AcquisitionProductBigQueryType,
	transformAcquisitionProductForBigQuery,
} from './acquisitions';

describe('index', () => {
	it('transformAcquisitionProductForBigQuery', () => {
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
			identityId: '123456789',
			pageViewId: 'm7uglc67vllj2cigko3l',
			referrerPageViewId: null,
			promoCode: 'PROMO',
			queryParameters: [],
			reusedExistingPaymentMethod: false,
			acquisitionType: 'Purchase',
			readerType: 'Direct',
			zuoraSubscriptionNumber: null,
			contributionId: '123456789',
			paymentId: '123456789',
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
			identity_id: '123456789',
			page_view_id: 'm7uglc67vllj2cigko3l',
			referrer_page_view_id: null,
			promo_code: 'PROMO',
			query_parameters: [],
			reused_existing_payment_method: false,
			acquisition_type: 'Purchase',
			reader_type: 'Direct',
			zuora_subscription_number: null,
			contribution_id: '123456789',
			payment_id: '123456789',
			platform: 'SUPPORT',
		};

		expect(
			transformAcquisitionProductForBigQuery(testInputAcquisition),
		).toEqual(testOutputAcquisition);
	});
});
