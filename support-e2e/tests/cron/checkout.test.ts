import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testCheckout } from '../test/checkout';

afterEachTasks(test);

test.describe('Checkout', () => {
	[
		{
			product: 'GuardianAdLight',
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
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
