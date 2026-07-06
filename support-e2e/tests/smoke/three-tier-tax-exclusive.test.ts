import test, { expect } from '@playwright/test';
import { enableCanadaTaxExclusion } from '../utils/enableTaxExclusiveRatePlans';
import { ProductTierLabel } from '../utils/products';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		productLabel: ProductTierLabel.TierTwo,
		product: 'SupporterPlus',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
	},
	{
		productLabel: ProductTierLabel.TierTwo,
		product: 'SupporterPlus',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
	},
	{
		productLabel: ProductTierLabel.TierThree,
		product: 'DigitalSubscription',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
	},
	{
		productLabel: ProductTierLabel.TierThree,
		product: 'DigitalSubscription',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
	},
];

test.describe('Three Tier Tax Exclusive Checkout', () =>
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
			await enableCanadaTaxExclusion(context);
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/contribute`,
				{ context, baseURL, product, paymentType, internationalisationId },
				async (page) => {
					// 1. Select the billing frequency
					await page.getByRole('tab', { name: billingFrequency }).click();

					// 2. Make sure it links to a tax exclusive rae plan
					const cta = page.getByRole('link', {
						name: new RegExp(`^${productLabel},`),
					});

					expect(await cta.getAttribute('href')).toContain(
						`ratePlan=${billingFrequency}TaxExclusive`,
					);

					// 2. Click through to the checkout (we use the aria-label to target the link)
					await cta.click();
				},
			);
		});
	}));
