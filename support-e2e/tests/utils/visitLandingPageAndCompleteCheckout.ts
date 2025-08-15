import { BrowserContext, expect, Page } from '@playwright/test';
import { setupPage } from './page';
import { completeGenericCheckout } from './completeGenericCheckout';

type TestDetails = {
	context: BrowserContext;
	baseURL: string;
	product: string;
	paymentType: string;
	internationalisationId: string;
	ratePlan?: string;
	postCode?: string;
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
		ratePlan,
		postCode,
	} = testDetails;
	const page = await context.newPage();
	await setupPage(page, context, baseURL, landingPagePath);

	// Callback provides transition from landing page to checkout
	await landingPageToCheckoutFn(page);

	// Wait for the checkout page to load
	await expect(
		page.getByRole('heading', { name: 'Your subscription' }),
	).toBeVisible({
		timeout: 100000,
	});

	await completeGenericCheckout(page, {
		product,
		ratePlan,
		paymentType,
		internationalisationId,
		postCode,
	});
};
