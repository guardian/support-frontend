// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgCreditCard } from 'components/svg/svg';
import type { Currency } from 'helpers/internationalisation/currency';

import {
  setupStripeCheckout,
  openDialogBox,
} from 'helpers/stripeCheckout/stripeCheckout';

// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  callback: Function,
  closeHandler?: Function,
  currency: Currency,
  email: string,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  canOpen?: Function,
};
/* eslint-enable react/no-unused-prop-types */


function isStripeSetup(): boolean {
  return window.StripeCheckout !== undefined;
}


// ----- Component ----- //

const StripePopUpButton = (props: PropTypes) => {

  if (!isStripeSetup()) {
    setupStripeCheckout(props.callback, props.closeHandler, props.currency.iso, props.isTestUser);
  }

  const onClick = () => {
    if (props.canOpen && props.canOpen()) {
      openDialogBox(props.amount, props.email, props.callback, props.isPostDeploymentTestUser);
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

};

// ----- Default Props ----- //

StripePopUpButton.defaultProps = {
  canOpen: () => true,
  closeHandler: () => {},
};

// ----- Exports ----- //

export default StripePopUpButton;
