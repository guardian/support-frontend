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

const tokenToAuthorisation = (token: string): PayPalAuthorisation => ({
  paymentMethod: PayPal,
  token,
});


const PayPalExpressButton = (props: PropTypes) => {
  console.log('PaypalExpressButton loaded', props.hasLoaded)
  const onPaymentAuthorisation = (token: string): void => {
    props.onPaymentAuthorisation(tokenToAuthorisation(token));
  };
  // hasLoaded determines whether window.paypal is available
  // const [
  //   loaded,
  //   // setLoaded
  // ] = React.useState(props.hasLoaded);
  // console.log('initial loaded state', loaded);
  // if (!loaded) {
  //   console.log('NOT loaded', loaded);
  //   // return null;
  // }

  React.useEffect(() => {
    console.log('Behavior when the component receives new state or props.', props.hasLoaded);
    // setLoaded(loaded);
    console.log('loaded is', props.hasLoaded);
  }, [props.hasLoaded]);
  // });

  if (props.hasLoaded) {
    // This element contains an iframe which contains the actual button
    console.log('CREATE element', props.hasLoaded);
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
      ),
    );
  }
  console.log('returning NULL');
  return null;
  // // This element contains an iframe which contains the actual button
  // console.log('CREATE element', props.hasLoaded);
  // return React.createElement(
  //   window.paypal.Button.driver('react', { React, ReactDOM }),
  //   getPayPalOptions(
  //     props.currencyId,
  //     props.csrf,
  //     onPaymentAuthorisation,
  //     props.canOpen,
  //     props.onClick,
  //     props.formClassName,
  //     props.isTestUser,
  //     props.amount,
  //     props.billingPeriod,
  //     props.setupRecurringPayPalPayment,
  //   ),
  // );
};

export default React.memo<PropTypes>(PayPalExpressButton, (prevProps, nextProps) => {
  // Only re-render when hasLoaded  changes
  console.log('MEMO', prevProps.hasLoaded === nextProps.hasLoaded);
  return prevProps.hasLoaded === nextProps.hasLoaded;
});

// export default PayPalExpressButton;
