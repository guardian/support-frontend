// @flow
import type { IsoCountry } from 'helpers/internationalisation/country';

// ----- Types ----- //

type Product = 'paper' | 'digital' | 'paperDig';

type PromoCodes = {
  [IsoCountry]: {
    [Product]: string,
  }
};

export type SubsUrls = {
  [Product]: string,
};


// ----- Setup ----- //

const subsUrl = {
  GB: 'https://subscribe.theguardian.com',
  US: 'https://subscribe.theguardian.com/us',
};

const defaultPromos: PromoCodes = {
  GB: {
    digital: 'p/DXX83X',
    paper: 'p/GXX83P',
    paperDig: 'p/GXX83X',
  },
  US: {
    digital: 'p/DXU83X',
    paper: 'p/GXU83P',
    paperDig: 'p/GXU83X',
  },
};

const tests = [
  {
    name: 'rebaseline',
    intCmps: [
      'gdnwb_copts_memco_sandc_epic_rebaseline_support_proposition_support_proposition',
    ],
    promoCodes: {
      GB: {
        digital: 'p/DP83X',
        paper: 'p/VHD83P',
        paperDig: 'p/VHD83X',
      },
    },
  },
];


// ----- Functions ----- //

function buildUrls(promoCodes: PromoCodes, intCmp: string, isoCountry: ?IsoCountry): SubsUrls {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp);

  const country = isoCountry || 'GB';

  return {
    digital: `${subsUrl[country]}/${promoCodes[country].digital}?${params.toString()}`,
    paper: `${subsUrl[country]}/${promoCodes[country].paper}?${params.toString()}`,
    paperDig: `${subsUrl[country]}/${promoCodes[country].paperDig}?${params.toString()}`,
  };

}


// ----- Exports ----- //

export default function buildLinks(intCmp: string, isoCountry: ?IsoCountry): SubsUrls {

  let links = null;

  tests.forEach((test) => {

    if (test.intCmps.indexOf(intCmp) > -1) {
      links = buildUrls(test.promoCodes, intCmp, isoCountry);
    }

  });

  return links || buildUrls(defaultPromos, intCmp, isoCountry);

}
