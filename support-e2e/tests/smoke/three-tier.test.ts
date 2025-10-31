import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';
import { forceSkipNewOnboardingExperience } from '../utils/forceSkipNewOnboardingExperience';
import {
	tierOneProductLabel,
	tierThreeProductLabel,
	tierTwoProductLabel,
} from '../utils/products';

const tests = [
	{
		productLabel: tierOneProductLabel,
		product: 'Contribution',
		billingFrequency: 'Monthly',
		paymentType: 'Direct debit',
		internationalisationId: 'UK',
	},
	{
		productLabel: tierOneProductLabel,
		product: 'Contribution',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
	},
	{
		productLabel: tierTwoProductLabel,
		product: 'SupporterPlus',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'US',
	},
	{
		productLabel: tierThreeProductLabel,
		product: 'TierThree',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'EU',
	},
];

test.describe('Three Tier Checkout', () =>
	tests.map((testDetails) => {
		const {
			billingFrequency,
			product,
			paymentType,
			internationalisationId,
			productLabel,
		} = testDetails;

		test(`Three Tier - ${product} - ${billingFrequency} - ${paymentType} - ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/contribute`,
				{ context, baseURL, product, paymentType, internationalisationId },
				async (page) => {
					// Transition from landing page to checkout:

					await forceSkipNewOnboardingExperience(page);

					// 1. Select the billing frequency
					await page.getByRole('tab', { name: billingFrequency }).click();

					// 2. Click through to the checkout (we use the aria-label to target the link)
					await page.getByLabel(productLabel, { exact: true }).click();
				},
			);
		});
	}));
