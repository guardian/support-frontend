import { test } from '@playwright/test';
import { afterEachTasks } from './utils/afterEachTest';
import { testOneTimeCheckout } from './test/oneTimeCheckout';

/** These have been covered in smoke/cron tests */
const testDetails = [
	{
		paymentType: 'PayPal',
		internationalisationId: 'uk',
	},
	{
		paymentType: 'Credit/Debit card',
		internationalisationId: 'us',
	},
] as const;

afterEachTasks(test);

test.describe('Generic One-Time Checkout', () => {
	testDetails.forEach((testDetails) => {
		testOneTimeCheckout(testDetails);
	});
});
