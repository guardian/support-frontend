import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testCheckout } from '../test/checkout';

afterEachTasks(test);

test.describe('Checkout', () => {
	[
		{
			product: 'GuardianAdLite',
			ratePlan: 'Monthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
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
			product: 'HomeDelivery',
			ratePlan: 'Everyday',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
		{
			product: 'HomeDelivery',
			ratePlan: 'Sunday',
			paymentType: 'StripeHostedCheckout',
			internationalisationId: 'UK',
		},
		{
			product: 'SubscriptionCard',
			ratePlan: 'Sunday',
			paymentType: 'StripeHostedCheckout',
			internationalisationId: 'UK',
		},
		{
			product: 'NationalDelivery',
			ratePlan: 'Weekend',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
			postCode: 'BN44 3QG', // This postcode only has one delivery agent
		},
		{
			product: 'NationalDelivery',
			ratePlan: 'Weekend',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
			postCode: 'BS6 6QY', // This postcode has multiple delivery agents
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
