// ----- Imports ----- //

import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
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
	countryGroupId?: CountryGroupId,
): string {
	const params = new URLSearchParams();
	params.append('INTCMP', intCmp ?? defaultIntCmp);

	const url = countryGroupId === 'UnitedStates' ? patronsUrlUS : patronsUrl;
	return `${url}?${params.toString()}`;
}

function convertCountryGroupIdToAppStoreCountryCode(cgId: CountryGroupId) {
	const groupFromId = countryGroups[cgId];

	switch (groupFromId.supportRegionId.toLowerCase()) {
		case 'uk':
			return 'gb';

		case 'int':
			return 'us';

		case 'eu':
			return 'us';

		default:
			return groupFromId.supportRegionId.toLowerCase();
	}
}

function getAppleStoreUrl(product: string, countryGroupId: CountryGroupId) {
	const appStoreCountryCode =
		convertCountryGroupIdToAppStoreCountryCode(countryGroupId);
	return `https://apps.apple.com/${appStoreCountryCode}/app/${product}`;
}

function getIosAppUrl(countryGroupId: CountryGroupId): string {
	return getAppleStoreUrl('the-guardian/id409128287', countryGroupId);
}

function getDailyEditionUrl(countryGroupId: CountryGroupId): string {
	return getAppleStoreUrl(
		'the-guardian-daily-edition/id452707806',
		countryGroupId,
	);
}

const getProfileUrl = (path: string) => (returnUrl?: string | null) => {
	const encodedReturn = encodeURIComponent(returnUrl ?? window.location.href);
	return `https://profile.${getBaseDomain()}/${path}?returnUrl=${encodedReturn}`;
};

const getSignoutUrl = getProfileUrl('signout');
const getReauthenticateUrl = getProfileUrl('reauthenticate');

// ----- Exports ----- //

export {
	getPatronsLink,
	getIosAppUrl,
	androidAppUrl,
	getDailyEditionUrl,
	getSignoutUrl,
	getReauthenticateUrl,
	getManageSubsUrl,
	getHelpCentreUrl,
	feastAppUrl,
};
