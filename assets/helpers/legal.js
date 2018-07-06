// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Terms & Conditions ----- //

const defaultTermsLink: string = 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions';

const termsLinks: {
  [CountryGroupId]: string,
} = {
  GBPCountries: defaultTermsLink,
  UnitedStates: 'https://www.theguardian.com/info/2016/apr/07/us-contribution-terms-and-conditions',
  AUDCountries: defaultTermsLink,
  EURCountries: defaultTermsLink,
  International: defaultTermsLink,
  NZDCountries: defaultTermsLink,
  Canada: defaultTermsLink,
};

const privacyLink = 'https://www.theguardian.com/help/privacy-policy';
const defaultContributionEmail = 'mailto:contribution.support@theguardian.com';

const copyrightNotice = `\u00A9 ${(new Date()).getFullYear()} Guardian News and Media Limited or its
  affiliated companies. All rights reserved.`;

const contributionsEmail: {
    [CountryGroupId]: string,
} = {
  AUDCountries: 'mailto:apac.help@theguardian.com',
  GBPCountries: defaultContributionEmail,
  UnitedStates: defaultContributionEmail,
  EURCountries: defaultContributionEmail,
  International: defaultContributionEmail,
  NZDCountries: defaultContributionEmail,
  Canada: defaultContributionEmail,
};


// ----- Exports ----- //

export {
  termsLinks,
  privacyLink,
  copyrightNotice,
  contributionsEmail,
};
