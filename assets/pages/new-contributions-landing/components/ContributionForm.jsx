// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { countryGroupSpecificDetails, type CountryMetaData } from 'helpers/internationalisation/contributions';
import { type UsState, type CaState } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { type PaymentHandler } from 'helpers/checkouts';
import {
  config,
  type Contrib,
  type Amount,
  type PaymentMatrix,
  type PaymentMethod,
  logInvalidCombination,
} from 'helpers/contributions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { openDialogBox } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/routes';

import PaymentFailureMessage from 'components/paymentFailureMessage/paymentFailureMessage';
import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';
import ProgressMessage from 'components/progressMessage/progressMessage';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import Signout from 'components/signout/signout';


import {
  checkFirstName,
  checkLastName,
  checkState,
  checkEmail,
  isNotEmpty,
  isSmallerOrEqual,
  isLargerOrEqual,
  maxTwoDecimals,
  emailRegexPattern,
} from 'helpers/formValidation';

import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewContributionPayment } from './ContributionPayment';
import { NewContributionState } from './ContributionState';
import { NewContributionSubmit } from './ContributionSubmit';
import { NewContributionTextInput } from './ContributionTextInput';

import { type State } from '../contributionsLandingReducer';

import {
  paymentWaiting,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateState,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
} from '../contributionsLandingActions';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  paymentComplete: boolean,
  paymentError: CheckoutFailureReason | null,
  isWaiting: boolean,
  countryGroupId: CountryGroupId,
  selectedCountryGroupDetails: CountryMetaData,
  contributionType: Contrib,
  thankYouRoute: string,
  firstName: string,
  lastName: string,
  email: string,
  state: UsState | CaState | null,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  otherAmount: string | null,
  paymentMethod: PaymentMethod,
  isSignedIn: boolean,
  paymentHandlers: PaymentMatrix<PaymentHandler | null>,
  updateFirstName: Event => void,
  updateLastName: Event => void,
  updateEmail: Event => void,
  updateState: Event => void,
  setPaymentIsWaiting: boolean => void,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  checkoutFormHasBeenSubmitted: boolean,
  setCheckoutFormHasBeenSubmitted: () => void,
  openDirectDebitPopUp: () => void,
  isDirectDebitPopUpOpen: boolean,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  currency: IsoCurrency,
|};

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (formValue: string | null, userValue: string | null): string | null =>
  (formValue === null ? userValue : formValue);

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  paymentComplete: state.page.form.paymentComplete,
  isWaiting: state.page.form.isWaiting,
  countryGroupId: state.common.internationalisation.countryGroupId,
  firstName: getCheckoutFormValue(state.page.form.formData.firstName, state.page.user.firstName),
  lastName: getCheckoutFormValue(state.page.form.formData.lastName, state.page.user.lastName),
  email: getCheckoutFormValue(state.page.form.formData.email, state.page.user.email),
  state: state.page.form.formData.state,
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmount: state.page.form.formData.otherAmounts[state.page.form.contributionType].amount,
  paymentMethod: state.page.form.paymentMethod,
  isSignedIn: state.page.user.isSignedIn,
  paymentHandlers: state.page.form.paymentHandlers,
  contributionType: state.page.form.contributionType,
  checkoutFormHasBeenSubmitted: state.page.form.formData.checkoutFormHasBeenSubmitted,
  isDirectDebitPopUpOpen: state.page.directDebit.isPopUpOpen,
  currency: state.common.internationalisation.currencyId,
  paymentError: state.page.form.paymentError,
});


const mapDispatchToProps = (dispatch: Function) => ({
  updateFirstName: (event) => { dispatch(updateFirstName(event.target.value)); },
  updateLastName: (event) => { dispatch(updateLastName(event.target.value)); },
  updateEmail: (event) => { dispatch(updateEmail(event.target.value)); },
  updateState: (event) => { dispatch(updateState(event.target.value === '' ? null : event.target.value)); },
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
});

// ----- Functions ----- //

// TODO: we've got this and a similar function in contributionLandingActions
// I think a better model would be to represent the amount as a number in
// the state, and use this logic to keep it in sync with the view-level selectedAmounts and otherAmounts.
const getAmount = (props: PropTypes) =>
  parseFloat(props.selectedAmounts[props.contributionType] === 'other'
    ? props.otherAmount
    : props.selectedAmounts[props.contributionType].value);

// ----- Event handlers ----- //

function openStripePopup(props: PropTypes) {
  if (props.paymentHandlers[props.contributionType] && props.paymentHandlers[props.contributionType].Stripe) {
    openDialogBox(props.paymentHandlers[props.contributionType].Stripe, getAmount(props), props.email);
  }
}

