// @flow

// ----- Imports ----- //

import {
  deriveSubsAcquisitionData,
  type ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
  type CountryGroupId,
  countryGroups,
} from 'helpers/internationalisation/countryGroup';
import type { Participations } from 'helpers/abTests/abtest';
import { getBaseDomain } from 'helpers/urls/url';
import type {
  DigitalBillingPeriod, DigitalGiftBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { getOrigin } from './url';
import { promoQueryParam } from 'helpers/productPrice/promotions';
import type { Option } from 'helpers/types/option';

// ----- Types ----- //

export type MemProduct = 'patrons' | 'events';

export type SubsUrls = {
  [SubscriptionProduct]: string,
  GuardianWeeklyGift: string,
  DigitalPackGift: string,
};


// ----- Setup ----- //

const subsUrl = `https://subscribe.${getBaseDomain()}`;
const patronsUrl = 'https://patrons.theguardian.com';
const profileUrl = `https://profile.${getBaseDomain()}`;
const manageUrl = `https://manage.${getBaseDomain()}`;
const homeDeliveryUrl = `https://www.${getBaseDomain()}/help/2017/dec/11/help-with-delivery#nav1`;
const defaultIntCmp = 'gdnwb_copts_bundles_landing_default';
const androidAppUrl = 'https://play.google.com/store/apps/details?id=com.guardian';
const androidDailyUrl = 'https://play.google.com/store/apps/details?id=com.guardian.editions';
const myAccountUrl = `${profileUrl}/account/edit`;
const manageSubsUrl = `${manageUrl}/subscriptions`;
const helpCentreUrl = `${manageUrl}/help-centre`;
const emailPreferences = `${manageUrl}/email-prefs`;

const memUrls: {
  [MemProduct]: string,
} = {
  events: 'https://membership.theguardian.com/events',
};

// ----- Functions ----- //

// Creates URLs for the membership site from promo codes and intCmp.
function getMemLink(product: MemProduct, intCmp: ?string): string {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp || defaultIntCmp);

  return `${memUrls[product]}?${params.toString()}`;

}

function getPatronsLink(intCmp: ?string): string {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp || defaultIntCmp);

  return `${patronsUrl}?${params.toString()}`;
}

function buildParamString(
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId,
  intCmp: ?string,
  referrerAcquisitionData: ReferrerAcquisitionData | null,
): string {
  const params = new URLSearchParams(window.location.search);

  const maybeCustomIntcmp = intCmp || defaultIntCmp;
  params.set('INTCMP', maybeCustomIntcmp);

  if (referrerAcquisitionData) {
    params.set('acquisitionData', JSON.stringify(referrerAcquisitionData));
  }

  return params.toString();
}

function getLegacyPaperAndDigitalLink(
  countryGroupId: CountryGroupId,
  intCmp: ?string,
  referrerAcquisitionData: ReferrerAcquisitionData,
  nativeAbParticipations: Participations,
) {
  const acquisitionData = deriveSubsAcquisitionData(
    referrerAcquisitionData,
    nativeAbParticipations,
  );

  return `${subsUrl}/p/GXX83X?${buildParamString('PaperAndDigital', countryGroupId, intCmp, acquisitionData)}`;
}

// Builds a link to the digital pack checkout.
function getDigitalCheckout(
  countryGroupId: CountryGroupId,
  billingPeriod: DigitalBillingPeriod | DigitalGiftBillingPeriod,
  promoCode: Option<string>,
  orderIsAGift: boolean,
): string {
  const params = new URLSearchParams(window.location.search);
  if (promoCode) {
    params.set(promoQueryParam, promoCode);
  }
  params.set('period', billingPeriod);
  return `${getOrigin()}/subscribe/digital/checkout${orderIsAGift ? '/gift' : ''}?${params.toString()}`;
}


function convertCountryGroupIdToAppStoreCountryCode(cgId: CountryGroupId) {
  const groupFromId = countryGroups[cgId];
  if (groupFromId) {
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
  } else {
    return 'us';
  }
}

function getAppleStoreUrl(product: string, countryGroupId: CountryGroupId) {
  const appStoreCountryCode = convertCountryGroupIdToAppStoreCountryCode(countryGroupId);
  return `https://apps.apple.com/${appStoreCountryCode}/app/${product}`;
}

function getIosAppUrl(countryGroupId: CountryGroupId) {
  return getAppleStoreUrl('the-guardian/id409128287', countryGroupId);
}

function getDailyEditionUrl(countryGroupId: CountryGroupId) {
  return getAppleStoreUrl('the-guardian-daily-edition/id452707806', countryGroupId);
}

const getProfileUrl = (path: string) => (returnUrl: ?string) => {
  const encodedReturn = encodeURIComponent(returnUrl || window.location);
  return `https://profile.${getBaseDomain()}/${path}?returnUrl=${encodedReturn}`;
};
const getSignoutUrl = getProfileUrl('signout');
const getReauthenticateUrl = getProfileUrl('reauthenticate');

// ----- Exports ----- //

export {
  getLegacyPaperAndDigitalLink,
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
