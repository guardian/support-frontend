// @flow

// ----- Imports ----- //

import {
  type Campaign,
  type ReferrerAcquisitionData,
  deriveSubsAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
  countryGroups,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import type { Participations } from 'helpers/abTests/abtest';
import { type OptimizeExperiments } from 'helpers/optimize/optimize';
import { getBaseDomain } from 'helpers/url';

import { getPromoCode, getIntcmp } from './flashSale';
import type { SubscriptionProduct, WeeklyBillingPeriod } from './subscriptions';


// ----- Types ----- //

export type MemProduct = 'patrons' | 'events';

type PromoCodes = {
  [SubscriptionProduct]: string,
};

export type SubsUrls = {
  [SubscriptionProduct]: string,
};


// ----- Setup ----- //

const subsUrl = 'https://subscribe.theguardian.com';
const patronsUrl = 'https://patrons.theguardian.com';
const defaultIntCmp = 'gdnwb_copts_bundles_landing_default';
const androidAppUrl = 'https://play.google.com/store/apps/details?id=com.guardian';
const emailPreferencesUrl = `https://profile.${getBaseDomain()}/email-prefs`;

function getWeeklyZuoraCode(period: WeeklyBillingPeriod, countryGroup: CountryGroupId) {

  const sixWeekDomestic = 'weeklydomestic-gwoct18-sixforsix-domestic';
  const sixWeekRow = 'weeklyrestofworld-gwoct18-sixforsix-row';

  const quarterDomestic = 'weeklydomestic-gwoct18-quarterly-domestic';
  const quarterRow = 'weeklyrestofworld-gwoct18-quarterly-row';

  const yearDomestic = 'weeklydomestic-gwoct18-annual-domestic';
  const yearRow = 'weeklyrestofworld-gwoct18-quarterly-row';

  const urls = {
    sixweek: {
      GBPCountries: sixWeekDomestic,
      UnitedStates: sixWeekDomestic,
      AUDCountries: sixWeekDomestic,
      NZDCountries: sixWeekDomestic,
      EURCountries: sixWeekDomestic,
      Canada: sixWeekDomestic,
      International: sixWeekRow,
    },
    quarter: {
      GBPCountries: quarterDomestic,
      UnitedStates: quarterDomestic,
      AUDCountries: quarterDomestic,
      NZDCountries: quarterDomestic,
      EURCountries: quarterDomestic,
      Canada: quarterDomestic,
      International: quarterRow,
    },
    year: {
      GBPCountries: yearDomestic,
      UnitedStates: yearDomestic,
      AUDCountries: yearDomestic,
      NZDCountries: yearDomestic,
      EURCountries: yearDomestic,
      Canada: yearDomestic,
      International: yearRow,
    },
  };

  return urls[period][countryGroup];
}

const memUrls: {
  [MemProduct]: string,
} = {
  events: 'https://membership.theguardian.com/events',
};

const defaultPromos: PromoCodes = {
  DigitalPack: getPromoCode('DigitalPack', 'DXX83X'),
  Paper: getPromoCode('Paper', 'GXX83P'),
  PaperAndDigital: getPromoCode('PaperAndDigital', 'GXX83X'),
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
  intCmp: ?string,
  referrerAcquisitionData: ReferrerAcquisitionData | null,
): string {
  const params = new URLSearchParams(window.location.search);

  const maybeCustomIntcmp = getIntcmp(product, intCmp, defaultIntCmp);
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

  const paper = `${subsUrl}/p/${promoCodes.Paper}?${buildParamString('Paper', intCmp, referrerAcquisitionData)}`;
  const paperDig = `${subsUrl}/p/${promoCodes.PaperAndDigital}?${buildParamString('PaperAndDigital', intCmp, referrerAcquisitionData)}`;
  const digital = `/${countryId}/subscribe/digital?${buildParamString('DigitalPack', intCmp, null)}`;
  const weekly = `/${countryId}/subscribe/weekly?${buildParamString('GuardianWeekly', intCmp, referrerAcquisitionData)}`;

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
  optimizeExperiments: OptimizeExperiments,
): SubsUrls {
  const acquisitionData = deriveSubsAcquisitionData(
    referrerAcquisitionData,
    nativeAbParticipations,
    optimizeExperiments,
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

// Builds a link to the digital pack checkout.
function getDigitalCheckout(
  referrerAcquisitionData: ReferrerAcquisitionData,
  cgId: CountryGroupId,
  referringCta: ?string,
  nativeAbParticipations: Participations,
  optimizeExperiments: OptimizeExperiments,
): string {
  const acquisitionData = deriveSubsAcquisitionData(
    referrerAcquisitionData,
    nativeAbParticipations,
    optimizeExperiments,
  );

  const params = new URLSearchParams(window.location.search);
  params.set('acquisitionData', JSON.stringify(acquisitionData));
  params.set('promoCode', defaultPromos.DigitalPack);
  params.set('countryGroup', countryGroups[cgId].supportInternationalisationId);
  params.set('startTrialButton', referringCta || '');

  return `${subsUrl}/checkout?${params.toString()}`;
}


// Builds a link to the GW checkout.
function getWeeklyCheckout(
  referrerAcquisitionData: ReferrerAcquisitionData,
  period: WeeklyBillingPeriod,
  cgId: CountryGroupId,
  nativeAbParticipations: Participations,
  optimizeExperiments: OptimizeExperiments,
): string {
  const acquisitionData = deriveSubsAcquisitionData(
    referrerAcquisitionData,
    nativeAbParticipations,
    optimizeExperiments,
  );

  const url = getWeeklyZuoraCode(period, cgId);
  const params = new URLSearchParams(window.location.search);

  params.set('acquisitionData', JSON.stringify(acquisitionData));
  params.set('countryGroup', countryGroups[cgId].supportInternationalisationId);

  return `${subsUrl}/checkout/${url}?${params.toString()}`;
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
  return `https://itunes.apple.com/${appStoreCountryCode}/app/${product}?mt=8`;
}

function getIosAppUrl(countryGroupId: CountryGroupId) {
  return getAppleStoreUrl('the-guardian/id409128287', countryGroupId);
}

function getDailyEditionUrl(countryGroupId: CountryGroupId) {
  return getAppleStoreUrl('guardian-observer-daily-edition/id452707806', countryGroupId);
}

// ----- Exports ----- //

export {
  getSubsLinks,
  getMemLink,
  getPatronsLink,
  getDigitalCheckout,
  getIosAppUrl,
  androidAppUrl,
  getDailyEditionUrl,
  emailPreferencesUrl,
  getWeeklyCheckout,
};
