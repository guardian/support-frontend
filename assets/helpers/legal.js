// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Terms & Conditions ----- //

const termsLinks: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
  UnitedStates: 'https://www.theguardian.com/info/2016/apr/07/us-contribution-terms-and-conditions',
  AUDCountries: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
  EURCountries: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
  International: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
  NZDCountries: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
  Canada: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
};

const privacyLink = 'https://www.theguardian.com/help/privacy-policy';

const copyrightNotice = `\u00A9 ${(new Date()).getFullYear()} Guardian News and Media Limited or its
  affiliated companies. All rights reserved.`;

const contributionsEmail: {
    [CountryGroupId]: string,
} = {
  GBPCountries: 'mailto:contribution.support@theguardian.com',
  UnitedStates: 'mailto:contribution.support@theguardian.com',
  AUDCountries: 'mailto:apac.help@theguardian.com',
  EURCountries: 'mailto:contribution.support@theguardian.com',
  International: 'mailto:contribution.support@theguardian.com',
  NZDCountries: 'mailto:contribution.support@theguardian.com',
  Canada: 'mailto:contribution.support@theguardian.com',
};


// ----- Exports ----- //

export {
  termsLinks,
  privacyLink,
  copyrightNotice,
  contributionsEmail,
};
