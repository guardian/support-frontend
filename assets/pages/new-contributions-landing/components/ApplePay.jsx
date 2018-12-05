// @flow

// ----- Imports ----- //

import React from 'react';

import { PaymentRequestButtonElement, StripeProvider, Elements, injectStripe } from 'react-stripe-elements';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getStripeKey } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import type { ContributionType } from 'helpers/contributions';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  canMakeApplePayPayment: boolean,
  country: string,
  amount: number,
  currency: IsoCurrency,
  isTestUser: boolean,
  setCanMakeApplePayPayment: (boolean) => void,
  stripeCheckout: Object | null,
  contributionType: ContributionType,
|};
/* eslint-enable react/no-unused-prop-types */


// ---- Auxiliary functions ----- //
function paymentRequestButton(props: {
  stripe: Object,
  canMakeApplePayPayment: boolean,
  country: string,
  currency: IsoCurrency,
  amount: number,
  setCanMakeApplePayPayment: (boolean) => void,
}) {
  console.log(props.currency);
  const paymentRequest = props.stripe.paymentRequest({
    country: props.country,
    currency: 'usd',
    total: {
      label: 'Demo total',
      amount: 500,
    },
  });
  paymentRequest.on('token', ({ complete, token, ...data }) => {
    console.log('Received Stripe token: ', token);
    console.log('Received customer information: ', data);
    complete('success');
  });

  paymentRequest.canMakePayment().then((result) => {
    console.log(result);
    if (result && result.applePay) {
      props.setCanMakeApplePayPayment(!!result.applePay);
    }
  });

  console.log('a ', props.canMakeApplePayPayment);
  return props.canMakeApplePayPayment === true ? (
    <PaymentRequestButtonElement
      paymentRequest={paymentRequest}
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
  if (props.stripeCheckout) {
    const key = getStripeKey(props.contributionType, props.currency, props.isTestUser);
    return (
      <StripeProvider apiKey={key}>
        <Elements>
          <PaymentRequestButton
            canMakeApplePayPayment={props.canMakeApplePayPayment}
            country={props.country}
            currency={props.currency}
            amount={props.amount}
            setCanMakeApplePayPayment={props.setCanMakeApplePayPayment}
          />
        </Elements>
      </StripeProvider>
    );
  }
  return null;
}


// ----- Auxiliary components ----- //


const PaymentRequestButton = injectStripe(paymentRequestButton);

ApplePay.defaultProps = {
  canMakeApplePayPayment: true,
  country: 'US',
  amount: 5,
  isTestUser: false,
};


// ----- Default props----- //

export default ApplePay;
