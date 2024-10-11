import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testOneTimeCheckout } from '../test/checkoutOneTime';

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
