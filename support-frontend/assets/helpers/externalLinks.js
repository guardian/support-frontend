// @flow

// ----- Imports ----- //

import {
  type Campaign,
  deriveSubsAcquisitionData,
  type ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
  type CountryGroupId,
  countryGroups,
} from 'helpers/internationalisation/countryGroup';
import type { Participations } from 'helpers/abTests/abtest';
import { getBaseDomain } from 'helpers/url';
import {
  Annual,
  type DigitalBillingPeriod,
  Monthly,
} from 'helpers/billingPeriods';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import { getAnnualPlanPromoCode, getIntcmp, getPromoCode } from './flashSale';
import { getOrigin } from './url';
import { GBPCountries } from './internationalisation/countryGroup';

// ----- Types ----- //

export type MemProduct = 'patrons' | 'events';

type PromoCodes = {
  [SubscriptionProduct]: string,
};

export type SubsUrls = {
  [SubscriptionProduct]: string,
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


const memUrls: {
  [MemProduct]: string,
} = {
  events: 'https://membership.theguardian.com/events',
};

const defaultPromos: PromoCodes = {
  DigitalPack: getPromoCode('DigitalPack', GBPCountries, 'DXX83X'),
  Paper: getPromoCode('Paper', GBPCountries, 'GXX83P'),
  PaperAndDigital: getPromoCode('PaperAndDigital', GBPCountries, 'GXX83X'),
  GuardianWeekly: getPromoCode('GuardianWeekly', GBPCountries, '10ANNUAL'),
};

const customPromos: {
  [Campaign]: PromoCodes,
} = {
  seven_fifty_middle: {
    DigitalPack: 'D750MIDDLE',
    Paper: 'N750MIDDLE',
    PaperAndDigital: 'ND750MIDDLE',
  },
  seven_fifty_end: {
    DigitalPack: 'D750END',
    Paper: 'N750END',
    PaperAndDigital: 'ND750END',
  },
  seven_fifty_email: {
    DigitalPack: 'D750EMAIL',
    Paper: 'N750EMAIL',
    PaperAndDigital: 'ND750EMAIL',
  },
  epic_paradise_paradise_highlight: {
    DigitalPack: 'DPARAHIGH',
    Paper: 'NPARAHIGH',
    PaperAndDigital: 'NDPARAHIGH',
  },
  epic_paradise_control: {
    DigitalPack: 'DPARACON',
    Paper: 'NPARACON',
    PaperAndDigital: 'NDPARACON',
  },
  epic_paradise_different_highlight: {
    DigitalPack: 'DPARADIFF',
    Paper: 'NPARADIFF',
    PaperAndDigital: 'NDPARADIFF',
  },
  epic_paradise_standfirst: {
    DigitalPack: 'DPARASTAND',
    Paper: 'NPARASTAND',
    PaperAndDigital: 'NDPARASTAND',
  },
  banner_just_one_control: {
    DigitalPack: 'DBANJUSTCON',
    Paper: 'NBANJUSTCON',
    PaperAndDigital: 'NDBANJUSTCON',
  },
  banner_just_one_just_one: {
    DigitalPack: 'DBANJUSTONE',
    Paper: 'NBANJUSTONE',
    PaperAndDigital: 'NDBANJUSTONE',
  },
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

  const maybeCustomIntcmp = getIntcmp(product, countryGroupId, intCmp, defaultIntCmp);
  params.set('INTCMP', maybeCustomIntcmp);

  if (referrerAcquisitionData) {
    params.set('acquisitionData', JSON.stringify(referrerAcquisitionData));
  }

  return params.toString();
}

// Creates URLs for the subs site from promo codes and intCmp.
function buildSubsUrls(
  countryGroupId: CountryGroupId,
  promoCodes: PromoCodes,
  intCmp: ?string,
  referrerAcquisitionData: ReferrerAcquisitionData,
): SubsUrls {

  const countryId = countryGroups[countryGroupId].supportInternationalisationId;

  // paper only applies to uk, so hardcode the country
  const paper = '/uk/subscribe/paper';
  const paperDig = `${subsUrl}/p/${promoCodes.PaperAndDigital}?${buildParamString('PaperAndDigital', countryGroupId, intCmp, referrerAcquisitionData)}`;
  const digital = `/${countryId}/subscribe/digital`;
  const weekly = `/${countryId}/subscribe/weekly`;

  return {
    DigitalPack: digital,
    Paper: paper,
    PaperAndDigital: paperDig,
    GuardianWeekly: weekly,
  };

}

// Creates links to subscriptions, tailored to the user's campaign.
function getSubsLinks(
  countryGroupId: CountryGroupId,
  intCmp: ?string,
  campaign: ?Campaign,
  referrerAcquisitionData: ReferrerAcquisitionData,
  nativeAbParticipations: Participations,
): SubsUrls {
  const acquisitionData = deriveSubsAcquisitionData(
    referrerAcquisitionData,
    nativeAbParticipations,
  );

  if ((campaign && customPromos[campaign])) {
    return buildSubsUrls(
      countryGroupId,
      customPromos[campaign],
      intCmp,
      acquisitionData,
    );
  }

  return buildSubsUrls(countryGroupId, defaultPromos, intCmp, acquisitionData);

}

function getDigitalPackPromoCode(cgId: CountryGroupId, billingPeriod: DigitalBillingPeriod): string {
  if (billingPeriod === 'Annual') {
    return getAnnualPlanPromoCode('DigitalPack', cgId, defaultPromos.DigitalPack);
  }
  return getPromoCode('DigitalPack', cgId, defaultPromos.DigitalPack);

}

// Builds a link to the digital pack checkout.
function getDigitalCheckout(
  countryGroupId: CountryGroupId,
  billingPeriod: DigitalBillingPeriod = Monthly,
): string {
  const promoCode = getDigitalPackPromoCode(countryGroupId, billingPeriod);
  const params = new URLSearchParams(window.location.search);
  params.set('promoCode', promoCode);
  if (billingPeriod === Annual) {
    params.set('period', Annual);
  }
  return `${getOrigin()}/subscribe/digital/checkout?${params.toString()}`;
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

const promotionTermsUrl = (promoCode: string) => `${subsUrl}/p/${promoCode}/terms`;

// ----- Exports ----- //

export {
  getSubsLinks,
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
  promotionTermsUrl,
};
