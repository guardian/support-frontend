// @flow

// ----- Imports ----- //

import React from 'react';

import SvgCreditCard from 'components/svgs/creditCard';
import type { Currency } from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage';
import {
  setupStripeCheckout,
  openDialogBox,
} from 'helpers/stripeCheckout/stripeCheckout';


// ---- Types ----- //

type Switch = 'Hide' | 'HideWithError' | 'Show';

/* eslint-disable react/no-unused-prop-types, react/require-default-props */
type PropTypes = {
  amount: number,
  callback: Function,
  closeHandler?: Function,
  currency: Currency,
  email: string,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  canOpen?: Function,
  switch?: Switch,
};
/* eslint-enable react/no-unused-prop-types, react/require-default-props */


// ----- Functions ----- //

function isStripeSetup(): boolean {
  return window.StripeCheckout !== undefined;
}


// ----- Component ----- //

const StripePopUpButton = (props: PropTypes) => {

  if (props.switch === 'Hide') {
    return null;
  } else if (props.switch === 'HideWithError') {
    return <ErrorMessage />;
  }

  return <Button {...props} />;

};


// ----- Auxiliary Components ----- //

function ErrorMessage() {
  return (
    <div className="component-stripe-pop-up-button component-stripe-pop-up-button--hidden-error">
      <p className="component-stripe-pop-up-button__error-message">
        We are currently experiencing issues with credit/debit card payments.
        Please use another payment method or try again later.
      </p>
    </div>
  );
}

function Button(props: PropTypes) {

  if (!isStripeSetup()) {
    setupStripeCheckout(props.callback, props.closeHandler, props.currency.iso, props.isTestUser);
  }

  const onClick = () => {
    // Don't open Stripe Checkout for automated tests, call the backend immediately
    if (props.isPostDeploymentTestUser) {
      const testTokenId = 'tok_visa';
      props.callback(testTokenId);
    } else if (props.canOpen && props.canOpen()) {
      storage.setSession('paymentMethod', 'Stripe');
      openDialogBox(props.amount, props.email);
    }
  };

  return (
    <button
      id="qa-pay-with-card"
      className="component-stripe-pop-up-button"
      onClick={onClick}
    >
      Pay with debit/credit card <SvgCreditCard />
    </button>
  );

}


// ----- Default Props ----- //

StripePopUpButton.defaultProps = {
  canOpen: () => true,
  closeHandler: () => {},
  switch: 'Show',
};


// ----- Exports ----- //

export default StripePopUpButton;
