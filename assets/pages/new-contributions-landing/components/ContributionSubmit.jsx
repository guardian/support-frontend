// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type Amount, type Contrib } from 'helpers/contributions';
import { getPaymentDescription, type PaymentMethod } from 'helpers/checkouts';
import { type IsoCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';

import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { formatAmount } from './ContributionAmount';

// ----- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  currency: IsoCurrency,
  amount?: Amount
};

const mapStateToProps = (state: State) =>
  ({
    contributionType: state.page.contributionType,
    paymentMethod: state.page.paymentMethod,
    amount: state.page.amount
  });

// ----- Render ----- //


function ContributionSubmit(props: PropTypes) {
  return (
    <div className="form__submit">
      <button className="form__submit-button" type="submit">
        Contribute&nbsp;
        {props.amount ? formatAmount(
          currencies[props.currency],
          spokenCurrencies[props.currency],
          props.amount,
          false,
        ) : null}
        {getFrequency(props.contributionType)}&nbsp;
        {getPaymentDescription(props.contributionType, props.paymentMethod)}&nbsp;
        <SvgArrowRight />
      </button>
    </div>
  );
}

ContributionSubmit.defaultProps = {
  amount: null,
};

const NewContributionSubmit = connect(mapStateToProps)(ContributionSubmit);

export { NewContributionSubmit };
