// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Terms & Conditions ----- //

const termsLinks: {
  [IsoCountry]: string,
} = {
  GB: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
  US: 'https://www.theguardian.com/info/2016/apr/07/us-contribution-terms-and-conditions',
};

const privacyLink = 'https://www.theguardian.com/help/privacy-policy';

const copyrightNotice = `\u00A9 2017 Guardian News and Media Limited or its
  affiliated companies. All rights reserved.`;


// ----- Exports ----- //

export {
  termsLinks,
  privacyLink,
  copyrightNotice,
};
