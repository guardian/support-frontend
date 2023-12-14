// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type {
	DigitalBillingPeriod,
	DigitalGiftBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import { promoQueryParam } from 'helpers/productPrice/promotions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import { getBaseDomain, getOrigin } from 'helpers/urls/url';

// ----- Types ----- //

export type MemProduct = 'events';
export type SubsUrls = {
	[key in SubscriptionProduct]: string;
} & {
	GuardianWeeklyGift: string;
	DigitalPackGift: string;
};

// ----- Setup ----- //

const patronsUrl = 'https://patrons.theguardian.com';
const patronsUrlUS =
	'https://manage.theguardian.com/help-centre/article/contribute-another-way';
const profileUrl = `https://profile.${getBaseDomain()}`;
const manageUrl = `https://manage.${getBaseDomain()}`;
const homeDeliveryUrl = `https://www.${getBaseDomain()}/help/2017/dec/11/help-with-delivery#nav1`;
const defaultIntCmp = 'gdnwb_copts_bundles_landing_default';
const androidAppUrl =
	'https://play.google.com/store/apps/details?id=com.guardian';
const androidDailyUrl =
	'https://play.google.com/store/apps/details?id=com.guardian.editions';
const myAccountUrl = `${profileUrl}/account/edit`;
const manageSubsUrl = `${manageUrl}/subscriptions`;
const helpCentreUrl = `${manageUrl}/help-centre`;
const emailPreferences = `${manageUrl}/email-prefs`;
const memUrls: Record<MemProduct, string> = {
	events: 'https://membership.theguardian.com/events',
};

// ----- Functions ----- //

// Creates URLs for the membership site from promo codes and intCmp.
function getMemLink(product: MemProduct, intCmp?: string | null): string {
	const params = new URLSearchParams();
	params.append('INTCMP', intCmp ?? defaultIntCmp);
	return `${memUrls[product]}?${params.toString()}`;
}

function getPatronsLink(
	intCmp?: string,
	countryGroupId?: CountryGroupId,
): string {
	const params = new URLSearchParams();
	params.append('INTCMP', intCmp ?? defaultIntCmp);

	const url = countryGroupId === 'UnitedStates' ? patronsUrlUS : patronsUrl;
	return `${url}?${params.toString()}`;
}

// Builds a link to the digital pack checkout.
function getDigitalCheckout(
	billingPeriod: DigitalBillingPeriod | DigitalGiftBillingPeriod,
	promoCode: Option<string>,
	orderIsAGift: boolean,
): string {
	const params = new URLSearchParams(window.location.search);

	if (promoCode) {
		params.set(promoQueryParam, promoCode);
	}

	params.set('period', billingPeriod);

	if (orderIsAGift) {
		return `${getOrigin()}/subscribe/digital/checkout/gift?${params.toString()}`;
	}

	return `${getOrigin()}/subscribe/digital/checkout?${params.toString()}`;
}

function convertCountryGroupIdToAppStoreCountryCode(cgId: CountryGroupId) {
	const groupFromId = countryGroups[cgId];

	switch (groupFromId.supportInternationalisationId.toLowerCase()) {
		case 'uk':
			return 'gb';

		case 'int':
			return 'us';

		case 'eu':
			return 'us';

		default:
			return groupFromId.supportInternationalisationId.toLowerCase();
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
	getMemLink,
	getPatronsLink,
	getDigitalCheckout,
	getIosAppUrl,
	androidAppUrl,
	androidDailyUrl,
	getDailyEditionUrl,
	getSignoutUrl,
	getReauthenticateUrl,
	myAccountUrl,
	manageSubsUrl,
	homeDeliveryUrl,
	helpCentreUrl,
	emailPreferences,
};
