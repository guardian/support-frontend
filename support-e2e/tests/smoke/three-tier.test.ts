import test from '@playwright/test';
import { testThreeTierCheckout } from '../test/threeTierCheckout';
import type { TestDetails } from '../test/threeTierCheckout';

const tests: TestDetails[] = [
	{
		productLabel: 'All-access digital',
		product: 'SupporterPlus',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'EU',
	},
	{
		productLabel: 'Digital + print',
		product: 'TierThree',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
	},
];

test.describe('Three Tier Checkout', () =>
	tests.map((testDetails) => testThreeTierCheckout(testDetails)));
