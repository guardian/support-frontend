// @flow

// ----- Imports ----- //

import { getAmount, type ThirdPartyPaymentLibraries } from 'helpers/contributions';
import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import {
  type ContributionType,
  type PaymentMatrix,
  type PaymentMethod,
  logInvalidCombination,
} from 'helpers/contributions';
import { type ErrorReason } from 'helpers/errorReasons';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { openDialogBox } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/routes';
import { type ApplePayTestVariant } from 'helpers/abTests/abtestDefinitions';

import ProgressMessage from 'components/progressMessage/progressMessage';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';

import { checkAmount } from 'helpers/formValidation';
import { onFormSubmit } from 'helpers/checkoutForm/onFormSubmit';
import { type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { OtherAmounts, SelectedAmounts } from 'helpers/contributions';

import { ContributionFormFields } from './ContributionFormFields';
import ContributionTypeTabs from './ContributionTypeTabs';
import { NewContributionAmount } from './ContributionAmount';
import { NewPaymentMethodSelector } from './PaymentMethodSelector';
import { NewContributionSubmit } from './ContributionSubmit';

import { type State } from '../contributionsLandingReducer';

import {
  paymentWaiting,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
} from '../contributionsLandingActions';
import ContributionErrorMessage from './ContributionErrorMessage';
import StripePaymentRequestButton from './StripePaymentRequestButton';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  isWaiting: boolean,
  countryGroupId: CountryGroupId,
  email: string,
  otherAmounts: OtherAmounts,
  paymentMethod: PaymentMethod,
  thirdPartyPaymentLibraries: ThirdPartyPaymentLibraries,
  contributionType: ContributionType,
  currency: IsoCurrency,
  paymentError: ErrorReason | null,
  selectedAmounts: SelectedAmounts,
  setPaymentIsWaiting: boolean => void,
  openDirectDebitPopUp: () => void,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  isSignedIn: boolean,
  formIsValid: boolean,
  isPostDeploymentTestUser: boolean,
  formIsSubmittable: boolean,
  isTestUser: boolean,
  country: IsoCountry,
  applePayTestVariant: ApplePayTestVariant,
|};

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (formValue: string | null, userValue: string | null): string | null =>
  (formValue === null ? userValue : formValue);

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  isWaiting: state.page.form.isWaiting,
  countryGroupId: state.common.internationalisation.countryGroupId,
  email: getCheckoutFormValue(state.page.form.formData.email, state.page.user.email),
  otherAmounts: state.page.form.formData.otherAmounts,
  paymentMethod: state.page.form.paymentMethod,
  thirdPartyPaymentLibraries: state.page.form.thirdPartyPaymentLibraries,
  contributionType: state.page.form.contributionType,
  currency: state.common.internationalisation.currencyId,
  paymentError: state.page.form.paymentError,
  selectedAmounts: state.page.form.selectedAmounts,
  userTypeFromIdentityResponse: state.page.form.userTypeFromIdentityResponse,
  isSignedIn: state.page.user.isSignedIn,
  formIsValid: state.page.form.formIsValid,
  isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
  formIsSubmittable: state.page.form.formIsSubmittable,
  isTestUser: state.page.user.isTestUser || false,
  country: state.common.internationalisation.countryId,
  applePayTestVariant: state.common.abParticipations.applePay,
});


const mapDispatchToProps = (dispatch: Function) => ({
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
});

// ----- Functions ----- //

// ----- Event handlers ----- //

function openStripePopup(props: PropTypes) {
  const paymentLibraries = props.thirdPartyPaymentLibraries[props.contributionType];
  if (paymentLibraries && paymentLibraries.Stripe) {
    openDialogBox(
      paymentLibraries.Stripe,
      getAmount(
        props.selectedAmounts,
        props.otherAmounts,
        props.contributionType,
      ),
      props.email,
    );
  }
}

// Bizarrely, adding a type to this object means the type-checking on the
// formHandlers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).

const formHandlersForRecurring = {
  PayPal: () => {
    // we don't get an onSubmit event for PayPal recurring, so there
    // is no need to handle anything here
  },
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
        amount: getAmount(
          props.selectedAmounts,
          props.otherAmounts,
          props.contributionType,
        ),
        returnURL: payPalReturnUrl(props.countryGroupId),
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

// Note PayPal recurring flow does not call this function
function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    // Causes errors to be displayed against payment fields
    event.preventDefault();
    const flowPrefix = 'npf';
    const form = event.target;

    if (props.isPostDeploymentTestUser && props.paymentMethod === 'Stripe') {
      props.onPaymentAuthorisation({ paymentMethod: 'Stripe', token: 'tok_visa' });
    } else {
      const handlePayment = () => formHandlers[props.contributionType][props.paymentMethod](props);
      onFormSubmit({
        ...props,
        flowPrefix,
        handlePayment,
        form,
      });
    }
  };
}

// ----- Render ----- //

function ContributionForm(props: PropTypes) {
  return (
    <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
      <ContributionTypeTabs />
      <NewContributionAmount
        checkOtherAmount={checkAmount}
      />
      <StripePaymentRequestButton
        stripeCheckout={props.thirdPartyPaymentLibraries.ONE_OFF.Stripe}
        currency={props.currency}
        contributionType={props.contributionType}
        isTestUser={props.isTestUser}
        country={props.country}
        applePayTestVariant={props.applePayTestVariant}
      />
      <ContributionFormFields />
      <NewPaymentMethodSelector onPaymentAuthorisation={props.onPaymentAuthorisation} />
      <ContributionErrorMessage />
      <NewContributionSubmit onPaymentAuthorisation={props.onPaymentAuthorisation} />
      <TermsPrivacy countryGroupId={props.countryGroupId} />
      {props.isWaiting ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
    </form>
  );
}

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
