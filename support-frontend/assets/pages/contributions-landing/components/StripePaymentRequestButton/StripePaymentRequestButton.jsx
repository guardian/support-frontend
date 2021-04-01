// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchJson, requestOptions } from 'helpers/fetch';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/react-stripe-js';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type PaymentResult,
  type StripePaymentMethod,
  type StripePaymentRequestButtonMethod,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { amountOrOtherAmountIsValid, isValidEmail } from 'helpers/formValidation';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';
import type { IsoCountry, StateProvince } from 'helpers/internationalisation/country';
import { findIsoCountry, stateProvinceFromString } from 'helpers/internationalisation/country';
import { logException } from 'helpers/logger';
import type {
  State,
  Stripe3DSResult,
  StripePaymentRequestButtonData,
} from 'pages/contributions-landing/contributionsLandingReducer';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';
import {
  onThirdPartyPaymentAuthorised,
  paymentWaiting as setPaymentWaiting,
  setHandleStripe3DS,
  setPaymentRequestButtonPaymentMethod,
  setStripePaymentRequestButtonClicked,
  setStripePaymentRequestButtonError,
  setStripePaymentRequestObject,
  updateBillingCountry,
  updateBillingState,
  updateEmail,
  updateFirstName,
  updateLastName,
  updatePaymentMethod,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { Stripe } from 'helpers/paymentMethods';
import type { StripeAccount } from 'helpers/stripe';
import type { ErrorReason } from 'helpers/errorReasons';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { toHumanReadableContributionType, getAvailablePaymentRequestButtonPaymentMethod } from 'helpers/checkouts';
import type { Option } from 'helpers/types/option';
import type { Csrf as CsrfState } from '../../../../helpers/csrf/csrfReducer';
import { trackComponentEvents } from '../../../../helpers/tracking/ophan';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  country: IsoCountry,
  currency: IsoCurrency,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
  billingState: StateProvince | null,
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
  updateBillingState: (billingState: StateProvince | null) => void,
  updateBillingCountry: IsoCountry => void,
  paymentMethod: PaymentMethod,
  setAssociatedPaymentMethod: () => (Function) => void,
  stripeAccount: StripeAccount,
  stripeKey: string,
  setPaymentWaiting: (isWaiting: boolean) => Action,
  setError: (error: ErrorReason, stripeAccount: StripeAccount) => Action,
  setHandleStripe3DS: ((clientSecret: string) => Promise<Stripe3DSResult>) => Action,
  csrf: CsrfState,
  stripePaymentRequestButtonVariant: boolean,
};

const mapStateToProps = (state: State, ownProps: PropTypes) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  stripePaymentRequestButtonData: state.page.form.stripePaymentRequestButtonData[ownProps.stripeAccount],
  countryGroupId: state.common.internationalisation.countryGroupId,
  country: state.common.internationalisation.countryId,
  billingState: state.page.form.formData.billingState,
  currency: state.common.internationalisation.currencyId,
  isTestUser: state.page.user.isTestUser || false,
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  switches: state.common.settings.switches,
  csrf: state.page.csrf,
  stripePaymentRequestButtonVariant: state.common.abParticipations.stripePaymentRequestButtonDec2020 === 'PRB',
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
  updateBillingState: (billingState: StateProvince | null) => dispatch(updateBillingState(billingState)),
  updateBillingCountry: (billingCountry: IsoCountry) => dispatch(updateBillingCountry(billingCountry)),
  setStripePaymentRequestButtonClicked: (stripeAccount: StripeAccount) =>
    dispatch(setStripePaymentRequestButtonClicked(stripeAccount)),
  setAssociatedPaymentMethod: () => dispatch(updatePaymentMethod(Stripe)),
  setPaymentWaiting: (isWaiting: boolean) => dispatch(setPaymentWaiting(isWaiting)),
  setError: (error: ErrorReason, stripeAccount: StripeAccount) =>
    dispatch(setStripePaymentRequestButtonError(error, stripeAccount)),
  setHandleStripe3DS: (handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>) =>
    dispatch(setHandleStripe3DS(handleStripe3DS)),
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
  // NB: This turns "    jean    claude    van    damme     " into ["jean", "claude", "van", "damme"]
  const nameParts = data.payerName.trim().replace(/\s+/g, ' ').split(' ');
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

