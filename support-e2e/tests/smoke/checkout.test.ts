import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testCheckout } from '../test/checkout';

afterEachTasks(test);

test.describe('Checkout', () => {
	[
		{
			product: 'SupporterPlus',
			ratePlan: 'Annual',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'eu',
		},
		{
			product: 'TierThree',
			ratePlan: 'DomesticMonthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'uk',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