// Bizarrely, adding a type to this object means the type-checking on the
// formHandlers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).
const formHandlersForRecurring = {
  PayPal: () => { /* TODO PayPal recurring */ },
  Stripe: openStripePopup,
  DirectDebit: (props: PropTypes) => {
    props.openDirectDebitPopUp();
  },
};

const formHandlers: PaymentMatrix<PropTypes => void> = {
  ONE_OFF: {
    Stripe: openStripePopup,
    PayPal: (props: PropTypes) => {
      props.setPaymentIsWaiting(true);
      props.createOneOffPayPalPayment({
        currency: props.currency,
        amount: getAmount(props),
        returnURL: payPalReturnUrl(props.countryGroupId),
        // TODO: use new cancel url
        cancelURL: payPalCancelUrl(props.countryGroupId),
      });
    },
    DirectDebit: () => { logInvalidCombination('ONE_OFF', 'DirectDebit'); },
    None: () => { logInvalidCombination('ONE_OFF', 'None'); },
  },
  ANNUAL: {
    ...formHandlersForRecurring,
    None: () => { logInvalidCombination('ANNUAL', 'None'); },
  },
  MONTHLY: {
    ...formHandlersForRecurring,
    None: () => { logInvalidCombination('MONTHLY', 'None'); },
  },
};


function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    // Causes errors to be displayed against payment fields
    props.setCheckoutFormHasBeenSubmitted();
    event.preventDefault();
    if (!(event.target: any).checkValidity()) {
      return;
    }
    formHandlers[props.contributionType][props.paymentMethod](props);
  };
}

// ----- Render ----- //

function ContributionForm(props: PropTypes) {
  const {
    countryGroupId,
    selectedCountryGroupDetails,
    thankYouRoute,
    firstName,
    lastName,
    email,
    state,
    isSignedIn,
    checkoutFormHasBeenSubmitted,
  } = props;

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const checkOtherAmount: string => boolean = input =>
    isNotEmpty(input)
    && isLargerOrEqual(config[props.countryGroupId][props.contributionType].min, input)
    && isSmallerOrEqual(config[props.countryGroupId][props.contributionType].max, input)
    && maxTwoDecimals(input);

  return props.paymentComplete ?
    <Redirect to={thankYouRoute} />
    : (
      <div className="gu-content__content">
        <h1 className="header">{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
        <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
          <NewContributionType />
          <NewContributionAmount
            countryGroupDetails={selectedCountryGroupDetails}
            checkOtherAmount={checkOtherAmount}
          />
          <NewContributionTextInput
            id="contributionEmail"
            name="contribution-email"
            label="Email address"
            value={email}
            type="email"
            autoComplete="email"
            placeholder="example@domain.com"
            icon={<SvgEnvelope />}
            onInput={props.updateEmail}
            isValid={checkEmail(email)}
            pattern={emailRegexPattern}
            formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
            errorMessage="Please provide a valid email address"
            required
            disabled={isSignedIn}
          />
          <Signout isSignedIn={isSignedIn} />
          <NewContributionTextInput
            id="contributionFirstName"
            name="contribution-fname"
            label="First name"
            value={firstName}
            icon={<SvgUser />}
            autoComplete="given-name"
            autoCapitalize="words"
            onInput={props.updateFirstName}
            isValid={checkFirstName(firstName)}
            formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
            errorMessage="Please provide your first name"
            required
          />
          <NewContributionTextInput
            id="contributionLastName"
            name="contribution-lname"
            label="Last name"
            value={lastName}
            icon={<SvgUser />}
            autoComplete="family-name"
            autoCapitalize="words"
            onInput={props.updateLastName}
            isValid={checkLastName(lastName)}
            formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
            errorMessage="Please provide your last name"
            required
          />
          <NewContributionState
            onChange={props.updateState}
            selectedState={state}
            isValid={checkState(state)}
            formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
            errorMessage="Please provide a state"
          />
          <NewContributionPayment onPaymentAuthorisation={onPaymentAuthorisation} />
          <PaymentFailureMessage checkoutFailureReason={props.paymentError} />
          <NewContributionSubmit
            whenUnableToOpen={props.setCheckoutFormHasBeenSubmitted}
          />
          {props.isWaiting ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </form>
        <DirectDebitPopUpForm
          onPaymentAuthorisation={onPaymentAuthorisation}
          isPopUpOpen={props.isDirectDebitPopUpOpen}
        />
      </div>
    );
}

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
