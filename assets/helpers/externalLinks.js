// @flow

// ----- Imports ----- //

import type { Campaign } from 'helpers/tracking/acquisitions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import {
  countryGroups,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { addQueryParamsToURL } from 'helpers/url';

import { getPromoCode, getIntcmp } from './flashSale';
import type { SubscriptionProduct } from './subscriptions';


// ----- Types ----- //

export type MemProduct = 'patrons' | 'events';

type PromoCodes = {
  [SubscriptionProduct]: string,
};

type Intcmps = {
  [SubscriptionProduct]: string,
};


export type SubsUrls = {
  [SubscriptionProduct]: string,
};


// ----- Setup ----- //

const subsUrl = 'https://subscribe.theguardian.com';
const defaultIntCmp = 'gdnwb_copts_bundles_landing_default';
const iOSAppUrl = 'https://itunes.apple.com/gb/app/the-guardian/id409128287?mt=8';
const androidAppUrl = 'https://play.google.com/store/apps/details?id=com.guardian';
const dailyEditionUrl = 'https://itunes.apple.com/gb/app/guardian-observer-daily-edition/id452707806?mt=8';

const memUrls: {
  [MemProduct]: string,
} = {
  patrons: 'https://membership.theguardian.com/patrons',
  events: 'https://membership.theguardian.com/events',
};

const defaultPromos: PromoCodes = {
  DigitalPack: getPromoCode('DigitalPack', 'DXX83X'),
  Paper: getPromoCode('Paper', 'GXX83P'),
  PaperAndDigital: getPromoCode('PaperAndDigital', 'GXX83X'),
};

const defaultIntcmps: Intcmps = {
  DigitalPack: getIntcmp('DigitalPack', defaultIntCmp),
  Paper: getIntcmp('Paper', defaultIntCmp),
  PaperAndDigital: getIntcmp('PaperAndDigital', defaultIntCmp),
};

const customPromos : {
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

// Creates URLs for the subs site from promo codes and intCmp.
function buildSubsUrls(
  countryGroupId: CountryGroupId,
  promoCodes: PromoCodes,
  intCmp: Intcmps,
  otherQueryParams: Array<[string, string]>,
  referrerAcquisitionData: ReferrerAcquisitionData,
): SubsUrls {

  const countryId = countryGroups[countryGroupId].supportInternationalisationId;
  const params = new URLSearchParams();
  otherQueryParams.forEach(p => params.append(p[0], p[1]));
  params.append('acquisitionData', JSON.stringify(referrerAcquisitionData));

  const paper = `${subsUrl}/p/${promoCodes.Paper}?${buildParamString('Paper', intCmp, otherQueryParams, referrerAcquisitionData)}`;
  const paperDig = `${subsUrl}/p/${promoCodes.PaperAndDigital}?${buildParamString('PaperAndDigital', intCmp, otherQueryParams, referrerAcquisitionData)}`;
  const digital = `/${countryId}/subscribe/digital?${buildParamString('Digital', intCmp, otherQueryParams, referrerAcquisitionData)}`;
  const weekly = `${subsUrl}/weekly?${buildParamString('GuardianWeekly', intCmp, otherQueryParams, referrerAcquisitionData)}`;

  return {
    DigitalPack: digital,
    Paper: paper,
    PaperAndDigital: paperDig,
    GuardianWeekly: weekly,
  };

}

function buildParamString(
  product: SubscriptionProduct,
  intCmp: Intcmps,
  otherQueryParams: Array<[string, string]>,
  referrerAcquisitionData: ReferrerAcquisitionData,
  ): string {
  const params = new URLSearchParams();
  params.append('INTCMP', intCmp[product] || defaultIntCmp);
  otherQueryParams.forEach(p => params.append(p[0], p[1]));
  params.append('acquisitionData', JSON.stringify(referrerAcquisitionData));

  return params.toString();
}

// Creates links to subscriptions, tailored to the user's campaign.
function getSubsLinks(
  countryGroupId: CountryGroupId,
  intCmp: ?string,
  campaign: ?Campaign,
  otherQueryParams: Array<[string, string]>,
  referrerAcquisitionData: ReferrerAcquisitionData,
): SubsUrls {
  if ((campaign && customPromos[campaign])) {
    return buildSubsUrls(
      countryGroupId,
      customPromos[campaign],
      defaultIntcmps,
      otherQueryParams,
      referrerAcquisitionData,
    );
  }

  return buildSubsUrls(countryGroupId, defaultPromos, defaultIntcmps, otherQueryParams, referrerAcquisitionData);

}

// Builds a link to the digital pack checkout.
function getDigitalCheckout(
  referrerAcquisitionData: ReferrerAcquisitionData,
  cgId: CountryGroupId,
  referringCta: ?string,
): string {

  return addQueryParamsToURL(`${subsUrl}/checkout`, {
    promoCode: defaultPromos.DigitalPack,
    countryGroup: countryGroups[cgId].supportInternationalisationId,
    acquisitionData: JSON.stringify(referrerAcquisitionData),
    startTrialButton: referringCta,
  });

}


// ----- Exports ----- //

export {
  getSubsLinks,
  getMemLink,
  getDigitalCheckout,
  iOSAppUrl,
  androidAppUrl,
  dailyEditionUrl,
};
