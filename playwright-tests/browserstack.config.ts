import 'dotenv/config';
import { exec } from 'child_process';
import BrowserStackLocal from 'browserstack-local';

interface BrowserDetails {
	browser: string;
	browser_version: string;
	os: string;
	os_version: string;
  name: string;
}

const clientPlaywrightVersion = exec('npx playwright --version')
	.toString()
	.trim()
	.split(' ')[1] as string;

const browserStackProperties = {
	'browserstack.username': process.env.BROWSERSTACK_USERNAME ?? '',
	'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY ?? '',
	'browserstack.local': false,
	'client.playwrightVersion': clientPlaywrightVersion,
	build: 'playwright-build',
}

export const bsLocal = new BrowserStackLocal.Local();

export const BS_LOCAL_ARGS = {
	key: process.env.BROWSERSTACK_ACCESS_KEY,
};

export const getCdpEndpoint = (
	browserDetails: BrowserDetails,
) => {
  const caps = {...browserStackProperties, ...browserDetails}
	const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
		JSON.stringify(caps),
	)}`;
	console.log(`--> ${cdpUrl}`);
	return cdpUrl;
};
