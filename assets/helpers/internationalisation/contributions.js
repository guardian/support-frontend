// @flow

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

const defaultHeaderCopy = 'Help us deliver the independent journalism the world needs';
const defaultContributeCopy = `
  Make a recurring commitment to support The\u00a0Guardian long-term or a single contribution 
  as and when you feel like it – choose the option that suits you best.
`;

const usHeaderCopy = 'TODO header';
const usContributeCopy = 'TODO contribute';

export type CountryMetaData = {
  headerCopy: string,
  contributeCopy: string,
};

const countryGroupSpecificDetails: {
  [CountryGroupId]: CountryMetaData
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  UnitedStates: {
    headerCopy: usHeaderCopy,
    contributeCopy: usContributeCopy,
  },
  AUDCountries: {
    headerCopy: 'Help us deliver the independent journalism Australia needs',
    contributeCopy: defaultContributeCopy,
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
};

export { countryGroupSpecificDetails };
