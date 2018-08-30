// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, getPaymentType, type Contrib, type PaymentType } from 'helpers/contributions';

import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { formatAmount } from './ContributionAmount';

// ----- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  selectedAmounts: [number],
  paymentType: PaymentType,
};

// ----- Render ----- //

function ContributionSubmit(props: PropTypes) {
  return (
    <div className="form__submit">
      <button className="form__submit__button" type="submit">
        Contribute&nbsp;
        {formatAmount(props.selectedCountryGroupDetails, props.selectedAmounts[0], false)}&nbsp;
        {getFrequency(props.contributionType)}&nbsp;
        {getPaymentType(props.contributionType, props.paymentType)}&nbsp;
        <SvgArrowRight />
      </button>
    </div>
  );
}

const NewContributionSubmit = connect()(ContributionSubmit);

export { NewContributionSubmit };
