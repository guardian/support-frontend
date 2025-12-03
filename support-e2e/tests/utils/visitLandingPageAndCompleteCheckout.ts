import type { BrowserContext, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { completeGenericCheckout } from './completeGenericCheckout';
import { setupPage } from './page';
import { isPrintProduct } from './products';

type TestDetails = {
	context: BrowserContext;
	baseURL?: string;
	product: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
	ratePlan?: string;
};

export const visitLandingPageAndCompleteCheckout = async (
	landingPagePath: string,
	testDetails: TestDetails,
	landingPageToCheckoutFn: (path: Page) => Promise<void>,
) => {
	const {
		context,
		baseURL,
		product,
		paymentType,
		internationalisationId,
		postCode,
		ratePlan,
	} = testDetails;
	const page = await context.newPage();
	await setupPage(page, context, baseURL, landingPagePath);

	// Callback provides transition from landing page to checkout
	await landingPageToCheckoutFn(page);

	// Wait for the checkout page to load
	const title = `Your ${isPrintProduct(product) ? 'subscription' : 'support'}`;
	await expect(page.getByRole('heading', { name: title })).toBeVisible({
		timeout: 100000,
	});

	await completeGenericCheckout(page, {
		product,
		paymentType,
		internationalisationId,
		postCode,
		ratePlan,
	});
};
