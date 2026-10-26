import { test } from '@playwright/test';
import { testOneTimeCheckout } from '../test/oneTimeCheckout';
import { afterEachTasks } from '../utils/afterEachTest';

afterEachTasks(test);

test.describe('One-Time Checkout', () => {
	[
		{
			paymentType: 'PayPal',
			internationalisationId: 'au',
			maxAmount: 25000,
		},
	].forEach((testDetails) => {
		testOneTimeCheckout(testDetails);
	});
});
