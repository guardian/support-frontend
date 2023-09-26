import 'dotenv/config';
import { exec } from 'child_process';
import BrowserStackLocal from 'browserstack-local';

interface BrowserDetails {
	browserName: string;
	browserVersion?: string;
	osName: string;
	osVersion?: string;
}

interface BrowserCapabilities {
	browser: string;
	browser_version?: string;
	os: string;
	os_version: string;
	name: string;
	build: string;
	'browserstack.username': string;
	'browserstack.accessKey': string;
	'browserstack.local': boolean;
	'client.playwrightVersion': string;
}

const clientPlaywrightVersion = exec('npx playwright --version')
	.toString()
	.trim()
	.split(' ')[1] as string;

const caps: BrowserCapabilities = {
	browser: 'chrome',
	os: 'osx',
	os_version: 'catalina',
	name: 'My first playwright test',
	build: 'playwright-build',
	'browserstack.username': process.env.BROWSERSTACK_USERNAME ?? '',
	'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY ?? '',
	'browserstack.local': false,
	'client.playwrightVersion': clientPlaywrightVersion,
};

export const bsLocal = new BrowserStackLocal.Local();

export const BS_LOCAL_ARGS = {
	key: process.env.BROWSERSTACK_ACCESS_KEY,
};

const patchCaps = (browserDetails: BrowserDetails, title: string) => {
	caps.browser = browserDetails.browserName;
	caps.browser_version = browserDetails.browserVersion ?? 'latest';
	caps.os = browserDetails.osName;
	caps.os_version = browserDetails.osVersion ?? 'latest';
	caps.name = title;
};

export const getCdpEndpoint = (
	browserDetails: BrowserDetails,
	title: string,
) => {
	patchCaps(browserDetails, title);
	const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
		JSON.stringify(caps),
	)}`;
	console.log(`--> ${cdpUrl}`);
	return cdpUrl;
};
