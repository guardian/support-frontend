// @flow

// ----- Imports ----- //

import type { Campaign } from 'helpers/tracking/guTracking';


// ----- Types ----- //

type Product = 'paper' | 'digital' | 'paperDig';

type PromoCodes = {
  [Product]: string,
};

export type SubsUrls = {
  [Product]: string,
};


// ----- Setup ----- //

const subsUrl = 'https://subscribe.theguardian.com';

const defaultPromos: PromoCodes = {
  digital: 'p/DXX83X',
  paper: 'p/GXX83P',
  paperDig: 'p/GXX83X',
};

const customPromos : {
  [Campaign]: PromoCodes,
} = {
  baseline_test: {
    digital: 'p/DJ6CCJZLL',
    paper: 'p/NJ6CCQLD4',
    paperDig: 'p/NJ6CCSVMC',
  },
};


// ----- Functions ----- //

// Creates URLs for the subs site from promo codes and intCmp.
function buildUrls(promoCodes: PromoCodes, intCmp: string): SubsUrls {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp);

  return {
    digital: `${subsUrl}/${promoCodes.digital}?${params.toString()}`,
    paper: `${subsUrl}/${promoCodes.paper}?${params.toString()}`,
    paperDig: `${subsUrl}/${promoCodes.paperDig}?${params.toString()}`,
  };

}

// Creates links to subscriptions, tailored to the user's campaign.
function getSubsLinks(intCmp: string, campaign: ?Campaign): SubsUrls {

  if (campaign && customPromos[campaign]) {
    return buildUrls(customPromos[campaign], intCmp);
  }

  return buildUrls(defaultPromos, intCmp);

}


// ----- Exports ----- //

export {
  getSubsLinks,
};
