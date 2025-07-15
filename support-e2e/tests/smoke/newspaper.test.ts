import test from '@playwright/test';
import { testNewspaperCheckout } from '../test/newspaperCheckout';
import type { TestDetails } from '../test/newspaperCheckout';

const tests: TestDetails[] = [
	{
		productLabel: 'Home Delivery',
		product: 'HomeDelivery',
		ratePlanLabel: 'Every day',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
	},
	{
		productLabel: 'Home Delivery',
		product: 'NationalDelivery',
		ratePlanLabel: 'Weekend',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
		postCode: 'BN44 3QG', // This postcode only has one delivery agent
	},
	{
		productLabel: 'Home Delivery',
		product: 'NationalDelivery',
		ratePlanLabel: 'Weekend',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
		postCode: 'BS6 6QY', // This postcode has multiple delivery agents
	},
];

test.describe('Newspaper Checkout', () =>
	tests.map((testDetails) => testNewspaperCheckout(testDetails)));
