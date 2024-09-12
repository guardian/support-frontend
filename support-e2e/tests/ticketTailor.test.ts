import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from './utils/users';
import { setTicketTailorTestUserRequiredDetails } from './utils/testUserDetails';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';

/** These have been covered in smoke/cron tests */
const testDetails = [
	{
		internationalisationId: 'uk',
		eventId: '4467889',
	},
] as const;

afterEachTasks(test);

test.describe('Ticket Tailor', () => {
	testDetails.forEach((testDetails) => {
		const { internationalisationId, eventId } = testDetails;

		test(`event ${eventId} in ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			const url = `/${internationalisationId}/events/${eventId}`;
			const page = await context.newPage();
			await setupPage(page, context, baseURL, url);

			await page
				.locator("iframe[id^='tt-iframe-408503']")
				.scrollIntoViewIfNeeded();
			await page
				.frameLocator("iframe[id^='tt-iframe-408503']")
				// this class gets added to the iframe body after the JavaScript has finished executing
				.locator('body.dom-ready')
				.locator('[role="button"]:has-text("Next")') //?input?
				.click({ delay: 2000 });

			const testFirstName = firstName();
			const testLastName = lastName();
			const testEmail = email();

			await setTicketTailorTestUserRequiredDetails(
				page,
				testFirstName,
				testLastName,
				testEmail,
			);
			await page.getByRole('button', { name: `Next` }).click();

			await page
				.getByRole('button', { name: `Click here to complete this order` })
				.click();

			await expect(
				page.getByRole('heading', { name: 'Order complete' }),
			).toBeVisible({
				timeout: 600000,
			});
		});
	});
});
