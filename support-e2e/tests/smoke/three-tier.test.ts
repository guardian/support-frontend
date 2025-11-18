import test from '@playwright/test';
import { forceSkipNewOnboardingExperience } from '../utils/forceSkipNewOnboardingExperience';
import { ProductTierLabel } from '../utils/products';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		productLabel: ProductTierLabel.TierOne,
		product: 'Contribution',
		billingFrequency: 'Monthly',
		paymentType: 'Direct debit',
		internationalisationId: 'UK',
	},
	{
		productLabel: ProductTierLabel.TierOne,
		product: 'Contribution',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
	},
	{
		productLabel: ProductTierLabel.TierTwo,
		product: 'SupporterPlus',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'US',
	},
	{
		productLabel: ProductTierLabel.TierThree,
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