const onComplete = (res: PaymentResult) => {
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
  trackComponentClick('apple-pay-clicked');
  updateTotal(props);
  props.setAssociatedPaymentMethod();
  props.setStripePaymentRequestButtonClicked(props.stripeAccount);
  const amountIsValid =
    amountOrOtherAmountIsValid(
      props.selectedAmounts,
      props.otherAmounts,
      props.contributionType,
      props.countryGroupId,
    );

  if (!amountIsValid) {
    event.preventDefault();
  }
}

// Requests a new SetupIntent and returns the associated clientSecret
function fetchClientSecret(props: PropTypes): Promise<string> {
  return fetchJson(
    '/stripe/create-setup-intent/prb',
    requestOptions({ stripePublicKey: props.stripeKey }, 'omit', 'POST', props.csrf),
  ).then((result) => {
    if (result.client_secret) {
      return Promise.resolve(result.client_secret);
    }
    return Promise.reject(new Error('Missing client_secret field in response for PRB'));

  });
}

// General handler for tasks common to both SCA and non-SCA payments.
// The given processPayment function handles any specific payment completion tasks.
function onPayment(
  props: PropTypes,
  paymentRequestComplete: (string) => void,
  paymentRequestData: Object,
  billingCountryFromCard?: string,
  billingStateFromCard?: string,
  processPayment: () => void,
): void {
  // Always dismiss the payment popup immediately - any pending/success/failure will be displayed on our own page.
  // This is because `complete` must be called within 30 seconds or the user will see an error.
  // Our backend (support-workers) can in extreme cases take longer than this, so we must call complete now.
  // This means that the browser's payment popup will be dismissed, and our own 'spinner' will be displayed until
  // the backend job finishes.
  paymentRequestComplete('success');

  // We always need an email address to do ecommerce on support.theguardian.com
  updatePayerEmail(paymentRequestData, props.updateEmail);

  // Single doesn't need a name, but recurring (i.e. Zuora and Salesforce) needs a non-empty first and last name.
  const nameValueOk: boolean = props.contributionType === 'ONE_OFF' ||
    updatePayerName(paymentRequestData, props.updateFirstName, props.updateLastName);

  // Single doesn't need a state, however recurring (i.e. Zuora) needs a valid state for US and CA billing countries.
  const validatedCountryFromCard: Option<IsoCountry> = findIsoCountry(billingCountryFromCard);
  const billingAccountRequiresAState =
    props.contributionType !== 'ONE_OFF' && ['US', 'CA'].includes(validatedCountryFromCard);

  let countryAndStateValueOk = !billingAccountRequiresAState; // If Zuora requires a state then we're not OK yet.
  if (validatedCountryFromCard) {
    const validatedBillingStateFromCard: Option<StateProvince> =
      stateProvinceFromString(validatedCountryFromCard, billingStateFromCard);
    if (billingAccountRequiresAState && !validatedBillingStateFromCard) {
      logException(`Invalid billing state: ${billingStateFromCard || ''} for billing country: ${billingCountryFromCard || ''}`);
      // Don't update the form, because the user may pick another payment method that doesn't update formData.
    } else {
      // Update the form data with the billing country value and a valid-or-null billing state
      props.updateBillingCountry(validatedCountryFromCard);
      props.updateBillingState(validatedBillingStateFromCard);
      countryAndStateValueOk = true;
    }
  }

  if (nameValueOk && countryAndStateValueOk) {
    if (paymentRequestData.methodName) {
      // https://stripe.com/docs/stripe-js/reference#payment-response-object
      // methodName:
      // "The unique name of the payment handler the customer
      // chose to authorize payment. For example, 'basic-card'."
      trackComponentClick(`${paymentRequestData.methodName}-paymentAuthorised`);
    }
    props.setPaymentWaiting(true);

    processPayment();
  } else {
    props.setError('incomplete_payment_request_details', props.stripeAccount);
  }
}

