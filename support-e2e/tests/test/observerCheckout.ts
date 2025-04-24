import { expect, test } from '@playwright/test';
import { setupPage } from '../utils/page';
import { setTestUserAddressDetails } from '../utils/testUserDetails';
import { ukWithPostalAddressOnly } from '../utils/userFields';

type TestDetails = {
	product: string;
	ratePlan: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
};

export const testObserverCheckout = (testDetails: TestDetails) => {
	const { internationalisationId, product, ratePlan, paymentType, postCode } =
		testDetails;
	const testName = `${product} ${ratePlan} with ${paymentType} in ${internationalisationId} ${
		postCode ? `with postcode ${postCode}` : ''
	}`;

	test(testName, async ({ context, baseURL }) => {
		const url = `/${internationalisationId.toLowerCase()}/checkout?product=${product}&ratePlan=${ratePlan}`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, url);

		// Fill checkout form and submit
		await setTestUserAddressDetails(
			page,
			ukWithPostalAddressOnly(),
			internationalisationId,
			3,
		);
		await page.getByRole('radio', { name: paymentType }).check();
		await page
			.getByRole('button', {
				name: `Pay`,
			})
			.click();

		// goto Stripe checkout page
		await page.waitForURL('https://checkout.stripe.com/**');
		await expect(page.getByText('Enter payment details')).toBeVisible();

		// fill in Stripe chekout form and sumbit
		await page.locator('input[name="cardNumber"]').fill('4242424242424242');
		await page.locator('input[name="cardExpiry"]').fill('01/50');
		await page.locator('input[name="cardCvc"]').fill('123');
		await page.locator('input[name="billingName"]').fill('Jhon Doe');
		await page.getByRole('button').click();

		// Expect to see the thank you page
		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});
	});
};
