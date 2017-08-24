// @flow

// ----- Imports ----- //

import type { IsoCountry } from './country';


// ----- Terms & Conditions ----- //

const termsLinks: {
  [IsoCountry]: string,
} = {
  GB: 'https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions',
  US: 'https://www.theguardian.com/info/2016/apr/07/us-contribution-terms-and-conditions',
};


// ----- Exports ----- //

export {
  termsLinks,
};
