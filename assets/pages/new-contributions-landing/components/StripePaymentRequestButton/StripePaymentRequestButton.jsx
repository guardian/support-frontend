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
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { logException } from 'helpers/logger';
import type { State } from '../../contributionsLandingReducer';
import {
  setCanMakeStripePaymentRequestPayment,
  setStripePaymentRequestButtonClicked,
  setStripePaymentRequestObject,
  onStripePaymentRequestApiPaymentAuthorised,
  updateEmail,
} from '../../contributionsLandingActions';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  stripe: Object,
  country: IsoCountry,
  currency: IsoCurrency,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
  isTestUser: boolean,
  amount: number,
  stripePaymentRequestObject: Object | null,
  canMakeStripePaymentRequestPayment: boolean,
  setCanMakeStripePaymentRequestPayment: (boolean) => void,
  setStripePaymentRequestObject: (Object) => void,
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
  setStripePaymentRequestButtonClicked: () => void,
  updateEmail: string => void,
|};


const mapStateToProps = (state: State) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  canMakeStripePaymentRequestPayment: state.page.form.stripePaymentRequestButtonData.canMakeStripePaymentRequestPayment,
  stripePaymentRequestObject: state.page.form.stripePaymentRequestButtonData.stripePaymentRequestObject,
  countryGroupId: state.common.internationalisation.countryGroupId,
  country: state.common.internationalisation.countryId,
  currency: state.common.internationalisation.currencyId.toLowerCase(),
  isTestUser: state.page.user.isTestUser || false,
  contributionType: state.page.form.contributionType,

});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised:
    (paymentAuthorisation: PaymentAuthorisation) =>
      dispatch(onStripePaymentRequestApiPaymentAuthorised(paymentAuthorisation)),
  setCanMakeStripePaymentRequestPayment:
    (canMakePayment: boolean) => { dispatch(setCanMakeStripePaymentRequestPayment(canMakePayment)); },
  setStripePaymentRequestObject:
    (paymentRequest: Object) => { dispatch(setStripePaymentRequestObject(paymentRequest)); },
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

// Calling the complete function will close the pop up payment window
const onComplete = (complete: Function) => (res: PaymentResult) => {
  if (res.paymentStatus === 'success') {
    trackComponentClick('apple-pay-payment-complete');
    complete('success');
  } else if (res.paymentStatus === 'failure') {
    complete('fail');
  }
};


function updateAmount(amount: number, paymentRequest: Object | null) {
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

// We need to intercept the click ourselves because we need to check
// that the user has entered a valid amount before we allow them to continue
function onClick(event, props: PropTypes) {
  event.preventDefault();
  trackComponentClick('apple-pay-clicked');
  updateAmount(props.amount, props.stripePaymentRequestObject);
  props.setStripePaymentRequestButtonClicked();
  const amountIsValid =
    checkAmountOrOtherAmount(
      props.selectedAmounts,
      props.otherAmounts,
      props.contributionType,
      props.countryGroupId,
    );
  if (props.stripePaymentRequestObject && amountIsValid) {
    props.stripePaymentRequestObject.show();
  }
}

// Set this to true to enable Google Pay (good for development)
const weAreSupportingGooglePay = false;

// The value of result will either be:
// . null - browser has no compatible payment method)
// . {applePay: true} - applePay is available
// . {applePay: false} - GooglePay or PaymentRequestApi available
const browserIsCompatible = (result: Object) => {
  if (weAreSupportingGooglePay) {
    return result !== null;
  }
  return result && result.applePay === true;
};

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
    props.onPaymentAuthorised({ paymentMethod: 'Stripe', token: tokenId, stripePaymentMethod: 'StripeApplePay' })
      .then(onComplete(complete));
  });

  paymentRequest.canMakePayment().then((result) => {
    if (browserIsCompatible(result)) {
      trackComponentClick('apple-pay-loaded');
      props.setCanMakeStripePaymentRequestPayment(true);
    }
  });
  props.setStripePaymentRequestObject(paymentRequest);
}

const paymentButtonStyle = {
  paymentRequestButton: {
    theme: 'dark',
    height: '42px',
  },
};


// ---- Component ----- //
function PaymentRequestButton(props: PropTypes) {

  // If we haven't initialised the payment request, initialise it and return null, as we can't insert the button
  // until the async canMakePayment() function has been called on the stripePaymentRequestObject object.
  if (!props.stripePaymentRequestObject) {
    initialisePaymentRequest({ ...props });
    return null;
  }

  // We don't want to check this until we have initialised the payment request object, so the check has to come
  // after the initialisation of the payment request object
  if (!props.canMakeStripePaymentRequestPayment) {
    return null;
  }

  return (
    <div className="stripe-payment-request-button__container">
      <PaymentRequestButtonElement
        paymentRequest={props.stripePaymentRequestObject}
        className="stripe-payment-request-button__button"
        style={paymentButtonStyle}
        onClick={(event) => { onClick(event, props); }}
      />

      <div className="stripe-payment-request-button__divider">
        or
      </div>
    </div>
  );
}

// ----- Auxiliary components ----- //

// ----- Default props----- //

const StripePaymentRequestButton =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(PaymentRequestButton));

export default StripePaymentRequestButton;
