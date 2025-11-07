import { test } from '@playwright/test';
import { testOneTimeCheckout } from '../test/oneTimeCheckout';
import { afterEachTasks } from '../utils/afterEachTest';

afterEachTasks(test);

test.describe('One-Time Checkout', () => {
	[
		{
			paymentType: 'PayPal',
			internationalisationId: 'au',
		},
	].forEach((testDetails) => {
		testOneTimeCheckout(testDetails);
	});
});
