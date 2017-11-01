// @flow

// ----- Imports ----- //

import React from 'react';

import type { Currency } from 'helpers/internationalisation/currency';
import type { Contrib as ContributionType } from 'helpers/contributions';

import { getContributionAmounts } from '../helpers/contributionAmounts';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  currency: Currency,
};


// ----- Exports ----- //

export default function ContributionSelection(props: PropTypes) {

  return (
    <div className="component-contribution-selection">
      <div className="component-contribution-selection__contribution-type">
        {getContributionAmounts(props.contributionType, props.currency).map(amount =>
          <p>{amount.text}</p>)}
      </div>
    </div>
  );

}
