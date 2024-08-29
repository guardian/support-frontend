import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testCheckout } from '../test/checkout.test';

afterEachTasks(test);

test.describe('Checkout', () => {
	[
		{
			product: 'SupporterPlus',
			ratePlan: 'Annual',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'eu',
			paymentFrequency: 'year',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
