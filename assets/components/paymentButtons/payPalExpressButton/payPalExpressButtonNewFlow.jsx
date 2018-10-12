// @flow

// ----- Imports ----- //

import { classNameWithModifiers } from 'helpers/utilities';
import ReactDOM from 'react-dom';
import React from 'react';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
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
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
  formClassName: string,
  show: boolean,
  isTestUser: boolean,
  processRecurringPayPalPayment: (Function, Function, IsoCurrency, CsrfState) => void,
|};


// ----- Component ----- //

function PayPalExpressButton(props: PropTypes) {
  console.log('button container render');

  const className = props.show ? 'component-paypal-button-checkout' : classNameWithModifiers('component-paypal-button-checkout', ['hidden']);
  return (
    <div id="component-paypal-button-checkout" className={className}>
      <IframeButton
        onPaymentAuthorisation={props.onPaymentAuthorisation}
        csrf={props.csrf}
        currencyId={props.currencyId}
        hasLoaded={props.hasLoaded}
        setHasLoaded={props.setHasLoaded}
        canOpen={props.canOpen}
        whenUnableToOpen={props.whenUnableToOpen}
        formClassName={props.formClassName}
        isTestUser={props.isTestUser}
        processRecurringPayPalPayment={props.processRecurringPayPalPayment}
      />
    </div>
  );

}

type IframeButtonPropTypes = {|
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

// ----- Auxiliary Components ----- //

class IframeButton extends React.Component<IframeButtonPropTypes> {
  // This is a special sort of component. Since every time PayPal's code is called to create
  // the iframe button we end up with a different id, React will always update the DOM even
  // when nothing has substantively changed. We really just want the render code to execute
  // twice ever: once to call loadPayPalExpress(), and once to create the iframe element.
  // (Really, this should be just once, but for that we need to move loadPayPalExpress out
  // of here where it doesn't belong).
  shouldComponentUpdate(nextProps) {
    return (this.props.hasLoaded !== nextProps.hasLoaded);
  }

  props: IframeButtonPropTypes;

  render() {
    console.log('iframe button render');
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

    const payPalOptions = setup(
      this.props.currencyId,
      this.props.csrf,
      onPaymentAuthorisation,
      this.props.canOpen,
      this.props.whenUnableToOpen,
      this.props.formClassName,
      this.props.isTestUser,
      this.props.processRecurringPayPalPayment,
    );

    return React.createElement(
      window.paypal.Button.driver('react', { React, ReactDOM }),
      payPalOptions,
    );
  }
}

// ----- Export ----- //

export default PayPalExpressButton;
