// @flow

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

const defaultHeaderCopy = 'Help us deliver the independent journalism the world needs';
const defaultContributeCopy = `
  Make a monthly commitment to support The Guardian long term or a one-off contribution 
  as and when you feel like it – choose the option that suits you best.
`;

export type CountryMetaData = {
  headerCopy: string,
  contributeCopy: string,
  currency: Object,
  contribution: Object
};

const countryGroupSpecificDetails: {
  [CountryGroupId]: CountryMetaData
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  UnitedStates: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    contribution: {
      oneoff: 'One-time',
      monthly: 'Monthly',
    },
  },
  AUDCountries: {
    headerCopy: 'Help us deliver the independent journalism Australia needs',
    contributeCopy: defaultContributeCopy,
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    contribution: {
      oneoff: 'One-time',
      monthly: 'Monthly',
    },
  },
};

export { countryGroupSpecificDetails };
