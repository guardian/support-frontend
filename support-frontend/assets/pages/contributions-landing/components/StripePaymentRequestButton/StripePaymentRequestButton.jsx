// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { fetchJson, requestOptions } from 'helpers/fetch';
import {
  injectStripe,
  PaymentRequestButtonElement,
} from 'react-stripe-elements';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type {
  ContributionType,
  OtherAmounts,
  SelectedAmounts,
} from 'helpers/contributions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type PaymentResult,
  type StripePaymentMethod,
  type StripePaymentRequestButtonMethod,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { checkAmountOrOtherAmount, isValidEmail } from 'helpers/formValidation';
import {
  Canada,
  type CountryGroupId,
  UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import {trackComponentClick, trackComponentLoad} from 'helpers/tracking/behaviour';
import type {
  CaState,
  IsoCountry,
  UsState,
} from 'helpers/internationalisation/country';
import { logException } from 'helpers/logger';
import type {
  State, Stripe3DSResult,
  StripePaymentRequestButtonData,
} from 'pages/contributions-landing/contributionsLandingReducer';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';
import {
  onThirdPartyPaymentAuthorised,
  paymentWaiting as setPaymentWaiting, setHandleStripe3DS,
  setPaymentRequestButtonPaymentMethod,
  setStripePaymentRequestButtonClicked,
  setStripePaymentRequestButtonError,
  setStripePaymentRequestObject,
  setStripePaymentRequestClientSecret,
  updateEmail,
  updateFirstName,
  updateLastName,
  updatePaymentMethod,
  updateState,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { Stripe } from 'helpers/paymentMethods';
import { toHumanReadableContributionType } from 'helpers/checkouts';
import type { StripeAccount } from 'helpers/paymentIntegrations/stripeCheckout';
import type { ErrorReason } from 'helpers/errorReasons';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import { getAvailablePaymentRequestButtonPaymentMethod } from 'helpers/checkouts';

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
  stateOrProvince: UsState | CaState | null,
  isTestUser: boolean,
  amount: number,
  stripePaymentRequestButtonData: StripePaymentRequestButtonData,
  setPaymentRequestButtonPaymentMethod: (StripePaymentRequestButtonMethod, StripeAccount) => void,
  setStripePaymentRequestObject: (paymentRequest: Object, stripeAccount: StripeAccount) => void,
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
  setStripePaymentRequestButtonClicked: (stripeAccount: StripeAccount) => void,
  toggleOtherPaymentMethods: () => void,
  updateEmail: string => void,
  updateFirstName: string => void,
  updateLastName: string => void,
  updateStateOrProvince: (state: UsState | CaState | null) => void,
  paymentMethod: PaymentMethod,
  setAssociatedPaymentMethod: () => (Function) => void,
  stripeAccount: StripeAccount,
  stripeKey: string,
  setPaymentWaiting: (isWaiting: boolean) => Action,
  setError: (error: ErrorReason, stripeAccount: StripeAccount) => Action,
  setHandleStripe3DS: ((clientSecret: string) => Promise<Stripe3DSResult>) => Action,
  setSetupIntentClientSecret: (setupIntentClientSecret: string) => Action,
|};

const mapStateToProps = (state: State, ownProps: PropTypes) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  stripePaymentRequestButtonData: state.page.form.stripePaymentRequestButtonData[ownProps.stripeAccount],
  countryGroupId: state.common.internationalisation.countryGroupId,
  country: state.common.internationalisation.countryId,
  stateOrProvince: state.page.form.formData.state,
  currency: state.common.internationalisation.currencyId,
  isTestUser: state.page.user.isTestUser || false,
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  switches: state.common.settings.switches,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised: (paymentAuthorisation: PaymentAuthorisation) =>
    dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation)),
  setPaymentRequestButtonPaymentMethod:
    (paymentMethod: StripePaymentRequestButtonMethod, stripeAccount: StripeAccount) =>
      dispatch(setPaymentRequestButtonPaymentMethod(paymentMethod, stripeAccount)),
  setStripePaymentRequestObject: (paymentRequest: Object, stripeAccount: StripeAccount) =>
    dispatch(setStripePaymentRequestObject(paymentRequest, stripeAccount)),
  updateEmail: (email: string) => dispatch(updateEmail(email)),
  updateFirstName: (firstName: string) => dispatch(updateFirstName(firstName)),
  updateLastName: (lastName: string) => dispatch(updateLastName(lastName)),
  updateStateOrProvince: (state: UsState | CaState | null) => dispatch(updateState(state)),
  setStripePaymentRequestButtonClicked: (stripeAccount: StripeAccount) =>
    dispatch(setStripePaymentRequestButtonClicked(stripeAccount)),
  setAssociatedPaymentMethod: () => dispatch(updatePaymentMethod(Stripe)),
  setPaymentWaiting: (isWaiting: boolean) => dispatch(setPaymentWaiting(isWaiting)),
  setError: (error: ErrorReason, stripeAccount: StripeAccount) =>
    dispatch(setStripePaymentRequestButtonError(error, stripeAccount)),
  setHandleStripe3DS: (handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>) =>
    dispatch(setHandleStripe3DS(handleStripe3DS)),
  setSetupIntentClientSecret: (setupIntentClientSecret: string) =>
    dispatch(setStripePaymentRequestClientSecret(setupIntentClientSecret)),
});


