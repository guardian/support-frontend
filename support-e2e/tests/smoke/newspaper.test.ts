import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		productLabel: 'Home Delivery',
		product: 'HomeDelivery',
		ratePlanLabel: 'Every day',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
	},
	{
		productLabel: 'Home Delivery',
		product: 'HomeDelivery',
		ratePlanLabel: 'Saturday',
		paymentType: 'Direct debit',
		internationalisationId: 'UK',
	},
	{
		productLabel: 'Home Delivery',
		product: 'HomeDelivery',
		ratePlanLabel: 'Six day',
		paymentType: 'Direct debit',
		internationalisationId: 'UK',
	},
	{
		productLabel: 'Home Delivery',
		product: 'NationalDelivery',
		ratePlanLabel: 'Every day',
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
	tests.map((testDetails) => {
		const {
			product,
			productLabel,
			paymentType,
			internationalisationId,
			postCode,
			ratePlanLabel,
		} = testDetails;

		test(`Newspaper - ${product} - ${ratePlanLabel} - ${paymentType} - ${internationalisationId} ${postCode ? `- ${postCode}` : ''}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/subscribe/paper`,
				{
					context,
					baseURL,
					product,
					paymentType,
					internationalisationId,
					postCode,
				},
				async (page) => {
					// Transition from landing page to checkout:

					// 1. Select the product (Home Delivery or Subscription Card)
					await page.getByRole('tab', { name: productLabel }).click();

					// 2. Click through to the checkout (we use the aria-label to target the link)
					await page
						.getByLabel(`${ratePlanLabel}- Subscribe`, { exact: true })
						.click();
				},
			);
		});
	}));
