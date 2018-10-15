// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { loadPayPalExpress, getPayPalOptions } from 'helpers/paymentIntegrations/newPaymentFlow/payPalRecurringCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { PayPalAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';


type PropTypes = {|
  onPaymentAuthorisation: PaymentAuthorisation => void,
  csrf: CsrfState,
  currencyId: IsoCurrency,
  hasLoaded: boolean,
  setHasLoaded: () => void,
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
  formClassName: string,
  isTestUser: boolean,
  processRecurringPayPalPayment: (Function, Function, IsoCurrency, CsrfState) => void,
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
//    (e.g. the handler bound in addFormChangeListener inside setup)
export class PayPalRecurringButton extends React.Component<PropTypes> {
  shouldComponentUpdate(nextProps: PropTypes) {
    return (this.props.hasLoaded !== nextProps.hasLoaded);
  }

  props: PropTypes;

  render() {
    if (!this.props.hasLoaded) {
      // TODO: move this into some initialisation code rather than render
      loadPayPalExpress().then(this.props.setHasLoaded);
      return null;
    }

    const tokenToAuthorisation = (token: string): PayPalAuthorisation => ({
      paymentMethod: 'PayPal',
      token,
    });

    const onPaymentAuthorisation = (token: string): void => {
      this.props.onPaymentAuthorisation(tokenToAuthorisation(token));
    };

    // This element contains an iframe which contains the actual button
    return React.createElement(
      window.paypal.Button.driver('react', { React, ReactDOM }),
      getPayPalOptions(
        this.props.currencyId,
        this.props.csrf,
        onPaymentAuthorisation,
        this.props.canOpen,
        this.props.whenUnableToOpen,
        this.props.formClassName,
        this.props.isTestUser,
        this.props.processRecurringPayPalPayment,
      ),
    );
  }
}
