import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testOneTimeCheckout } from '../test/oneTimeCheckout';

afterEachTasks(test);

test.describe('One-Time Checkout', () => {
	[
		{
			paymentType: 'Credit/Debit card',
			internationalisationId: 'us',
			paymentFrequency: 'ONE_OFF',
		},
	].forEach((testDetails) => {
		testOneTimeCheckout(testDetails);
	});
});
