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
			ratePlan: 'EverydayPlus',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
		{
			product: 'NationalDelivery',
			ratePlan: 'WeekendPlus',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
			postCode: 'BN44 3QG', // This postcode only has one delivery agent
		},
		{
			product: 'NationalDelivery',
			ratePlan: 'WeekendPlus',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
			postCode: 'BS6 6QY', // This postcode has multiple delivery agents
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Monthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Annual',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Quarterly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'UK',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Monthly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'US',
		},
		{
			product: 'GuardianWeeklyRestOfWorld',
			ratePlan: 'Annual',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'INT',
		},
		{
			product: 'GuardianWeeklyDomestic',
			ratePlan: 'Quarterly',
			paymentType: 'Credit/Debit card',
			internationalisationId: 'AU',
		},
	].forEach((testDetails) => {
		testCheckout(testDetails);
	});
});
