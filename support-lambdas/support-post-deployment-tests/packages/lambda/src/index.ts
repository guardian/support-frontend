import { exec } from 'child_process';
import util from 'util';
import fetch from 'node-fetch';

const execPromise = util.promisify(exec);

export async function main() {
	try {
		const { stdout, stderr } = await execPromise(
			`npx playwright test --config=${__dirname}/src/playwright/playwright.browserstack.config.js`,
		);
		console.log('stdout:', stdout);
		console.log('stderr:', stderr);
	} catch (e) {
		console.error(e);
		/*
		const chatErrorMessage =
			'❌ The post deployment tests for support frontend have failed! <users/all> \n 🤖 <https://automate.browserstack.com/dashboard/v2/builds/31f35a1d9bccc9d45360aa7bfd651fcd9e1499d0|Browser stack test results> \n \n 📖 <https://github.com/guardian/support-frontend/wiki/Post-deployment-test-runbook|Check the runbook for a step by step guide>';
		await postToGoogleChat(chatErrorMessage);
    */
	}
}

async function postToGoogleChat(message: string) {
	const webhookURL = process.env.GOOGLE_CHAT_WEB_HOOK ?? '';

	const data = JSON.stringify({
		text: message,
	});
	try {
		await fetch(webhookURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: data,
		});
	} catch (error) {
		console.log(error);
	}
}
