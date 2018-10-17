// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type PaymentHandler, getPaymentLabel, getValidPaymentMethods } from 'helpers/checkouts';
import { type Switches } from 'helpers/settings';
import {
  type Contrib,
  type PaymentMethod,
  type PaymentMatrix,
  logInvalidCombination,
} from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { setupStripeCheckout } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';
import { logException } from 'helpers/logger';
import PaymentFailureMessage from 'components/paymentFailureMessage/paymentFailureMessage';

import { type State } from '../contributionsLandingReducer';
import { type Action, updatePaymentMethod, setPaymentIsReady } from '../contributionsLandingActions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  countryId: IsoCountry,
  contributionType: Contrib,
  currency: IsoCurrency,
  paymentMethod: PaymentMethod,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  paymentHandlers: { [PaymentMethod]: PaymentHandler | null },
  updatePaymentMethod: PaymentMethod => Action,
  setPaymentIsReady: (boolean, ?{ [PaymentMethod]: PaymentHandler }) => Action,
  isTestUser: boolean,
  switches: Switches,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  countryId: state.common.internationalisation.countryId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  paymentHandlers: state.page.form.paymentHandlers,
  isTestUser: state.page.user.isTestUser || false,
  switches: state.common.settings.switches,
});

const mapDispatchToProps = {
  updatePaymentMethod,
  setPaymentIsReady,
};

// ----- Logic ----- //

function initialiseStripeCheckout(props: PropTypes) {
  const {
    onPaymentAuthorisation,
    contributionType,
    currency,
    isTestUser,
  } = props;

  // TODO IMPORTANT: we need to initialise Stripe separately for one-off and recurring
  // I think this requires us to make
  // paymentHandlers: { [PaymentMethod]: PaymentHandler | null }
  // into
  // paymentHandlers: { [Contrib]: {[PaymentMethod]: PaymentHandler | null }}
  setupStripeCheckout(onPaymentAuthorisation, contributionType, currency, isTestUser)
    .then((handler: PaymentHandler) => props.setPaymentIsReady(true, { Stripe: handler }));
}

// Bizarrely, adding a type to this object means the type-checking on the
// paymentMethodInitialisers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).
const recurringPaymentMethodInitialisers = {
  PayPal: () => { /* TODO PayPal recurring */ },
  Stripe: initialiseStripeCheckout,
  DirectDebit: () => { /* no initialisation required */ },
};

const paymentMethodInitialisers: PaymentMatrix<PropTypes => void> = {
  ONE_OFF: {
    Stripe: initialiseStripeCheckout,
    PayPal: () => {
      // PayPal one-off payments involve a call to PayPal's API (via the Payment API)
      // and a clientside redirect. No third-party JS needed.
      logException('Paypal one-off does not require initialisation');
    },
    DirectDebit: () => { logInvalidCombination('ONE_OFF', 'DirectDebit'); },
    None: () => { logInvalidCombination('ONE_OFF', 'None'); },
  },
  ANNUAL: {
    ...recurringPaymentMethodInitialisers,
    None: () => { logInvalidCombination('ANNUAL', 'None'); },
  },
  MONTHLY: {
    ...recurringPaymentMethodInitialisers,
    None: () => { logInvalidCombination('MONTHLY', 'None'); },
  },
};


// ----- Render ----- //

function PaymentMethodSelector(props: PropTypes) {

  const paymentMethods: PaymentMethod[] =
    getValidPaymentMethods(props.contributionType, props.switches, props.countryId);

  // This means a particular payment method will only be initialised
  // once its tab becomes active. If the tab is the default one selected,
  // its payment methods will be initialised on page load.
  const uninitialisedPaymentMethods = paymentMethods.filter(paymentMethod => !props.paymentHandlers[paymentMethod]);
  uninitialisedPaymentMethods.forEach((paymentMethod) => {
    paymentMethodInitialisers[props.contributionType][paymentMethod](props);
  });

  const noPaymentMethodsErrorMessage = <PaymentFailureMessage classModifiers={['no-valid-payments']} errorHeading="Payment methods are unavailable" checkoutFailureReason="all_payment_methods_unavailable" />;

  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['buttons', 'contribution-pay'])}>
      <legend className="form__legend">Payment method</legend>

      { paymentMethods.length ?
        <ul className="form__radio-group-list">
          {paymentMethods.map(paymentMethod => (
            <li className="form__radio-group-item">
              <input
                id={`paymentMethodSelector-${paymentMethod}`}
                className="form__radio-group-input"
                name="paymentMethodSelector"
                type="radio"
                value={paymentMethod}
                onChange={() => props.updatePaymentMethod(paymentMethod)}
                checked={props.paymentMethod === paymentMethod}
              />
              <label htmlFor={`paymentMethodSelector-${paymentMethod}`} className="form__radio-group-label">
                <span className="radio-ui" />
                <span className="radio-ui__label">{getPaymentLabel(paymentMethod)}</span>
                {paymentMethod === 'PayPal' ? (<SvgPayPal />) : (<SvgNewCreditCard />)}
              </label>
            </li>
          ))}
        </ul>
        : noPaymentMethodsErrorMessage
      }

    </fieldset>
  );
}

const NewPaymentMethodSelector = connect(mapStateToProps, mapDispatchToProps)(PaymentMethodSelector);

export { NewPaymentMethodSelector };
