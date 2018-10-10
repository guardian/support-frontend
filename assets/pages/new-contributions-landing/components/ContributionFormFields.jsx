// @flow

// ----- Imports ----- //

import PayPalExpressButton from 'components/paymentButtons/payPalExpressButton/payPalExpressButtonNewFlow';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import { setPayPalHasLoaded } from 'pages/new-contributions-landing/contributionsLandingActions';
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
  baseHandlers,
} from 'helpers/contributions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { openDialogBox } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getAbsoluteURL } from 'helpers/url';
import { routes, payPalCancelUrl } from 'helpers/routes';

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
  firstName: string,
  lastName: string,
  email: string,
  state: UsState | CaState | null,
  isSignedIn: boolean,
  updateFirstName: Event => void,
  updateLastName: Event => void,
  updateEmail: Event => void,
  updateState: Event => void,
|};

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (formValue: string | null, userValue: string | null): string | null =>
  (formValue === null ? userValue : formValue);

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  firstName: getCheckoutFormValue(state.page.form.formData.firstName, state.page.user.firstName),
  lastName: getCheckoutFormValue(state.page.form.formData.lastName, state.page.user.lastName),
  email: getCheckoutFormValue(state.page.form.formData.email, state.page.user.email),
  state: state.page.form.formData.state,
  isSignedIn: state.page.user.isSignedIn,
});


const mapDispatchToProps = (dispatch: Function) => ({
  updateFirstName: (event) => { dispatch(updateFirstName(event.target.value)); },
  updateLastName: (event) => { dispatch(updateLastName(event.target.value)); },
  updateEmail: (event) => { dispatch(updateEmail(event.target.value)); },
  updateState: (event) => { dispatch(updateState(event.target.value === '' ? null : event.target.value)); },
});


// ----- Render ----- //

function FormFields(props: PropTypes) {
  const {
    firstName,
    lastName,
    email,
    isSignedIn,
    checkoutFormHasBeenSubmitted,
  } = props;
  return (
    <div className="form-fields">
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
    </div>
  );
}

const ContributionFormFields = connect(mapStateToProps, mapDispatchToProps)(FormFields);

export { ContributionFormFields };
