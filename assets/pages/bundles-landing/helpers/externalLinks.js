// @flow

// ----- Imports ----- //

import type { Campaign } from 'helpers/tracking/acquisitions';


// ----- Types ----- //

type SubsProduct = 'paper' | 'digital' | 'paperDig';
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

const memUrls: {
  [MemProduct]: string,
} = {
  patrons: 'https://membership.theguardian.com/patrons',
  events: 'https://membership.theguardian.com/events',
};

const defaultPromos: PromoCodes = {
  digital: 'p/DXX83X',
  paper: 'p/GXX83P',
  paperDig: 'p/GXX83X',
};

const customPromos : {
  [Campaign]: PromoCodes,
} = {
  ease_of_payment_test_currency_symbol_in_cta: {
    digital: 'p/DEOPCSICTA',
    paper: 'p/NEOPCSICTA',
    paperDig: 'p/NDEOPCSICTA',
  },
  ease_of_payment_test_just_a_minute: {
    digital: 'p/DEOPJAM',
    paper: 'p/NEOPJAM',
    paperDig: 'p/NDEOPJAM',
  },
  ease_of_payment_test_just_one_pound: {
    digital: 'p/DEOPJOP',
    paper: 'p/NEOPJOP',
    paperDig: 'p/NDEOPJOP',
  },
  ease_of_payment_test_control: {
    digital: 'p/DEOPC',
    paper: 'p/NEOPC',
    paperDig: 'p/NDEOPC',
  },
  seven_fifty_middle: {
    digital: 'p/D750MIDDLE',
    paper: 'p/N750MIDDLE',
    paperDig: 'p/ND750MIDDLE',
  },
  seven_fifty_end: {
    digital: 'p/D750END',
    paper: 'p/N750END',
    paperDig: 'p/ND750END',
  },
  seven_fifty_email: {
    digital: 'p/D750EMAIL',
    paper: 'p/N750EMAIL',
    paperDig: 'p/ND750EMAIL',
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
  promoCodes: PromoCodes,
  intCmp: ?string,
  otherQueryParams: Array<[string, string]>,
): SubsUrls {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp || defaultIntCmp);
  otherQueryParams.forEach(p => params.append(p[0], p[1]));

  return {
    digital: `${subsUrl}/${promoCodes.digital}?${params.toString()}`,
    paper: `${subsUrl}/${promoCodes.paper}?${params.toString()}`,
    paperDig: `${subsUrl}/${promoCodes.paperDig}?${params.toString()}`,
  };

}

// Creates links to subscriptions, tailored to the user's campaign.
function getSubsLinks(
  intCmp: ?string,
  campaign: ?Campaign,
  otherQueryParams: Array<[string, string]>,
): SubsUrls {

  if (campaign && customPromos[campaign]) {
    return buildSubsUrls(customPromos[campaign], intCmp, otherQueryParams);
  }

  return buildSubsUrls(defaultPromos, intCmp, otherQueryParams);

}


// ----- Exports ----- //

export {
  getSubsLinks,
  getMemLink,
};
