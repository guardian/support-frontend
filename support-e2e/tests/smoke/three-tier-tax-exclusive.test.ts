import test, { expect } from '@playwright/test';
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
		productLabel: ProductTierLabel.TierTwo,
		product: 'SupporterPlus',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
		stateId: 'QC',
		promoCode: 'TAX_EXCLUSIVE_SP',
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
			stateId,
			promoCode,
		} = testDetails;

		const promoUrlParam = promoCode ? `?promoCode=${promoCode}` : '';
		const promoCodeDescription = promoCode ? ` - ${promoCode}` : '';
		const stateDescription = stateId ? `/${stateId}` : '';
		test(`Three Tier - ${product} - ${billingFrequency} - ${paymentType}${promoCodeDescription} - ${internationalisationId}${stateDescription}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/contribute${promoUrlParam}`,
				{
					context,
					baseURL,
					product,
					paymentType,
					internationalisationId,
					stateId,
				},
				async (page) => {
					// 1. Select the billing frequency
					await page.getByRole('tab', { name: billingFrequency }).click();

					// 2. Make sure it links to a tax exclusive rate plan
					const cta = page.getByRole('link', {
						name: new RegExp(`^${productLabel},`),
					});

					// Use a web-first assertion so Playwright retries until the CTA's
					// href reflects the selected billing frequency (the href updates
					// asynchronously after the tab click).
					await expect(cta).toHaveAttribute(
						'href',
						new RegExp(`ratePlan=${billingFrequency}TaxExclusive`),
					);

					// 3. Click through to the checkout (we use the aria-label to target the link)
					await cta.click();
				},
			);
		});
	}));
