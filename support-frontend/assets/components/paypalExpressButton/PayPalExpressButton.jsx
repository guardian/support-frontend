// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';
import { connect } from 'react-redux';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { getPayPalOptions, type SetupPayPalRequestType } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type PayPalAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { PayPal } from 'helpers/paymentMethods';
import { type Action, updatePayPalButtonReady } from 'pages/contributions-landing/contributionsLandingActions';

type PropTypes = {|
  onPaymentAuthorisation: Function,
  csrf: CsrfState,
  currencyId: IsoCurrency,
  hasLoaded: boolean,
  canOpen: () => boolean,
  onClick: Function,
  formClassName: string,
  isTestUser: boolean,
  amount: number,
  billingPeriod: BillingPeriod,
  setupRecurringPayPalPayment: SetupPayPalRequestType,
  updatePayPalButtonReady: (boolean) => Action,
|};

const tokenToAuthorisation = (token: string): PayPalAuthorisation => ({
  paymentMethod: PayPal,
  token,
});

const mapDispatchToProps = (dispatch: Function) => ({
  updatePayPalButtonReady: (ready: boolean) =>
    dispatch(updatePayPalButtonReady(ready)),
});

// When we use PayPal's JS library via window.paypal.Button.driver, it renders a button inside
// an iframe. Each time this code is called, the iframe ends up with a different id,
// so React will always try and update the DOM even when nothing has substantively changed.
//
// We don't want this to happen, because loading this iframe is an
// expensive operation which causes an obvious visual re-render.
//
// TODO: find a solution to this problem under Preact X.
const PayPalExpressButtonComponent = (props: PropTypes) => {

  const onPaymentAuthorisation = (token: string): void => {
    props.onPaymentAuthorisation(tokenToAuthorisation(token));
  };

  // hasLoaded determines whether window.paypal is available
  if (!props.hasLoaded) {
    return null;
  }

  // This element contains an iframe which contains the actual button
  return React.createElement(
    window.paypal.Button.driver('react', { React, ReactDOM }),
    getPayPalOptions(
      props.currencyId,
      props.csrf,
      onPaymentAuthorisation,
      props.canOpen,
      props.onClick,
      props.formClassName,
      props.isTestUser,
      props.amount,
      props.billingPeriod,
      props.setupRecurringPayPalPayment,
      props.updatePayPalButtonReady,
    ),
  );
};

const PayPalExpressButton = connect(null, mapDispatchToProps)(PayPalExpressButtonComponent);
export default PayPalExpressButton;
