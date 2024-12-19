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
			internationalisationId: 'EU',
		},
		{
			product: 'TierThree',
			ratePlan: 'DomesticMonthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
		{
			product: 'GuardianLight',
			ratePlan: 'Monthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
