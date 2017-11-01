// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';

import type { Currency } from 'helpers/internationalisation/currency';
import type { Contrib as ContributionType } from 'helpers/contributions';

import { getContributionAmounts } from '../helpers/contributionAmounts';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  currency: Currency,
  selectedAmount: string,
};


// ----- Exports ----- //

export default function ContributionSelection(props: PropTypes) {

  return (
    <div className="component-contribution-selection">
      <div className="component-contribution-selection__contribution-type">
        <RadioToggle
          name="contributions-amount-toggle"
          radios={getContributionAmounts(props.contributionType, props.currency)}
          checked={props.selectedAmount}
          toggleAction={() => {}}
        />
      </div>
    </div>
  );

}
