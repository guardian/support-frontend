// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { PaymentRequestButtonElement, injectStripe } from 'react-stripe-elements';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { checkAmountOrOtherAmount, isValidEmail } from 'helpers/formValidation';
import { type PaymentResult } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
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
  stripe: Object,
  paymentRequest: Object | null,
  canMakeApplePayPayment: boolean,
  country: IsoCountry,
  currency: IsoCurrency,
  setCanMakeApplePayPayment: (boolean) => void,
  setPaymentRequest: (Object) => void,
  onPaymentAuthorised: (PaymentAuthorisation, Function) => void,
  setStripePaymentRequestButtonClicked: () => void,
  isTestUser: boolean,
  updateEmail: string => void,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
  amount: number,
|};


const mapStateToProps = (state: State) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  canMakeApplePayPayment: state.page.form.stripePaymentRequestButtonData.canMakeApplePayPayment,
  paymentRequest: state.page.form.stripePaymentRequestButtonData.paymentRequest,
  countryGroupId: state.common.internationalisation.countryGroupId,
  country: state.common.internationalisation.countryId,
  currency: state.common.internationalisation.currencyId.toLowerCase(),
  isTestUser: state.page.user.isTestUser || false,
  contributionType: state.page.form.contributionType,
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


// ----- Functions -----//


function updateUserEmail(data: Object, setEmail: string => void) {
  const email = data.payerEmail;
  if (email) {
    if (isValidEmail(email)) {
      setEmail(email);
    } else {
      logException(`Failed to set email for stripe payment request user with email: ${email}`);
    }
  } else {
    logException('Failed to set email: no email in data object');
  }
}

const onComplete = (complete: Function) => (res: PaymentResult) => {
  if (res.paymentStatus === 'success') {
    complete('success');
  } else if (res.paymentStatus === 'failure') {
    complete('fail');
  }
};

function onClick(event, props: PropTypes) {
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

function initialisePaymentRequest(props: PropTypes) {
  const paymentRequest = props.stripe.paymentRequest({
    country: props.country,
    currency: props.currency,
    total: {
      label: 'The Guardian',
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

  // The returned value from canMakePayment will either be:
  // . null - browser has no compatible payment method)
  // . {applePay: true} - applePay is available
  // . {applePay: false} - GooglePay or PaymentRequestApi available
  paymentRequest.canMakePayment().then((result) => {
    if (result && result.applePay === true) {
      props.setCanMakeApplePayPayment(true);
    }
  });
  props.setPaymentRequest(paymentRequest);
}

const paymentButtonStyle = {
  paymentRequestButton: {
    theme: 'dark',
    height: '42px',
  },
};

function updateAmount(amount: number, paymentRequest: Object) {
  // When the other tab is clicked, the value of amount is NaN
  if (!Number.isNaN(amount) && paymentRequest) {
    paymentRequest.update({
      total: {
        label: 'The Guardian',
        amount: amount * 100,
      },
    });
  }
}


// ---- Component ----- //
function paymentRequestButton(props: PropTypes) {
  // If we haven't initialised the payment request, initialise it and return null, as we can't insert the button
  // until the async canMakePayment() function has been called on the paymentRequest object.
  if (!props.paymentRequest) {
    initialisePaymentRequest({ ...props });
    return null;
  }

  updateAmount(props.amount, props.paymentRequest);

  return (props.canMakeApplePayPayment === true) ? (
    <div className="stripe-payment-request-button__container">
      <PaymentRequestButtonElement
        paymentRequest={props.paymentRequest}
        className="stripe-payment-request-button__button"
        style={paymentButtonStyle}
        onClick={(event) => { onClick(event, props); }}
      />
      <div className="stripe-payment-request-button__divider">
        or
      </div>
    </div>
  ) : null;
}

// ----- Auxiliary components ----- //

// ----- Default props----- //

const StripePaymentRequestButton =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(paymentRequestButton));

export default StripePaymentRequestButton;
