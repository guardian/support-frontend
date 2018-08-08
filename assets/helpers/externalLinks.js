// @flow

// ----- Imports ----- //

import type { Campaign } from 'helpers/tracking/acquisitions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import {
  countryGroups,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { addQueryParamsToURL } from 'helpers/url';

import { getPromoCode } from './flashSale';


// ----- Types ----- //

export type SubsProduct = 'paper' | 'digital' | 'paperDig' | 'weekly';
export type MemProduct = 'patrons' | 'events';

type PromoCodes = {
  [SubsProduct]: string,
};

export type SubsUrls = {
  [SubsProduct]: string,
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
  digital: getPromoCode('digital', 'DXX83X'),
  paper: getPromoCode('paper', 'GXX83P'),
  paperDig: getPromoCode('paperAndDigital', 'GXX83X'),
};

const customPromos : {
  [Campaign]: PromoCodes,
} = {
  seven_fifty_middle: {
    digital: 'D750MIDDLE',
    paper: 'N750MIDDLE',
    paperDig: 'ND750MIDDLE',
  },
  seven_fifty_end: {
    digital: 'D750END',
    paper: 'N750END',
    paperDig: 'ND750END',
  },
  seven_fifty_email: {
    digital: 'D750EMAIL',
    paper: 'N750EMAIL',
    paperDig: 'ND750EMAIL',
  },
  epic_paradise_paradise_highlight: {
    digital: 'DPARAHIGH',
    paper: 'NPARAHIGH',
    paperDig: 'NDPARAHIGH',
  },
  epic_paradise_control: {
    digital: 'DPARACON',
    paper: 'NPARACON',
    paperDig: 'NDPARACON',
  },
  epic_paradise_different_highlight: {
    digital: 'DPARADIFF',
    paper: 'NPARADIFF',
    paperDig: 'NDPARADIFF',
  },
  epic_paradise_standfirst: {
    digital: 'DPARASTAND',
    paper: 'NPARASTAND',
    paperDig: 'NDPARASTAND',
  },
  banner_just_one_control: {
    digital: 'DBANJUSTCON',
    paper: 'NBANJUSTCON',
    paperDig: 'NDBANJUSTCON',
  },
  banner_just_one_just_one: {
    digital: 'DBANJUSTONE',
    paper: 'NBANJUSTONE',
    paperDig: 'NDBANJUSTONE',
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
  intCmp: ?string,
  otherQueryParams: Array<[string, string]>,
  referrerAcquisitionData: ReferrerAcquisitionData,
): SubsUrls {

  const countryId = countryGroups[countryGroupId].supportInternationalisationId;
  const params = new URLSearchParams();
  params.append('INTCMP', intCmp || defaultIntCmp);
  otherQueryParams.forEach(p => params.append(p[0], p[1]));
  params.append('acquisitionData', JSON.stringify(referrerAcquisitionData));

  const paper = `${subsUrl}/p/${promoCodes.paper}?${params.toString()}`;
  const paperDig = `${subsUrl}/p/${promoCodes.paperDig}?${params.toString()}`;
  const digital = `/${countryId}/subscribe/digital?${params.toString()}`;
  const weekly = `${subsUrl}/weekly?${params.toString()}`;

  return {
    digital,
    paper,
    paperDig,
    weekly,
  };

}

// Creates links to subscriptions, tailored to the user's campaign.
function getSubsLinks(
  countryGroupId: CountryGroupId = 'GBPCountries',
  intCmp: ?string,
  campaign: ?Campaign,
  otherQueryParams: Array<[string, string]>,
  referrerAcquisitionData: ReferrerAcquisitionData,
): SubsUrls {
  if ((campaign && customPromos[campaign])) {
    return buildSubsUrls(
      countryGroupId,
      customPromos[campaign],
      intCmp,
      otherQueryParams,
      referrerAcquisitionData,
    );
  }

  return buildSubsUrls(countryGroupId, defaultPromos, intCmp, otherQueryParams, referrerAcquisitionData);

}

// Builds a link to the digital pack checkout.
function getDigitalCheckout(
  referrerAcquisitionData: ReferrerAcquisitionData,
  cgId: CountryGroupId,
  referringCta: ?string,
): string {

  return addQueryParamsToURL(`${subsUrl}/checkout`, {
    promoCode: defaultPromos.digital,
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
