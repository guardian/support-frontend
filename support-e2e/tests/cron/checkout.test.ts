import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testCheckout } from '../test/checkout';

afterEachTasks(test);

test.describe('Checkout', () => {
	[
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Monthly',
			paymentType: 'PayPal',
			internationalisationId: 'US',
			postCode: '60601',
		},
		{
			product: 'GuardianWeeklyRestOfWorld',
			ratePlan: 'Annual',
			paymentType: 'PayPal',
			internationalisationId: 'INT',
			postCode: '8001',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Quarterly',
			paymentType: 'PayPal',
			internationalisationId: 'UK',
			postCode: 'BN44 3QG',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
