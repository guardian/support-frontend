// @flow

// ----- Imports ----- //

import { type Amount, type ThirdPartyPaymentLibraries } from 'helpers/contributions';
import type { CountryMetaData } from 'helpers/internationalisation/contributions';
import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import {
  config,
  type Contrib,
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
import ProgressMessage from 'components/progressMessage/progressMessage';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';

import {
  isNotEmpty,
  isSmallerOrEqual,
  isLargerOrEqual,
  maxTwoDecimals,
} from 'helpers/formValidation';

import { ContributionFormFields } from './ContributionFormFields';
import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewPaymentMethodSelector } from './PaymentMethodSelector';
import { NewContributionSubmit } from './ContributionSubmit';


import { type State } from '../contributionsLandingReducer';

import {
  paymentWaiting,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
} from '../contributionsLandingActions';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  isWaiting: boolean,
  countryGroupId: CountryGroupId,
  email: string,
  otherAmount: string | null,
  paymentMethod: PaymentMethod,
  thirdPartyPaymentLibraries: ThirdPartyPaymentLibraries,
  contributionType: Contrib,
  currency: IsoCurrency,
  paymentError: CheckoutFailureReason | null,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  selectedCountryGroupDetails: CountryMetaData,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  setPaymentIsWaiting: boolean => void,
  openDirectDebitPopUp: () => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  onPaymentAuthorisation: PaymentAuthorisation => void,
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
  otherAmount: state.page.form.formData.otherAmounts[state.page.form.contributionType].amount,
  paymentMethod: state.page.form.paymentMethod,
  thirdPartyPaymentLibraries: state.page.form.thirdPartyPaymentLibraries,
  contributionType: state.page.form.contributionType,
  currency: state.common.internationalisation.currencyId,
  paymentError: state.page.form.paymentError,
  selectedAmounts: state.page.form.selectedAmounts,

});


const mapDispatchToProps = (dispatch: Function) => ({
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
  const paymentLibraries = props.thirdPartyPaymentLibraries[props.contributionType];
  if (paymentLibraries && paymentLibraries.Stripe) {
    openDialogBox(paymentLibraries.Stripe, getAmount(props), props.email);
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

  const checkOtherAmount: string => boolean = input =>
    isNotEmpty(input)
    && isLargerOrEqual(config[props.countryGroupId][props.contributionType].min, input)
    && isSmallerOrEqual(config[props.countryGroupId][props.contributionType].max, input)
    && maxTwoDecimals(input);

  return (
    <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
      <NewContributionType />
      <NewContributionAmount
        countryGroupDetails={props.selectedCountryGroupDetails}
        checkOtherAmount={checkOtherAmount}
      />
      <ContributionFormFields />
      <NewPaymentMethodSelector onPaymentAuthorisation={props.onPaymentAuthorisation} />
      <PaymentFailureMessage checkoutFailureReason={props.paymentError} />
      <NewContributionSubmit onPaymentAuthorisation={props.onPaymentAuthorisation} />
      {props.isWaiting ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
    </form>
  );
}

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