// ----- Functions -----//


function updatePayerEmail(data: Object, setEmail: string => void) {
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

function updatePayerName(data: Object, setFirstName: string => void, setLastName: string => void): boolean {
  const nameParts = data.payerName.split(' ');
  if (nameParts.length > 2) {
    setFirstName(nameParts[0]);
    setLastName(nameParts.slice(1).join(' '));
    return true;
  } else if (nameParts.length === 2) {
    setFirstName(nameParts[0]);
    setLastName(nameParts[1]);
    return true;
  } else if (nameParts.length === 1) {
    logException(`Failed to set name: no spaces in data object: ${nameParts.join('')}`);
    return false;
  }
  logException('Failed to set name: no name in data object');
  return false;

}

// Attempt to get state/province from the token, otherwise fall back on the value in the form
function updatePayerStateOrProvince(
  token: Object,
  stateOrProvinceFromForm: UsState | CaState | null,
  setStateOrProvince: (UsState | CaState | null) => void
): boolean {
  // const stateOrProvinceFromCard = token.card.address_state;
  const stateOrProvinceFromCard = token.billing_details.address.state;
  if (stateOrProvinceFromCard) {
    setStateOrProvince(stateOrProvinceFromCard);
    return true;
  } else if (stateOrProvinceFromForm) {
    return true;
  }
  logException('Missing address_state in payment request token and no state/province selected in the form');
  return false;

}

const onComplete = () => (res: PaymentResult) => {
  if (res.paymentStatus === 'success') {
    trackComponentClick('apple-pay-payment-complete');
  }
};


function updateTotal(props: PropTypes) {
  // When the other tab is clicked, the value of amount is NaN
  if (!Number.isNaN(props.amount) && props.stripePaymentRequestButtonData.stripePaymentRequestObject) {
    props.stripePaymentRequestButtonData.stripePaymentRequestObject.update({
      total: {
        label: `${toHumanReadableContributionType(props.contributionType)} Contribution`,
        amount: props.amount * 100,
      },
    });
  }
}

// We need to intercept the click ourselves because we need to check
// that the user has entered a valid amount before we allow them to continue
function onClick(event, props: PropTypes) {
  event.preventDefault();
  trackComponentClick('apple-pay-clicked');
  updateTotal(props);
  props.setAssociatedPaymentMethod();
  props.setStripePaymentRequestButtonClicked(props.stripeAccount);
  const amountIsValid =
    checkAmountOrOtherAmount(
      props.selectedAmounts,
      props.otherAmounts,
      props.contributionType,
      props.countryGroupId,
    );
  if (props.stripePaymentRequestButtonData.stripePaymentRequestObject && amountIsValid) {
    props.stripePaymentRequestButtonData.stripePaymentRequestObject.show();
  }
}

function setUpPaymentListener(props: PropTypes, paymentRequest: Object, stripePaymentMethod: StripePaymentMethod) {
  paymentRequest.on('paymentmethod', ({ complete, paymentMethod, ...data }) => {
    debugger

    // Always dismiss the payment popup immediately - any pending/success/failure will be displayed on our own page.
    // This is because `complete` must be called within 30 seconds or the user will see an error.
    // Our backend (support-workers) can in extreme cases take longer than this, so we must call complete now.
    // This means that the browser's payment popup will be dismissed, and our own 'spinner' will be displayed until
    // the backend job finishes.
    complete('success');

    // We need to do this so that we can offer marketing permissions on the thank you page
    updatePayerEmail(data, props.updateEmail);

    const stateOrProvinceUpdateOk = props.countryGroupId === UnitedStates || props.countryGroupId === Canada ?
      updatePayerStateOrProvince(paymentMethod, props.stateOrProvince, props.updateStateOrProvince) : true;

    const nameUpdateOk: boolean = props.stripeAccount !== 'ONE_OFF' ?
      updatePayerName(data, props.updateFirstName, props.updateLastName) : true;

    if (nameUpdateOk && stateOrProvinceUpdateOk) {
      if (data.methodName) {
        // https://stripe.com/docs/stripe-js/reference#payment-response-object
        // methodName:
        // "The unique name of the payment handler the customer
        // chose to authorize payment. For example, 'basic-card'."
        trackComponentClick(`${data.methodName}-paymentAuthorised`);
      }
      props.setPaymentWaiting(true);

      if (props.contributionType === 'ONE_OFF') {
        props.onPaymentAuthorised({paymentMethod: Stripe, paymentMethodId: paymentMethod.id, stripePaymentMethod})
          .then(onComplete());
      } else {
        fetchClientSecret(props)
          .then(clientSecret => {
            return new Promise(function(resolve) {
              setTimeout(resolve.bind(null, clientSecret), 10000)
            })
          })
          .then(clientSecret => {
            console.log("got clientSecret")
            props.setSetupIntentClientSecret(clientSecret);

            props.stripe.confirmCardSetup(
              clientSecret,
              { payment_method: paymentMethod.id }
            ).then(confirmResult => {
              debugger

              if (confirmResult.error) {
                console.log("Error confirming:", confirmResult)
                // TODO - fail properly
              } else {
                props.onPaymentAuthorised({paymentMethod: Stripe, paymentMethodId: paymentMethod.id, stripePaymentMethod})
                  .then(onComplete());
              }
            })
          });
      }
    } else {
      props.setError('incomplete_payment_request_details', props.stripeAccount);
    }
  });
}

function fetchClientSecret(props: PropTypes): Promise<string> {
  // Start by requesting the client_secret for a new SetupIntent.
  // Note - because this value is requested asynchronously when the component loads,
  // it's possible for it to arrive after the user clicks 'Contribute'. This eventuality
  // is handled in the callback below by checking the value of paymentWaiting.
  return fetchJson(
    window.guardian.stripeSetupIntentEndpoint,
    requestOptions({ publicKey: props.stripeKey }, 'omit', 'POST', null),
  ).then((result) => {
    if (result.client_secret) {
      // console.log("got client_secret",result.client_secret)
      // props.setSetupIntentClientSecret(result.client_secret);
      // If user has already clicked contribute then handle card setup now
      if (props.paymentWaiting) {
        // TODO - call a callback
        // this.handleCardSetupForRecurring(result.client_secret);
      }

      return result.client_secret;
    } else {
      throw new Error(`Missing client_secret field in response from ${window.guardian.stripeSetupIntentEndpoint}`);
    }
  }).catch((error) => {
    logException(`Error getting Stripe client secret for recurring contribution: ${error}`);
    props.paymentFailure('internal_error');
  });
}

function initialisePaymentRequest(props: PropTypes) {
  const paymentRequest = props.stripe.paymentRequest({
    country: props.country,
    currency: props.currency.toLowerCase(),
    total: {
      label: `${toHumanReadableContributionType(props.contributionType)} Contribution`,
      amount: props.amount * 100,
    },
    requestPayerEmail: true,
    requestPayerName: props.stripeAccount !== 'ONE_OFF',
  });

  paymentRequest.canMakePayment().then((result) => {
    const paymentMethod = getAvailablePaymentRequestButtonPaymentMethod(result, props.contributionType);
    if (paymentMethod) {
      props.setPaymentRequestButtonPaymentMethod(paymentMethod, props.stripeAccount);
      trackComponentClick(`${paymentMethod}-loaded`);

      if (props.contributionType !== 'ONE_OFF') {
        setUpPaymentListener(props, paymentRequest, paymentMethod);
      } else {
        setUpPaymentListener(props, paymentRequest, paymentMethod);
      }
    } else {
      props.setPaymentRequestButtonPaymentMethod('none', props.stripeAccount);
    }5
  });

  props.setStripePaymentRequestObject(paymentRequest, props.stripeAccount);

  if (props.contributionType === 'ONE_OFF') {
    // TODO - duplicate of one in StripeCardForm
    props.setHandleStripe3DS((clientSecret: string) => {
      trackComponentLoad('stripe-3ds');
      return props.stripe.handleCardAction(clientSecret);
    });
  }
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
  if (!props.stripePaymentRequestButtonData.stripePaymentRequestObject) {
    initialisePaymentRequest({ ...props });
    return null;
  }

  if (
    !props.stripePaymentRequestButtonData.paymentMethod ||
    props.stripePaymentRequestButtonData.paymentMethod === 'none'
  ) {
    return null;
  }

  return (
    <div
      className="stripe-payment-request-button__container"
      data-for-stripe-account={props.stripeAccount}
      data-for-contribution-type={props.contributionType}
    >
      <PaymentRequestButtonElement
        paymentRequest={props.stripePaymentRequestButtonData.stripePaymentRequestObject}
        className="stripe-payment-request-button__button"
        style={paymentButtonStyle}
        onClick={(event) => {
          onClick(event, props);
        }}
      />

      {
        props.stripePaymentRequestButtonData.paymentError &&
        <GeneralErrorMessage errorReason={props.stripePaymentRequestButtonData.paymentError} />
      }

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
