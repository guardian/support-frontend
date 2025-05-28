import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testCheckout } from '../test/checkout';

afterEachTasks(test);

test.describe('Checkout', () => {
	[
		{
			product: 'GuardianAdLite',
			ratePlan: 'Monthly',
			paymentType: 'PayPal',
			internationalisationId: 'UK',
		},
		{
			product: 'SupporterPlus',
			ratePlan: 'Monthly',
			paymentType: 'PayPal',
			internationalisationId: 'AU',
		},
		{
			product: 'TierThree',
			ratePlan: 'DomesticMonthly',
			paymentType: 'PayPal',
			internationalisationId: 'UK',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Monthly',
			paymentType: 'PayPal',
			internationalisationId: 'US',
			postCode: '60601',
		},
		{
			product: 'GuardianWeeklyRestOfWorld',
			ratePlan: 'Annual',
			paymentType: 'PayPal',
			internationalisationId: 'INT',
			postCode: '8001',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Quarterly',
			paymentType: 'PayPal',
			internationalisationId: 'AU',
			postCode: '2000',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
