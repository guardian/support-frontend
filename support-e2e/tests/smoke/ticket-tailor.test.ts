import { test, expect } from '@playwright/test';

test('Ticket Tailor iframe loads correctly', async ({
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

	// Remove test user cookies
	await context.clearCookies({
		name: '_test_username',
		domain: baseURL ? new URL(baseURL).hostname : undefined,
		path: '/',
	});

	// Navigate to the page containing the iframe
	await page.goto('https://support.theguardian.com/uk/events/1347872');

	// Wait for the iframe to be present in the DOM
	const iframe = await page.waitForSelector(
		'iframe[src*="https://tickets.theguardian.live"]',
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
		expect(content).toContain('Westminster');
	}
});
