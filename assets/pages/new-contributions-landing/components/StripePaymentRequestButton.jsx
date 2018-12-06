// @flow

// ----- Imports ----- //

import React from 'react';

import { PaymentRequestButtonElement, StripeProvider, Elements, injectStripe } from 'react-stripe-elements';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getStripeKey } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { isValidEmail } from 'helpers/formValidation';
import { isInStripePaymentRequestAllowedCountries } from 'helpers/internationalisation/country';
import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  canMakeApplePayPayment: boolean,
  country: IsoCountry,
  amount: number,
  currency: IsoCurrency,
  isTestUser: boolean,
  setCanMakeApplePayPayment: (boolean) => void,
  setPaymentRequest: (Object) => void,
  stripeCheckout: Object | null,
  contributionType: ContributionType,
  paymentRequest: Object | null,
  onPaymentAuthorised: PaymentAuthorisation => void,
  updateEmail: string => void,
|};
/* eslint-enable react/no-unused-prop-types */

function updateUserEmail(data: Object, updateEmail: string => void) {
  const email = data.payerEmail;
  if (email && isValidEmail(email)) {
    updateEmail(email);
  }
}


function initialisePaymentRequest(props: {
  stripe: Object,
  country: string,
  currency: string,
  amount: number,
  setCanMakeApplePayPayment: (boolean) => void,
  setPaymentRequest: Object => void,
  onPaymentAuthorised: PaymentAuthorisation => void,
  updateEmail: (string) => void,
  isTestUser: boolean,
}) {
  const paymentRequest = props.stripe.paymentRequest({
    country: props.country,
    currency: props.currency,
    total: {
      label: 'Demo total',
      amount: props.amount,
    },
    requestPayerEmail: true,
  });
  paymentRequest.on('token', ({ complete, token, ...data }) => {
    // We need to do this so that we can offer marketing permissions on the thank you page
    updateUserEmail(data, props.updateEmail);
    const tokenId = props.isTestUser ? 'tok_visa' : token.id;
    props.onPaymentAuthorised({ paymentMethod: 'Stripe', token: tokenId });
    complete('success');
  });

  paymentRequest.canMakePayment().then((result) => {
    if (result) {
      props.setCanMakeApplePayPayment(true);
    }
  });
  props.setPaymentRequest(paymentRequest);
}

// ---- Auxiliary functions ----- //
function paymentRequestButton(props: {
  stripe: Object,
  paymentRequest: Object | null,
  canMakeApplePayPayment: boolean,
  country: string,
  currency: IsoCurrency,
  amount: number,
  setCanMakeApplePayPayment: (boolean) => void,
  setPaymentRequest: (Object) => void,
  onPaymentAuthorised: PaymentAuthorisation => void,
  isTestUser: boolean,
  updateEmail: string => void,
}) {

  // If we haven't initialised the payment request, initialise it and return null
  if (!props.paymentRequest) {
    initialisePaymentRequest({
      stripe: props.stripe,
      country: props.country,
      currency: props.currency,
      amount: props.amount,
      setCanMakeApplePayPayment: props.setCanMakeApplePayPayment,
      setPaymentRequest: props.setPaymentRequest,
      onPaymentAuthorised: props.onPaymentAuthorised,
      isTestUser: props.isTestUser,
      updateEmail: props.updateEmail,
    });
    return null;
  }

  props.paymentRequest.update({
    total: {
      label: 'Amount to pay',
      amount: props.amount * 100,
    },
  });

  return (props.canMakeApplePayPayment === true) ? (
    <PaymentRequestButtonElement
      paymentRequest={props.paymentRequest}
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

function StripePaymentRequestButton(props: PropTypes) {
  if (props.stripeCheckout &&
      props.contributionType === 'ONE_OFF' &&
      isInStripePaymentRequestAllowedCountries(props.country)
  ) {
    const key = getStripeKey(props.contributionType, props.currency, props.isTestUser);
    return (
      <StripeProvider apiKey={key}>
        <Elements>
          <PaymentRequestButton
            canMakeApplePayPayment={props.canMakeApplePayPayment}
            country={props.country}
            currency={props.currency.toLowerCase()}
            amount={props.amount}
            setCanMakeApplePayPayment={props.setCanMakeApplePayPayment}
            setPaymentRequest={props.setPaymentRequest}
            paymentRequest={props.paymentRequest}
            onPaymentAuthorised={props.onPaymentAuthorised}
            isTestUser={props.isTestUser}
            updateEmail={props.updateEmail}
          />
        </Elements>
      </StripeProvider>
    );
  }
  return null;
}


// ----- Auxiliary components ----- //


const PaymentRequestButton = injectStripe(paymentRequestButton);

// ----- Default props----- //

export default StripePaymentRequestButton;
