// ----- Imports ----- //

import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { getBaseDomain } from 'helpers/urls/url';

// ----- Types ----- //

// ----- Setup ----- //

const patronsUrl = 'https://patrons.theguardian.com';
const patronsUrlUS =
	'https://manage.theguardian.com/help-centre/article/contribute-another-way';
const defaultIntCmp = 'gdnwb_copts_bundles_landing_default';
const androidAppUrl =
	'https://play.google.com/store/apps/details?id=com.guardian';
const feastAppUrl = 'https://guardian-feast.go.link?adj_t=1dufrlhf';

// ----- Functions ----- //

const getManageUrl = () => `https://manage.${getBaseDomain()}`;
const getManageSubsUrl = () => `${getManageUrl()}/subscriptions`;
const getHelpCentreUrl = () => `${getManageUrl()}/help-centre`;

function getPatronsLink(
	intCmp?: string,
	supportRegionId?: SupportRegionId,
): string {
	const params = new URLSearchParams();
	params.append('INTCMP', intCmp ?? defaultIntCmp);

	const url = supportRegionId === 'us' ? patronsUrlUS : patronsUrl;
	return `${url}?${params.toString()}`;
}

function convertSupportRegionIdToAppStoreCountryCode(cgId: SupportRegionId) {
	switch (cgId) {
		case 'uk':
			return 'gb';

		case 'int':
			return 'us';

		case 'eu':
			return 'us';

		default:
			return cgId;
	}
}

function getAppleStoreUrl(product: string, supportRegionId: SupportRegionId) {
	const appStoreCountryCode =
		convertSupportRegionIdToAppStoreCountryCode(supportRegionId);
	return `https://apps.apple.com/${appStoreCountryCode}/app/${product}`;
}

function getIosAppUrl(supportRegionId: SupportRegionId): string {
	return getAppleStoreUrl('the-guardian/id409128287', supportRegionId);
}

function getDailyEditionUrl(supportRegionId: SupportRegionId): string {
	return getAppleStoreUrl(
		'the-guardian-daily-edition/id452707806',
		supportRegionId,
	);
}

const getProfileUrl = (path: string) => (returnUrl?: string | null) => {
	const encodedReturn = encodeURIComponent(returnUrl ?? window.location.href);
	return `https://profile.${getBaseDomain()}/${path}?returnUrl=${encodedReturn}`;
};

const getSignoutUrl = getProfileUrl('signout');

// ----- Exports ----- //

export {
	getPatronsLink,
	getIosAppUrl,
	androidAppUrl,
	getDailyEditionUrl,
	getSignoutUrl,
	getManageSubsUrl,
	getHelpCentreUrl,
	feastAppUrl,
};
