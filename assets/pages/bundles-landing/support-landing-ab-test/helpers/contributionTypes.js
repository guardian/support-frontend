// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Contrib as ContributionType } from 'helpers/contributions';


// ----- Functions ----- //

function getOneOffName(country: IsoCountry) {
  return country === 'US' ? 'One-time' : 'One-off';
}

function getOneOffSpokenName(country: IsoCountry) {
  return country === 'US' ? 'one time' : 'one off';
}

function getSpokenType(
  contributionType: ContributionType,
  country: IsoCountry,
) {

  if (contributionType === 'ONE_OFF') {
    return getOneOffSpokenName(country);
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getContributionTypes(country: IsoCountry) {

  return [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: getOneOffName(country),
      accessibilityHint: `Make a ${getOneOffSpokenName(country)} contribution`,
    },
  ];

}


// ----- Exports ----- //

export {
  getSpokenType,
  getContributionTypes,
};
