// @flow

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

const tests = [
  {
    name: 'baseline',
    intCmps: [
      'gdnwb_copts_memco_sandc_epic_baseline_support_proposition',
      'gdnwb_copts_memco_sandc_header_baseline_support_proposition',
      'gdnwb_copts_memco_sandc_engagement_banner_baseline_support_proposition',
    ],
    promoCodes: {
      digital: 'p/DJ6CCJZLL',
      paper: 'p/NJ6CCQLD4',
      paperDig: 'p/NJ6CCSVMC',
    },
  },
];


// ----- Functions ----- //

function buildUrls(promoCodes: PromoCodes, intCmp: string): SubsUrls {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp);

  return {
    digital: `${subsUrl}/${promoCodes.digital}?${params.toString()}`,
    paper: `${subsUrl}/${promoCodes.paper}?${params.toString()}`,
    paperDig: `${subsUrl}/${promoCodes.paperDig}?${params.toString()}`,
  };

}


// ----- Exports ----- //

export default function buildLinks(intCmp: string): SubsUrls {

  let links = null;

  tests.forEach((test) => {

    if (test.intCmps.indexOf(intCmp) > -1) {
      links = buildUrls(test.promoCodes, intCmp);
    }

  });

  return links || buildUrls(defaultPromos, intCmp);

}
