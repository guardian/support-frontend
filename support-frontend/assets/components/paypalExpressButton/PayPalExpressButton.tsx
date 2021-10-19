// ----- Imports ----- //
import ReactDOM from "react-dom";
import React from "react";
import { connect } from "react-redux";
import type { Csrf as CsrfState } from "helpers/csrf/csrfReducer";
import type { SetupPayPalRequestType } from "helpers/forms/paymentIntegrations/payPalRecurringCheckout";
import { getPayPalOptions } from "helpers/forms/paymentIntegrations/payPalRecurringCheckout";
import type { IsoCurrency } from "helpers/internationalisation/currency";
import "helpers/internationalisation/currency";
import type { BillingPeriod } from "helpers/productPrice/billingPeriods";
import type { Action } from "pages/contributions-landing/contributionsLandingActions";
import { updatePayPalButtonReady } from "pages/contributions-landing/contributionsLandingActions";
import AnimatedDots from "components/spinners/animatedDots";
type PropTypes = {
  onPayPalCheckoutCompleted: (...args: Array<any>) => any;
  csrf: CsrfState;
  currencyId: IsoCurrency;
  hasLoaded: boolean;
  canOpen: () => boolean;
  onClick: (...args: Array<any>) => any;
  formClassName: string;
  isTestUser: boolean;
  amount: number;
  billingPeriod: BillingPeriod;
  setupRecurringPayPalPayment: SetupPayPalRequestType;
  updatePayPalButtonReady: (arg0: boolean) => Action; // created in mapDispatchToProps should not be passed into the component

};

const mapDispatchToProps = (dispatch: (...args: Array<any>) => any) => ({
  updatePayPalButtonReady: (ready: boolean) => dispatch(updatePayPalButtonReady(ready))
});

const PayPalExpressButtonComponent = (props: PropTypes) => {
  // hasLoaded determines whether window.paypal is available
  if (!props.hasLoaded) {
    return <AnimatedDots appearance="dark" />;
  }

  const paypalOptions = getPayPalOptions(props.currencyId, props.csrf, props.onPayPalCheckoutCompleted, props.canOpen, props.onClick, props.formClassName, props.isTestUser, props.amount, props.billingPeriod, props.setupRecurringPayPalPayment, props.updatePayPalButtonReady);
  // This element contains an iframe which contains the actual button
  return React.createElement(window.paypal.Button.driver('react', {
    React,
    ReactDOM
  }), paypalOptions);
};

const PayPalExpressButton = connect(null, mapDispatchToProps)(PayPalExpressButtonComponent);
export default PayPalExpressButton;