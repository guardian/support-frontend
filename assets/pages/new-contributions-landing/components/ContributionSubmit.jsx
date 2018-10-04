// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type Amount, type Contrib } from 'helpers/contributions';
import { getPaymentDescription, type PaymentMethod } from 'helpers/checkouts';
import { type IsoCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';

import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { formatAmount } from './ContributionAmount';
import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  currency: IsoCurrency,
  isWaiting: boolean,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  otherAmount: string | null,
};

const mapStateToProps = (state: State) =>
  ({
    currency: state.common.internationalisation.currencyId,
    contributionType: state.page.form.contributionType,
    isWaiting: state.page.form.isWaiting,
    paymentMethod: state.page.form.paymentMethod,
    selectedAmounts: state.page.form.selectedAmounts,
    otherAmount: state.page.form.formData.otherAmounts[state.page.form.contributionType].amount,
  });

// ----- Render ----- //


function ContributionSubmit(props: PropTypes) {

  // if all payment methods are switched off, do not display the button
  if (props.paymentMethod !== 'None') {
    const frequency = getFrequency(props.contributionType);
    const otherAmount = props.otherAmount ? {
      value: props.otherAmount,
      spoken: '',
      isDefault: false,
    } : null;
    const amount = props.selectedAmounts[props.contributionType] === 'other' ? otherAmount : props.selectedAmounts[props.contributionType];
    const showPayPalExpressButton = props.paymentMethod === 'PayPal' && props.contributionType !== 'ONE_OFF';

    return (
      <div className="form__submit">
        {showPayPalExpressButton ? (
          // TODO PayPal recurring
          <button disabled={props.isWaiting}>PayPal Express Button</button>
        ) : (
          <button disabled={props.isWaiting} className="form__submit-button" type="submit">
            Contribute&nbsp;
            {amount ? formatAmount(
              currencies[props.currency],
              spokenCurrencies[props.currency],
              amount,
              false,
            ) : null}&nbsp;
            {frequency ? `${frequency} ` : null}
            {getPaymentDescription(props.contributionType, props.paymentMethod)}&nbsp;
            <SvgArrowRight />
          </button>
        )}
      </div>
    );
  }
}

const NewContributionSubmit = connect(mapStateToProps)(ContributionSubmit);

export { NewContributionSubmit };