function setUpPaymentListenerSca(
  props: PropTypes,
  stripe: stripeJs.Stripe,
  paymentRequest: Object,
  stripePaymentMethod: StripePaymentMethod,
) {
  paymentRequest.on('paymentmethod', ({ complete, paymentMethod, ...data }) => {

    const processPayment = () => {
      const walletType = paymentMethod && paymentMethod.card && paymentMethod.card.wallet ? paymentMethod.card.wallet.type : 'no-wallet';
      trackComponentEvents({
        component: {
          componentType: 'ACQUISITIONS_OTHER',
        },
        action: 'CLICK',
        id: 'stripe-prb-wallet',
        value: walletType,
      });

      if (props.contributionType === 'ONE_OFF') {
        props.onPaymentAuthorised({
          paymentMethod: Stripe,
          paymentMethodId: paymentMethod.id,
          stripePaymentMethod,
        }).then(onComplete);
      } else {
        // For recurring we need to request a new SetupIntent,
        // and then provide the associated clientSecret for confirmation
        fetchClientSecret(props)
          .then((clientSecret: string) => {

            stripe.confirmCardSetup(
              clientSecret,
              { payment_method: paymentMethod.id },
            ).then((confirmResult) => {

              if (confirmResult.error) {
                props.setError('card_authentication_error', props.stripeAccount);
                props.setPaymentWaiting(false);
              } else {
                props.onPaymentAuthorised({
                  paymentMethod: Stripe,
                  paymentMethodId: paymentMethod.id,
                  stripePaymentMethod,
                }).then(onComplete);
              }
            });
          }).catch((error) => {
            logException(`Error confirming recurring contribution from Payment Request Button: ${error}`);
            props.setError('internal_error', props.stripeAccount);
            props.setPaymentWaiting(false);
          });
      }
    };

    onPayment(
      props,
      complete,
      data,
      paymentMethod.billing_details.address.country,
      paymentMethod.billing_details.address.state,
      processPayment,
    );
  });
}

function initialisePaymentRequest(props: PropTypes, stripe: stripeJs.Stripe) {
  const paymentRequest = stripe.paymentRequest({
    country: props.country,
    currency: props.currency.toLowerCase(),
    total: {
      label: `${toHumanReadableContributionType(props.contributionType)} Contribution`,
      amount: props.amount * 100,
    },
    requestPayerEmail: true,
    requestPayerName: props.contributionType !== 'ONE_OFF',
  });

  paymentRequest.canMakePayment().then((result) => {
    const paymentMethod = getAvailablePaymentRequestButtonPaymentMethod(result, props.contributionType);
    if (paymentMethod) {
      // Track the fact that it loaded, even if the user is in the control for the PRB test
      trackComponentLoad(`${paymentMethod}-loaded`);

      if (paymentMethod === 'StripeApplePay' || props.stripePaymentRequestButtonVariant) {
        trackComponentLoad(`${paymentMethod}-displayed`);
        props.setPaymentRequestButtonPaymentMethod(paymentMethod, props.stripeAccount);
        setUpPaymentListenerSca(props, stripe, paymentRequest, paymentMethod);
      }
    } else {
      props.setPaymentRequestButtonPaymentMethod('none', props.stripeAccount);
    }
  });

  props.setStripePaymentRequestObject(paymentRequest, props.stripeAccount);

  // Only need 3DS handler for one-offs - recurring has its own special flow via confirmCardSetup
  if (props.contributionType === 'ONE_OFF') {
    props.setHandleStripe3DS((clientSecret: string) => {
      trackComponentLoad('stripe-3ds');
      return stripe.handleCardAction(clientSecret);
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
const PaymentRequestButton = (props: PropTypes) => {

  const stripe = stripeJs.useStripe();

  useEffect(() => {
    // Call canMakePayment on the paymentRequest object only once, once the stripe object is ready
    if (stripe) {
      initialisePaymentRequest({ ...props }, stripe);
    }
  }, [stripe]);

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
        options={{
          paymentRequest: props.stripePaymentRequestButtonData.stripePaymentRequestObject,
        }}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequestButton);
