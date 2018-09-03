// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { amounts, getFrequency, type Amount, type Contrib } from 'helpers/contributions';
import { getPaymentDescription, type PaymentMethod } from 'helpers/checkouts';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, currencies, spokenCurrencies, detect } from 'helpers/internationalisation/currency';

import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { formatAmount } from './ContributionAmount';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  contributionType: Contrib,
  currency: IsoCurrency,
  amount?: Amount,
  otherAmount?: number
};

const mapStateToProps = (state: State) =>
  ({
    contributionType: state.page.contributionType,
    paymentMethod: state.page.paymentMethod,
    amount: state.page.amount,
    otherAmount: state.page.otherAmount,
  });

// ----- Render ----- //


function ContributionSubmit(props: PropTypes) {
  return (
    <div className="form__submit">
      <button className="form__submit-button" type="submit">
        Contribute&nbsp;
        {formatAmount(currencies[props.currency], spokenCurrencies[props.currency], props.otherAmount ? { value: props.otherAmount } : props.amount, false)}&nbsp;
        {getFrequency(props.contributionType)}&nbsp;
        {getPaymentDescription(props.contributionType, props.paymentMethod)}&nbsp;
        <SvgArrowRight />
      </button>
    </div>
  );
}

const NewContributionSubmit = connect(mapStateToProps)(ContributionSubmit);

export { NewContributionSubmit };
