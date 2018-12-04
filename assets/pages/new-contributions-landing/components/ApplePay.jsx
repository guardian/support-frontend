// @flow

// ----- Imports ----- //

import React from 'react';

import { PaymentRequestButtonElement, StripeProvider, Elements, injectStripe } from 'react-stripe-elements';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  canMakeApplePayPayment: boolean,
  country: string,
  amount: number,
  currencyId: IsoCurrency,
  isTestUser: boolean,
  setCanMakeApplePayPayment: (boolean) => void,
|};
/* eslint-enable react/no-unused-prop-types */


// ---- Auxiliary functions ----- //
function paymentRequestButton(props: {
  stripe: Object,
  canMakeApplePayPayment: boolean,
  country: string,
  currencyId: IsoCurrency,
  amount: number,
  setCanMakeApplePayPayment: (boolean) => void,
}) {

  const paymentRequest = props.stripe.paymentRequest({
    country: props.country,
    currency: props.currencyId,
    total: {
      label: 'Demo total',
      amount: props.amount,
    },
  });

  paymentRequest.on('token', ({ complete, token, ...data }) => {
    console.log('Received Stripe token: ', token);
    console.log('Received customer information: ', data);
    complete('success');
  });

  paymentRequest.canMakePayment().then((result) => {
    props.setCanMakeApplePayPayment(!!result);
  });


  return props.canMakeApplePayPayment ? (
    <PaymentRequestButtonElement
      paymentRequest
      className="PaymentRequestButton"
      style={{
        // For more details on how to style the Payment Request Button, see:
        // https://stripe.com/docs/elements/payment-request-button#styling-the-element
        paymentRequestButton: {
          theme: 'light',
          height: '64px',
        },
      }}
    />
  ) : null;
}


// ----- Component ----- //

function ApplePay(props: PropTypes) {

  getStripeKey(props.currencyId, props.isTestUser);
  return (
    <StripeProvider apiKey="pk_test_12345">
      <Elements>
        <PaymentRequestButton
          canMakeApplePayPayment={props.canMakeApplePayPayment}
          country={props.country}
          currency={props.currencyId}
          amount={props.amount}
          setCanMakeApplePayPayment={props.setCanMakeApplePayPayment}
        />
      </Elements>
    </StripeProvider>
  );
}


// ----- Auxiliary components ----- //


const PaymentRequestButton = injectStripe(paymentRequestButton);

ApplePay.defaultProps = {
  canMakeApplePayPayment: true,
  country: 'US',
  amount: 5,
  currencyId: 'GBP',
  isTestUser: false,
};


// ----- Default props----- //

export default ApplePay;
