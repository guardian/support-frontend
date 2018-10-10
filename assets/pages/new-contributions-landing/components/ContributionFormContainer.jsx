// @flow

// ----- Imports ----- //

import PayPalExpressButton from 'components/paymentButtons/payPalExpressButton/payPalExpressButtonNewFlow';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import { NewContributionForm } from 'pages/new-contributions-landing/components/ContributionForm';
import { ContributionFormFields } from 'pages/new-contributions-landing/components/ContributionFormFields';
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
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
} from '../contributionsLandingActions';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  paymentComplete: boolean,
  error: CheckoutFailureReason | null,
  isWaiting: boolean,
  countryGroupId: CountryGroupId,
  selectedCountryGroupDetails: CountryMetaData,
  thankYouRoute: string,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  otherAmount: string | null,
  paymentMethod: PaymentMethod,
  isSignedIn: boolean,
  paymentHandlers: { [PaymentMethod]: PaymentHandler | null },
  updateFirstName: Event => void,
  updateLastName: Event => void,
  updateEmail: Event => void,
  updateState: Event => void,
  setPaymentIsWaiting: boolean => void,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  openDirectDebitPopUp: () => void,
  isDirectDebitPopUpOpen: boolean,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  currencyId: IsoCurrency,
  payPalExpressButton: Node,
|};

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (formValue: string | null, userValue: string | null): string | null =>
  (formValue === null ? userValue : formValue);

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  csrf: state.page.csrf,
  payPalHasLoaded: state.page.form.payPalHasLoaded,
  payPalSwitchStatus: state.common.settings.switches.recurringPaymentMethods.payPal,
  currencyId: state.common.internationalisation.currencyId,
  paymentMethod: state.page.form.paymentMethod,
  paymentComplete: state.page.form.paymentComplete,
  isWaiting: state.page.form.isWaiting,
  countryGroupId: state.common.internationalisation.countryGroupId,
  isSignedIn: state.page.user.isSignedIn,
  paymentHandlers: state.page.form.paymentHandlers,
  isDirectDebitPopUpOpen: state.page.directDebit.isPopUpOpen,
  csrf: state.page.csrf,
  payPalHasLoaded: state.page.form.payPalHasLoaded,
  payPalSwitchStatus: state.common.settings.switches.recurringPaymentMethods.payPal,
  paymentMethod: state.page.form.paymentMethod,
});

const mapDispatchToProps = (dispatch: Function) => ({

  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
  payPalSetHasLoaded: () => {
    dispatch(setPayPalHasLoaded());
  },
});

// ----- Render ----- //

function ContributionFormContainer(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const showPayPalExpressButton = props.paymentMethod === 'PayPal';
  const formClassName = 'form--contribution';


  return props.paymentComplete ?
    <Redirect to={props.thankYouRoute} />
    : (
      <div className="gu-content__content">
        <h1 className="header">{countryGroupSpecificDetails[props.countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[props.countryGroupId].contributeCopy}</p>
        <PaymentFailureMessage checkoutFailureReason={props.error} />
        <NewContributionForm />
        <DirectDebitPopUpForm
          onPaymentAuthorisation={onPaymentAuthorisation}
          isPopUpOpen={props.isDirectDebitPopUpOpen}
        />
        <PayPalExpressButton
          currencyId={props.currencyId}
          csrf={props.csrf}
          onPaymentAuthorisation={onPaymentAuthorisation}
          hasLoaded={props.payPalHasLoaded}
          setHasLoaded={props.payPalSetHasLoaded}
          switchStatus={props.payPalSwitchStatus}
          canOpen={() => formIsValid(formClassName)}
          formClassName={formClassName}
          whenUnableToOpen={() => props.setCheckoutFormHasBeenSubmitted()}
          show={showPayPalExpressButton}
        />
      </div>
    );
}

ContributionFormContainer.defaultProps = {
  error: null,
};

const NewContributionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ContributionFormContainer);

export { NewContributionFormContainer };
