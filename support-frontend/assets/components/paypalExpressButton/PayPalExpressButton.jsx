// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { getPayPalOptions, type SetupPayPalRequestType } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type PayPalAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { PayPal } from 'helpers/paymentMethods';

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
|};


// Q. Why is this a class rather than a function?
// A. Because we need to override shouldComponentUpdate.
//
// Q. Why do you need to override shouldComponentUpdate? Isn't that dangerous?
// A. We want to bypass React's normal decision-making about whether to re-render
// this particular component, because it uses some third-party code we can't control and
// which behaves in a very specific way.
//
// When we use PayPal's JS library via window.paypal.Button.driver, it renders a button inside
// an iframe. Each time this code is called, the iframe ends up with a different id,
// so React will always try and update the DOM even when nothing has substantively changed.
//
// We don't want this to happen, for two reasons.
// 1. Loading this iframe is an expensive operation which causes an obvious visual re-render
// 2. We don't want to have to re-bind handlers which interact with the iframe
//    (e.g. the handler bound in getPayPalOptions)
export class PayPalExpressButton extends React.Component<PropTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.tokenToAuthorisation = (token: string): PayPalAuthorisation => ({
      paymentMethod: PayPal,
      token,
    });
    this.onPaymentAuthorisationCaller = (token: string): void => {
      this.props.onPaymentAuthorisation(this.tokenToAuthorisation(token));
    };
  }

  componentDidMount() {
    this.updatePayPalButton();
  }

  shouldComponentUpdate(nextProps: PropTypes) {
    return (this.props !== nextProps);
  }

  componentWillUpdate() {
    this.updatePayPalButton();
  }

  onPaymentAuthorisationCaller: Function;
  tokenToAuthorisation: Function;
  // TO RESOLVE:
  payPalButton: any;
  props: PropTypes;

  updatePayPalButton = () => {
    if (window.paypal) {
      this.payPalButton = React.createElement(
        window.paypal.Button.driver('react', { React, ReactDOM }),
        getPayPalOptions(
          this.props.currencyId,
          this.props.csrf,
          this.onPaymentAuthorisationCaller,
          this.props.canOpen,
          this.props.onClick,
          this.props.formClassName,
          this.props.isTestUser,
          this.props.amount,
          this.props.billingPeriod,
          this.props.setupRecurringPayPalPayment,
        ),
      );
    }
  }

  render() {
    // hasLoaded determines whether window.paypal is available
    if (!this.props.hasLoaded) {
      return null;
    }

    // Return iframe containing the PayPal button
    return this.payPalButton;
  }
}
