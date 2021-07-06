// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';
import { connect } from 'react-redux';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { getPayPalOptions, type SetupPayPalRequestType } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type PayPalAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { PayPal } from 'helpers/forms/paymentMethods';
import { type Action, updatePayPalButtonReady } from 'pages/contributions-landing/contributionsLandingActions';
import AnimatedDots from 'components/spinners/animatedDots';

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

const PayPalExpressButtonComponent = (props: PropTypes) => {

  const onPaymentAuthorisation = (token: string): void => {
    props.onPaymentAuthorisation(tokenToAuthorisation(token));
  };

  // hasLoaded determines whether window.paypal is available
  if (!props.hasLoaded) {
    return <AnimatedDots appearance="dark" />;
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
