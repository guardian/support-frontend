// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Functions ----- //

function getContributionTypes(country: IsoCountry) {

  const oneOffName = country === 'US' ? 'One-time' : 'One-off';

  return [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular Monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: oneOffName,
      accessibilityHint: `Make a ${oneOffName} contribution`,
    },
  ];

}


// ----- Exports ----- //

export {
  getContributionTypes,
};
