// @flow

// ----- Imports ----- //

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type Amount, type Contrib, type PaymentMethod } from 'helpers/contributions';
import { getPaymentDescription } from 'helpers/checkouts';
import { type IsoCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import SvgArrowRight from 'components/svgs/arrowRightStraight';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { hiddenIf } from 'helpers/utilities';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import { type State } from '../contributionsLandingReducer';
import { formatAmount } from './ContributionAmount';
import { PayPalRecurringButton } from './PayPalRecurringButton';
import {
  onThirdPartyPaymentAuthorised,
  paymentWaiting,
  setCheckoutFormHasBeenSubmitted,
  setPayPalHasLoaded,
  processRecurringPayPalPayment,
} from '../contributionsLandingActions';


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
  setPaymentIsWaiting: boolean => void,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  processRecurringPayPalPayment: (Function, Function, IsoCurrency, CsrfState) => void,
  payPalSetHasLoaded: () => void,
  payPalHasLoaded: boolean,
  isTestUser: boolean,
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
    isTestUser: state.page.user.isTestUser,
  });

const mapDispatchToProps = (dispatch: Function) => ({
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
  payPalSetHasLoaded: () => { dispatch(setPayPalHasLoaded()); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  processRecurringPayPalPayment: (
    resolve: Function,
    reject: Function,
    currencyId: IsoCurrency,
    csrf: CsrfState,
  ) => { dispatch(processRecurringPayPalPayment(resolve, reject, currencyId, csrf)); },
});


// ----- Render ----- //


function ContributionSubmit(props: PropTypes) {

  // TODO: this is also in ContributionFormContainer. refactor
  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  // if all payment methods are switched off, do not display the button
  if (props.paymentMethod !== 'None') {
    const frequency = getFrequency(props.contributionType);
    const otherAmount = props.otherAmount ? {
      value: props.otherAmount,
      spoken: '',
      isDefault: false,
    } : null;
    const amount = props.selectedAmounts[props.contributionType] === 'other' ? otherAmount : props.selectedAmounts[props.contributionType];
    const formClassName = 'form--contribution';
    const showPayPalRecurringButton = props.paymentMethod === 'PayPal' && props.contributionType !== 'ONE_OFF';

    // We have to show/hide PayPalRecurringButton rather than conditionally rendering it
    // because we don't want to destroy and replace the iframe each time.
    // See PayPalRecurringButton.jsx for more info.
    return (
      <div className="form__submit">
        <div
          id="component-paypal-button-checkout"
          className={hiddenIf(!showPayPalRecurringButton, 'component-paypal-button-checkout')}
        >
          <PayPalRecurringButton
            onPaymentAuthorisation={onPaymentAuthorisation}
            csrf={props.csrf}
            currencyId={props.currencyId}
            hasLoaded={props.payPalHasLoaded}
            setHasLoaded={props.payPalSetHasLoaded}
            canOpen={() => formIsValid(formClassName)}
            whenUnableToOpen={() => props.setCheckoutFormHasBeenSubmitted()}
            formClassName={formClassName}
            isTestUser={props.isTestUser}
            processRecurringPayPalPayment={props.processRecurringPayPalPayment}
          />
        </div>
        <button
          disabled={props.isWaiting}
          type="submit"
          className={hiddenIf(showPayPalRecurringButton, 'form__submit-button')}
        >
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
