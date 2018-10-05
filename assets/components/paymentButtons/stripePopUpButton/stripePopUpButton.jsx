// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import type { Status } from 'helpers/settings';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage';
import {
  setupStripeCheckout,
  openDialogBox,
} from 'helpers/paymentIntegrations/stripeCheckout';
import type { StripeAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  amount: number,
  onPaymentAuthorisation: StripeAuthorisation => void,
  closeHandler: () => void,
  currencyId: IsoCurrency,
  email: string,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  whenUnableToOpen: () => void,
  canOpen: () => boolean,
  switchStatus: Status,
  svg: Node,
|};
/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

function isStripeSetup(): boolean {
  return window.StripeCheckout !== undefined;
}


// ----- Component ----- //

const StripePopUpButton = (props: PropTypes) => (
  <Switchable
    status={props.switchStatus}
    component={() => <Button {...props} />}
    fallback={() => <PaymentError paymentMethod="credit/debit card" />}
  />
);

// ----- Auxiliary Components ----- //

function Button(props: PropTypes) {

  const tokenToAuthorisation = (token: string): StripeAuthorisation => ({
    paymentMethod: 'Stripe',
    token,
  });

  const onPaymentAuthorisation = (token: string): void => {
    props.onPaymentAuthorisation(tokenToAuthorisation(token));
  };

  if (!isStripeSetup()) {
    setupStripeCheckout(onPaymentAuthorisation, props.closeHandler, props.currencyId, props.isTestUser);
  }

  const onClick = () => {
    // Don't open Stripe Checkout for automated tests, call the backend immediately
    if (props.isPostDeploymentTestUser) {
      onPaymentAuthorisation('tok_visa');
    } else if (props.canOpen()) {
      storage.setSession('paymentMethod', 'Stripe');
      openDialogBox(props.amount, props.email);
    } else {
      props.whenUnableToOpen();
    }
  };

  return (
    <button
      id="qa-pay-with-card"
      className="component-stripe-pop-up-button"
      onClick={onClick}
    >
      Pay with debit/credit card {props.svg}
    </button>
  );

}


// ----- Default Props ----- //

StripePopUpButton.defaultProps = {
  closeHandler: () => {},
  canOpen: () => true,
  whenUnableToOpen: () => undefined,
  switchStatus: 'On',
};


// ----- Exports ----- //

export default StripePopUpButton;
