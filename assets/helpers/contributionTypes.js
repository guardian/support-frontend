// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Contrib as ContributionType } from 'helpers/contributions';


// ----- Functions ----- //

function getOneOffName(countryGroupId: CountryGroupId): string {
  switch (countryGroupId) {
    case 'UnitedStates': return 'One-time';
    default: return 'One-off';
  }
}

function getOneOffSpokenName(countryGroupId: CountryGroupId): string {
  switch (countryGroupId) {
    case 'UnitedStates': return 'one time';
    default: return 'one off';
  }
}

function getSpokenType(
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
) {

  if (contributionType === 'ONE_OFF') {
    return getOneOffSpokenName(countryGroupId);
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getClassName(contributionType: ContributionType) {

  if (contributionType === 'ONE_OFF') {
    return 'one-off';
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getContributionTypes(countryGroupId: CountryGroupId) {

  return [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: getOneOffName(countryGroupId),
      accessibilityHint: `Make a ${getOneOffSpokenName(countryGroupId)} contribution`,
    },
  ];

}


// ----- Exports ----- //

export {
  getSpokenType,
  getClassName,
  getContributionTypes,
};
