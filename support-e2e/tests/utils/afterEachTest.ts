import type {
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
	TestType,
} from '@playwright/test';

export const afterEachTasks = (
	test: TestType<
		PlaywrightTestArgs & PlaywrightTestOptions,
		PlaywrightWorkerArgs & PlaywrightWorkerOptions
	>,
) => {
	test.afterEach(async ({ page, context }, testInfo) => {
		if (process.env.RUNNING_IN_BROWSERSTACK) {
			if (testInfo.status) {
				await page.evaluate(
					() => {},
					`browserstack_executor: ${JSON.stringify({
						action: 'setSessionStatus',
						arguments: { status: testInfo.status },
					})}`,
				);
			}
		}
		for (const page1 of context.pages()) {
			await page1.close();
		}
	});
};
