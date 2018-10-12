// @flow

// ----- Imports ----- //

import { classNameWithModifiers } from 'helpers/utilities';
import ReactDOM from 'react-dom';
import React from 'react';

import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import { loadPayPalExpress, setup } from 'helpers/paymentIntegrations/newPaymentFlow/payPalExpressCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { PayPalAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';

// ---- Types ----- //

type PropTypes = {|
  onPaymentAuthorisation: PaymentAuthorisation => void,
  csrf: CsrfState,
  currencyId: IsoCurrency,
  hasLoaded: boolean,
  setHasLoaded: () => void,
  switchStatus: Status,
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
  formClassName: string,
  show: boolean,
  isTestUser: boolean,
  processRecurringPayPalPayment: (Function, Function, IsoCurrency, CsrfState) => void,
|};


// ----- Component ----- //

function PayPalExpressButton(props: PropTypes) {

  return (
    <Switchable
      status={props.switchStatus}
      component={() => <Button {...props} />}
      fallback={() => <PaymentError paymentMethod="PayPal" modifierClass="paypal-express" />}
    />
  );

}

// ----- Auxiliary Components ----- //

function Button(props: PropTypes) {

  if (!props.hasLoaded) {
    loadPayPalExpress().then(props.setHasLoaded);
    return null;
  }

  const tokenToAuthorisation = (token: string): PayPalAuthorisation => ({
    paymentMethod: 'PayPal',
    token,
  });

  const onPaymentAuthorisation = (token: string): void => {
    props.onPaymentAuthorisation(tokenToAuthorisation(token));
  };

  const payPalOptions = setup(
    props.currencyId,
    props.csrf,
    onPaymentAuthorisation,
    props.canOpen,
    props.whenUnableToOpen,
    props.formClassName,
    props.isTestUser,
    props.processRecurringPayPalPayment,
  );


  const PayPalButton = window.paypal.Button.driver('react', { React, ReactDOM });
  const className = props.show ? 'component-paypal-button-checkout' : classNameWithModifiers('component-paypal-button-checkout', ['hidden']);
  return (
    <div id="component-paypal-button-checkout" className={className}>
      <PayPalButton {...payPalOptions} />
    </div>
  );
}


// ----- Default Props ----- //

PayPalExpressButton.defaultProps = {
  switchStatus: 'On',
};


// ----- Export ----- //

export default PayPalExpressButton;
