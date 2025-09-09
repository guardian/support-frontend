import { test, expect } from '@playwright/test';

const isProd = (baseURL: string): boolean => {
	try {
		return new URL(baseURL).hostname === 'support.theguardian.com';
	} catch {
		return false;
	}
};

const eventIdFromBaseURL = (baseURL: string): string => {
	const prodE2EEventId = '1428771';
	const codeE2EEventId = '1354460';
	if (isProd(baseURL)) {
		return prodE2EEventId;
	} else {
		return codeE2EEventId;
	}
};

const iframeSrcFromBaseUrl = (baseURL: string): string => {
	const prodIframeSrc = 'https://tickets.theguardian.live';
	const codeIframeSrc = 'https://www.tickettailor.com';
	if (isProd(baseURL)) {
		return prodIframeSrc;
	} else {
		return codeIframeSrc;
	}
};

// Skip this for now. This test is reliably failing when run in CI (though is
// fine when run locally). We're still investigating the cause.
test.skip('Ticket Tailor iframe loads correctly', async ({
	page,
	context,
	baseURL,
}) => {
	// Avoid CMP
	await context.addCookies([
		{
			name: '_post_deploy_user',
			value: 'true',
			domain: baseURL ? new URL(baseURL).hostname : undefined,
			path: '/',
		},
	]);

	// Remove test user cookie
	await context.clearCookies({
		name: '_test_username',
		domain: baseURL ? new URL(baseURL).hostname : undefined,
		path: '/',
	});

	// Navigate to the page containing the iframe
	await page.goto(`${baseURL}/uk/events/${eventIdFromBaseURL(baseURL)}`);

	// Wait for the iframe to be present in the DOM
	const iframe = await page.waitForSelector(
		`iframe[src*="${iframeSrcFromBaseUrl(baseURL)}"]`,
	);

	// Check if the iframe is visible
	expect(await iframe.isVisible()).toBeTruthy();

	// Get the iframe contentFrame
	const frame = await iframe.contentFrame();

	// Check if the frame is loaded
	expect(frame).not.toBeNull();

	// Check for specific content within the iframe
	if (frame) {
		await frame.waitForSelector('body');
		const content = await frame.content();
		expect(content).toContain('EndToEnd Test Event');
	}
});
