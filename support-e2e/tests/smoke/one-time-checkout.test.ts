import { test } from '@playwright/test';
import { testOneTimeCheckout } from '../test/oneTimeCheckout';
import { afterEachTasks } from '../utils/afterEachTest';

afterEachTasks(test);

test.describe('One-Time Checkout', () => {
	[
		{
			paymentType: 'Credit/Debit card',
			internationalisationId: 'uk',
		},
	].forEach((testDetails) => {
		testOneTimeCheckout(testDetails);
	});
});
