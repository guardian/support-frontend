import cp from 'child_process';
import BrowserStackLocal from 'browserstack-local';
import { getConfig } from '../config';

const clientPlaywrightVersion = cp
	.execSync('npx playwright --version')
	.toString()
	.trim()
	.split(' ')[1];

const { browserstack_username, browserstack_access_key } = getConfig();

// BrowserStack Specific Capabilities.
// Set 'browserstack.local:true For Local testing
const caps = {
	browser: 'chrome',
	os: 'osx',
	os_version: 'catalina',
	name: 'My first playwright test',
	build: 'playwright-build',
	'browserstack.username': browserstack_username,
	'browserstack.accessKey': browserstack_access_key,
	'browserstack.local': process.env.BROWSERSTACK_LOCAL ?? true,
	'client.playwrightVersion': clientPlaywrightVersion,
};

export const bsLocal = new BrowserStackLocal.Local();

export const BS_LOCAL_ARGS = {
	key: browserstack_access_key,
};

// Patching the capabilities dynamically according to the project name.
const patchCaps = (name: string, title: string) => {
	const combination: string | undefined = name.split(/@browserstack/)[0];
	const [browerCaps, osCaps] = combination?.split(/:/) ?? [];
	const [browser, browser_version] = browerCaps?.split(/@/) ?? [];
	const osCapsSplit = osCaps?.split(/ /) ?? [];
	const os = osCapsSplit.shift();
	const os_version = osCapsSplit.join(' ');
	caps.browser = browser ? browser : 'chrome';
	caps.os_version = browser_version ? browser_version : 'latest';
	caps.os = os ? os : 'osx';
	caps.os_version = os_version ? os_version : 'catalina';
	caps.name = title;
};

export const getCdpEndpoint = (name: string, title: string) => {
	patchCaps(name, title);
	const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
		JSON.stringify(caps),
	)}`;
	console.log(`--> ${cdpUrl}`);
	return cdpUrl;
};
