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
  logInvalidCombination,
} from 'helpers/contributions';
import { type ErrorReason } from 'helpers/errorReasons';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { openDialogBox } from 'helpers/paymentIntegrations/stripeCheckout';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/routes';

import ProgressMessage from 'components/progressMessage/progressMessage';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';

import { checkAmount } from 'helpers/formValidation';
import { onFormSubmit } from 'helpers/checkoutForm/onFormSubmit';
import { type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import type { StripePaymentRequestButtonMethod } from 'helpers/paymentIntegrations/readerRevenueApis';

import { ContributionFormFields, EmptyContributionFormFields } from './ContributionFormFields';
import { ContributionTypeTabs, EmptyContributionTypeTabs } from './ContributionTypeTabs';
import { ContributionAmount, EmptyContributionAmount } from './ContributionAmount';
import { PaymentMethodSelector, EmptyPaymentMethodSelector } from './PaymentMethodSelector';
import { ContributionSubmit, EmptyContributionSubmit } from './ContributionSubmit';

import { type State } from 'pages/contributions-landing/contributionsLandingReducer';

import {
  paymentWaiting,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
  setStripeV3HasLoaded,
} from 'pages/contributions-landing/contributionsLandingActions';
import ContributionErrorMessage from './ContributionErrorMessage';
import StripePaymentRequestButtonContainer from './StripePaymentRequestButton/StripePaymentRequestButtonContainer';
import StripeCardFormContainer from './StripeCardForm/StripeCardFormContainer';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, Stripe, ExistingCard, ExistingDirectDebit } from 'helpers/paymentMethods';
import { getCampaignName } from 'helpers/campaigns';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  isWaiting: boolean,
  countryGroupId: CountryGroupId,
  email: string,
  otherAmounts: OtherAmounts,
  paymentMethod: PaymentMethod,
  existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
  thirdPartyPaymentLibraries: ThirdPartyPaymentLibraries,
  contributionType: ContributionType,
  currency: IsoCurrency,
  paymentError: ErrorReason | null,
  selectedAmounts: SelectedAmounts,
  setPaymentIsWaiting: boolean => void,
  openDirectDebitPopUp: () => void,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  setStripeV3HasLoaded: () => void,
  stripeV3HasLoaded: boolean,
  setCheckoutFormHasBeenSubmitted: () => void,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  isSignedIn: boolean,
  formIsValid: boolean,
  isPostDeploymentTestUser: boolean,
  formIsSubmittable: boolean,
  isTestUser: boolean,
  country: IsoCountry,
  stripePaymentRequestButtonMethod: StripePaymentRequestButtonMethod,
  createStripePaymentMethod: () => void,
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
  existingPaymentMethod: state.page.form.existingPaymentMethod,
  thirdPartyPaymentLibraries: state.page.form.thirdPartyPaymentLibraries,
  createStripePaymentMethod: state.page.form.stripeCardFormData.createPaymentMethod,
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
  stripeV3HasLoaded: state.page.form.stripeV3HasLoaded,
  stripePaymentRequestButtonMethod: state.page.form.stripePaymentRequestButtonData.paymentMethod,
});


const mapDispatchToProps = (dispatch: Function) => ({
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
  setStripeV3HasLoaded: () => { dispatch(setStripeV3HasLoaded()); },
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
  ExistingCard: (props: PropTypes) => props.onPaymentAuthorisation({
    paymentMethod: 'ExistingCard',
    billingAccountId: props.existingPaymentMethod.billingAccountId,
  }),
  ExistingDirectDebit: (props: PropTypes) => props.onPaymentAuthorisation({
    paymentMethod: 'ExistingDirectDebit',
    billingAccountId: props.existingPaymentMethod.billingAccountId,
  }),
};

const formHandlers: PaymentMatrix<PropTypes => void> = {
  ONE_OFF: {
    Stripe: (props: PropTypes) => {
      if (props.createStripePaymentMethod) {
        props.createStripePaymentMethod();
      }
    },
    PayPal: (props: PropTypes) => {
      props.setPaymentIsWaiting(true);
      props.createOneOffPayPalPayment({
        currency: props.currency,
        amount: getAmount(
          props.selectedAmounts,
          props.otherAmounts,
          props.contributionType,
        ),
        returnURL: payPalReturnUrl(props.countryGroupId, props.email),
        cancelURL: payPalCancelUrl(props.countryGroupId),
      });
    },
    DirectDebit: () => { logInvalidCombination('ONE_OFF', DirectDebit); },
    ExistingCard: () => { logInvalidCombination('ONE_OFF', ExistingCard); },
    ExistingDirectDebit: () => { logInvalidCombination('ONE_OFF', ExistingDirectDebit); },
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

    // Only recurring uses stripe checkout
    if (props.isPostDeploymentTestUser && props.paymentMethod === Stripe && props.contributionType !== 'ONE_OFF') {
      props.onPaymentAuthorisation({ paymentMethod: Stripe, token: 'tok_visa', stripePaymentMethod: 'StripeCheckout' });
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

function withProps(props: PropTypes) {
  const campaignName = getCampaignName();
  const baseClass = 'form';

  const classModifiers = ['contribution', 'with-labels'];

  return (
    <form onSubmit={onSubmit(props)} className={classNameWithModifiers(baseClass, classModifiers)} noValidate>
      <div className="contributions-form-selectors">
        <ContributionTypeTabs />
        <ContributionAmount
          checkOtherAmount={checkAmount}
        />
      </div>
      <StripePaymentRequestButtonContainer
        setStripeHasLoaded={props.setStripeV3HasLoaded}
        stripeHasLoaded={props.stripeV3HasLoaded}
        currency={props.currency}
        contributionType={props.contributionType}
        isTestUser={props.isTestUser}
        country={props.country}
        otherAmounts={props.otherAmounts}
        selectedAmounts={props.selectedAmounts}
      />
      <div className={classNameWithModifiers('form', ['content'])}>
        <ContributionFormFields />
        <PaymentMethodSelector />

        <StripeCardFormContainer
          setStripeHasLoaded={props.setStripeV3HasLoaded}
          stripeHasLoaded={props.stripeV3HasLoaded}
          currency={props.currency}
          contributionType={props.contributionType}
          paymentMethod={props.paymentMethod}
          isTestUser={props.isTestUser}
          country={props.country}
        />

        <ContributionErrorMessage />
        <ContributionSubmit onPaymentAuthorisation={props.onPaymentAuthorisation} />
      </div>
      <TermsPrivacy
        countryGroupId={props.countryGroupId}
        contributionType={props.contributionType}
        campaignName={campaignName}
      />
      {props.isWaiting ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
    </form>
  );
}

function withoutProps() {
  return (
    <form className={classNameWithModifiers('form', ['contribution'])}>
      <div>
        <EmptyContributionTypeTabs />
        <EmptyContributionAmount />
        <div className={classNameWithModifiers('form', ['content'])}>
          <EmptyContributionFormFields />
          <EmptyPaymentMethodSelector />
          <EmptyContributionSubmit />
        </div>
      </div>
      <div>
        <ProgressMessage message={['Loading the page']} />
      </div>
    </form>
  );
}

export const ContributionForm = connect(mapStateToProps, mapDispatchToProps)(withProps);
export const EmptyContributionForm = withoutProps;
