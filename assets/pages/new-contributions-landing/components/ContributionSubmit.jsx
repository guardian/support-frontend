// @flow

// ----- Imports ----- //

import PayPalExpressButton from 'components/paymentButtons/payPalExpressButton/payPalExpressButtonNewFlow';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import { classNameWithModifiers } from 'helpers/utilities';
import { setPayPalHasLoaded } from 'pages/new-contributions-landing/contributionsLandingActions';
import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type Amount, type Contrib, type PaymentMethod } from 'helpers/contributions';
import { getPaymentDescription } from 'helpers/checkouts';
import { type IsoCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';

import SvgArrowRight from 'components/svgs/arrowRightStraight';
import { Dispatch } from "redux";

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
  currencyId: IsoCurrency,
  csrf: CsrfState,
  whenUnableToOpen: () => void,
  payPalSwitchStatus: Status,
  payPalHasLoaded: boolean,
};

const mapStateToProps = (state: State) =>
  ({
    currency: state.common.internationalisation.currencyId,
    contributionType: state.page.form.contributionType,
    isWaiting: state.page.form.isWaiting,
    paymentMethod: state.page.form.paymentMethod,
    selectedAmounts: state.page.form.selectedAmounts,
    otherAmount: state.page.form.formData.otherAmounts[state.page.form.contributionType].amount,
    currencyId: state.common.internationalisation.currencyId,
    csrf: state.page.csrf,
    payPalHasLoaded: state.page.form.payPalHasLoaded,
    payPalSwitchStatus: state.common.settings.switches.recurringPaymentMethods.payPal,
  });

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return {
    payPalSetHasLoaded: () => {
      dispatch(setPayPalHasLoaded());
    },
  };
}

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
    const formClassName = 'form--contribution';
    const formSubmitClassName = showPayPalExpressButton
      ? classNameWithModifiers("form__submit-button",  ['hidden'])
      : "form__submit-button";

    return (
      <div className="form__submit">
       <PayPalExpressButton
          amount={amount}
          currencyId={props.currencyId}
          csrf={props.csrf}
          onPaymentAuthorisation={() => alert("worked")}
          hasLoaded={props.payPalHasLoaded}
          setHasLoaded={props.payPalSetHasLoaded}
          switchStatus={props.payPalSwitchStatus}
          canOpen={() => formIsValid(formClassName)}
          formClassName={formClassName}
          whenUnableToOpen={props.whenUnableToOpen}
          show={showPayPalExpressButton}
        />
        <button
          disabled={props.isWaiting}
          className={formSubmitClassName}
          type="submit">
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
      </div>
    );
  }
}

const NewContributionSubmit = connect(mapStateToProps, mapDispatchToProps)(ContributionSubmit);

export { NewContributionSubmit };
