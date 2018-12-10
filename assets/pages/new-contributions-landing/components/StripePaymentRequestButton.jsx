// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { PaymentRequestButtonElement, StripeProvider, Elements, injectStripe } from 'react-stripe-elements';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getStripeKey } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { getAmount } from 'helpers/contributions';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { checkAmountOrOtherAmount, isValidEmail } from 'helpers/formValidation';
import { type PaymentResult } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { isInStripePaymentRequestAllowedCountries } from 'helpers/internationalisation/country';
import type { ApplePayTestVariant } from 'helpers/abTests/abtestDefinitions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { hiddenIf } from 'helpers/utilities';
import { logException } from 'helpers/logger';
import type { State } from '../contributionsLandingReducer';
import {
  setCanMakeApplePayPayment,
  setStripePaymentRequestButtonClicked,
  setPaymentRequest,
  onStripePaymentRequestApiPaymentAuthorised,
  updateEmail,
} from '../contributionsLandingActions';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  country: IsoCountry,
  currency: IsoCurrency,
  isTestUser: boolean,
  stripeCheckout: Object | null,
  contributionType: ContributionType,
  applePayTestVariant: ApplePayTestVariant,
|};

const mapStateToProps = (state: State) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  canMakeApplePayPayment: state.page.form.stripePaymentRequestButtonData.canMakeApplePayPayment,
  paymentRequest: state.page.form.stripePaymentRequestButtonData.paymentRequest,
  countryGroupId: state.common.internationalisation.countryGroupId,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised:
    (token, complete) => { dispatch(onStripePaymentRequestApiPaymentAuthorised(token, complete)); },
  setCanMakeApplePayPayment:
    (canMakeApplePayPayment) => { dispatch(setCanMakeApplePayPayment(canMakeApplePayPayment)); },
  setPaymentRequest:
    (paymentRequest) => { dispatch(setPaymentRequest(paymentRequest)); },
  updateEmail: (email: string) => { dispatch(updateEmail(email)); },
  setStripePaymentRequestButtonClicked: () => { dispatch(setStripePaymentRequestButtonClicked()); },
});


function updateUserEmail(data: Object, setEmail: string => void) {
  const email = data.payerEmail;
  if (email && isValidEmail(email)) {
    setEmail(email);
  } else {
    logException(`Failed to set email for stripe payment request user with data: ${data}`);
  }
}

const onComplete = (complete: Function) => (res: PaymentResult) => {
  if (res.paymentStatus === 'success') {
    complete('success');
  } else if (res.paymentStatus === 'failure') {
    complete('fail');
  }
};

function initialisePaymentRequest(props: {
  stripe: Object,
  country: string,
  currency: string,
  amount: number,
  setCanMakeApplePayPayment: (boolean) => void,
  setPaymentRequest: Object => void,
  onPaymentAuthorised: (PaymentAuthorisation, Function) => void,
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
    props.onPaymentAuthorised({ paymentMethod: 'Stripe', token: tokenId }, onComplete(complete));
  });

  paymentRequest.canMakePayment().then((result) => {
    // To restrict to just Apple Pay, limit it to result && result.applePay === true
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
  country: IsoCountry,
  currency: IsoCurrency,
  setCanMakeApplePayPayment: (boolean) => void,
  setPaymentRequest: (Object) => void,
  onPaymentAuthorised: PaymentAuthorisation => void,
  setStripePaymentRequestButtonClicked: () => void,
  isTestUser: boolean,
  updateEmail: string => void,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
}) {
  const amount = getAmount(props.selectedAmounts, props.otherAmounts, props.contributionType);

  // If we haven't initialised the payment request, initialise it and return null
  if (!props.paymentRequest) {
    initialisePaymentRequest({
      stripe: props.stripe,
      country: props.country,
      currency: props.currency,
      amount,
      setCanMakeApplePayPayment: props.setCanMakeApplePayPayment,
      setPaymentRequest: props.setPaymentRequest,
      onPaymentAuthorised: props.onPaymentAuthorised,
      isTestUser: props.isTestUser,
      updateEmail: props.updateEmail,
    });
    return null;
  }

  if (!Number.isNaN(amount) && props.paymentRequest) {
    props.paymentRequest.update({
      total: {
        label: 'Amount to pay',
        amount: amount * 100,
      },
    });
  }

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
      onClick={
        (event) => {
          event.preventDefault();
          props.setStripePaymentRequestButtonClicked();
          const amountIsValid =
            checkAmountOrOtherAmount(
              props.selectedAmounts,
              props.otherAmounts,
              props.contributionType,
              props.countryGroupId,
            );
          if (props.paymentRequest && amountIsValid) {
            props.paymentRequest.show();
          }
        }
      }
    />
  ) : null;
}


// ----- Component ----- //

function StripePaymentRequestButton(props: PropTypes) {

  const showApplePay = props.stripeCheckout
    && isInStripePaymentRequestAllowedCountries(props.country)
    && props.currency !== 'AUD'
    && props.applePayTestVariant === 'applePay';

  // TODO: set up for AU
  if (showApplePay) {
    const key = getStripeKey('ONE_OFF', props.currency, props.isTestUser);

    return (
      <div className={hiddenIf(props.contributionType !== 'ONE_OFF', 'stripe-payment-request-button')}>
        <StripeProvider apiKey={key}>
          <Elements>
            <PaymentRequestButton
              country={props.country}
              currency={props.currency.toLowerCase()}
              isTestUser={props.isTestUser}
              contributionType={props.contributionType}
            />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
  return null;
}

// ----- Auxiliary components ----- //

const PaymentRequestButton = injectStripe(connect(mapStateToProps, mapDispatchToProps)(paymentRequestButton));

// ----- Default props----- //

export default StripePaymentRequestButton;
