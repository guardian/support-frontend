import { describe, expect, it } from 'vitest';
import type {
	FactAcquisitionEventRow} from './acquisitions';
import {
	transformAcquisitionProductForBigQuery,
} from './acquisitions';
import type { AcquisitionProduct } from './schemas';

const baseAcquisitionProduct: AcquisitionProduct = {
	eventTimeStamp: '2025-03-04 12:22:40.378000 UTC',
	country: 'US',
	componentId: null,
	componentType: null,
	campaignCode: 'test',
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
	queryParameters: [{ name: 'test', value: 'testValue' }],
	reusedExistingPaymentMethod: false,
	acquisitionType: 'Purchase',
	readerType: 'Direct',
	zuoraSubscriptionNumber: null,
	contributionId: '123456789',
	paymentId: '123456789',
	product: 'CONTRIBUTION',
	amount: 1.0,
	currency: 'GBP',
	source: 'EMAIL',
	platform: 'IOSNATIVEAPP',
	labels: ['label'],
};

describe('The transformAcquisitionProductForBigQuery function', () => {
	it('transforms an AcquisitionProduct to an AcquisitionDataRow', () => {
		const testInputAcquisition = {
			...baseAcquisitionProduct,
		};

		const got = transformAcquisitionProductForBigQuery(testInputAcquisition);

		const expected: FactAcquisitionEventRow = {
			event_timestamp: '2025-03-04 12:22:40.378000 UTC',
			product: 'CONTRIBUTION',
			amount: 1.0,
			currency: 'GBP',
			country_code: 'US',
			component_id: null,
			component_type: null,
			campaign_codes: ['test'],
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
			query_parameters: [{ key: 'test', value: 'testValue' }],
			reused_existing_payment_method: false,
			acquisition_type: 'Purchase',
			reader_type: 'Direct',
			zuora_subscription_number: null,
			contribution_id: '123456789',
			payment_id: '123456789',
			platform: 'IOS_NATIVE_APP',
			labels: ['label'],
			source: 'EMAIL',
		};
		expect(got).toEqual(expected);
	});

	it('maps print options if present', () => {
		const testInputAcquisition: AcquisitionProduct = {
			...baseAcquisitionProduct,
			printOptions: {
				product: 'GUARDIAN_WEEKLY',
				deliveryCountry: 'GB',
			},
		};

		const got = transformAcquisitionProductForBigQuery(testInputAcquisition);

		expect(got.print_options).toEqual({
			product: 'GUARDIAN_WEEKLY',
			delivery_country_code: 'GB',
		});
	});
});
