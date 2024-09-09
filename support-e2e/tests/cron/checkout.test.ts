import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testCheckout } from '../test/checkout';

afterEachTasks(test);

test.describe('Checkout', () => {
	[
		{
			product: 'SupporterPlus',
			ratePlan: 'Monthly',
			paymentType: 'PayPal',
			internationalisationId: 'au',
			paymentFrequency: 'month',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
