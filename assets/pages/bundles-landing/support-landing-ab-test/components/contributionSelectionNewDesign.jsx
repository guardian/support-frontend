// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency } from 'helpers/internationalisation/currency';
import type { Contrib as ContributionType } from 'helpers/contributions';

import { getContributionTypes } from '../helpers/contributionTypes';
import { getContributionAmounts } from '../helpers/contributionAmounts';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  country: IsoCountry,
  currency: Currency,
  selectedAmount: string,
  toggleAmount: string => void,
  toggleType: string => void,
};


// ----- Exports ----- //

export default function ContributionSelection(props: PropTypes) {

  return (
    <div className="component-contribution-selection">
      <div className="component-contribution-selection__contribution-type">
        <RadioToggle
          name="contribution-type-toggle"
          radios={getContributionTypes(props.country)}
          checked={props.contributionType}
          toggleAction={props.toggleType}
        />
      </div>
      <div className="component-contribution-selection__contribution-amount">
        <RadioToggle
          name="contribution-amount-toggle"
          radios={getContributionAmounts(props.contributionType, props.currency)}
          checked={props.selectedAmount}
          toggleAction={props.toggleAmount}
        />
      </div>
    </div>
  );

}
