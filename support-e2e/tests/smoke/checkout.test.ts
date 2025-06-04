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
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Monthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
			postCode: 'BS6 6QY',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Annual',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
			postCode: 'BS6 6QY',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Quarterly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
			postCode: 'BN44 3QG',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Monthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'US',
			postCode: '60601',
		},
		{
			product: 'GuardianWeeklyRestOfWorld',
			ratePlan: 'Annual',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'INT',
			postCode: '8001',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Quarterly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'AU',
			postCode: '2000',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
