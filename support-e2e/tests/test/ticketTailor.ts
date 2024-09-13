import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { setupPage } from '../utils/page';

type TestDetails = {
	internationalisationId: string;
	eventId: string;
};

export const testTicketTailor = (testDetails: TestDetails) => {
	const { internationalisationId, eventId } = testDetails;

	test(`${internationalisationId.toUpperCase()} event ${eventId}`, async ({
		context,
		baseURL,
	}) => {
		const url = `/${internationalisationId}/events/${eventId}`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, url);

		// -------- iFrame Locator Notes (wip) ---------
		// page.frameLocator(
		//    "iframe"
		//    "iframe[name^/title^='']"
		//    "iframe[url^='https://www.tickettailor.com/events/guardianlivecode/1354460/book']" -> ? Possible ?
		//  )
		//  .first() / .nth(*) / .last()
		//  .locator(
		//      'body.dom-ready' => ? Possible, class gets added to the iframe body after the JavaScript has finished executing ?
		//      '[role="heading"]:has-text["CODE"]' Or .getByRole('heading', { name: `CODE` }) Or .getByText('CODE')
		//      '[role="link"]:has-text["Next"]' Or .getByRole('link', { name: `Next` })
		//      '#<Name>'

		const iFrame = page.frameLocator('iframe').first();
		await expect(
			iFrame.locator('[role="heading"]:has-text["CODE"]'),
		).toBeVisible({
			timeout: 10000,
		});
		await iFrame.locator('#submit').click({ delay: 2000 });
		await iFrame
			.frameLocator('iframe')
			.first()
			.getByLabel('First name')
			.fill(firstName());
		await iFrame.getByLabel('Last name').fill(lastName());
		await iFrame.getByLabel('Email').fill(email());
		await iFrame.getByLabel('Repeat Email').fill(email());
		await iFrame.locator('#submit').click({ delay: 2000 });
		await expect(
			iFrame.locator(
				'[role="link"]:has-text["Click here to complete this order"]',
			),
		).toBeVisible({
			timeout: 10000,
		});
	});
};
