import 'dotenv/config';
import { execSync } from 'child_process';
import BrowserStackLocal from 'browserstack-local';
import { Page } from '@playwright/test';

interface BrowserDetails {
	browser: string;
	browser_version: string;
	os: string;
	os_version: string;
  name: string;
}

const clientPlaywrightVersion = execSync('npx playwright --version')
	.toString()
	.trim()
	.split(' ')[1] as string;

const browserStackProperties = {
	'browserstack.username': process.env.BROWSERSTACK_USERNAME ?? '',
	'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY ?? '',
	'browserstack.local': false,
	'browserstack.geoLocation': 'GB',
	'client.playwrightVersion': clientPlaywrightVersion,
}

export const bsLocal = new BrowserStackLocal.Local();

export const BS_LOCAL_ARGS = {
	key: process.env.BROWSERSTACK_ACCESS_KEY,
};

export const getCdpEndpoint = (
	browserDetails: BrowserDetails,
) => {
  const latestCommitID = execSync("git rev-parse --short HEAD").toString().trim();
  const niceDateStringNow = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(new Date());
  const caps = {
    ...browserStackProperties,
    ...browserDetails,
    build: `playwright-build-${latestCommitID}`,
    name: `playwright E2E test - ${niceDateStringNow}`
  };
	const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
		JSON.stringify(caps),
	)}`;
	console.log(`--> ${cdpUrl}`);
	return cdpUrl;
};

export const markTest = (page:Page, status:string, reason:string) => {
    return page.evaluate(
        _ => {},
        `browserstack_executor: ${JSON.stringify({
            action: 'setSessionStatus',
            arguments: { status, reason }
        })}`);
}
