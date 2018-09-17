// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import type { Dispatch } from 'redux';

import { countryGroupSpecificDetails, type CountryMetaData } from 'helpers/internationalisation/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { type PaymentHandler, type PaymentMethod } from 'helpers/checkouts';
import { type Contrib, type Amount } from 'helpers/contributions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { emailRegexPattern } from 'helpers/checkoutForm/checkoutForm';
import { openDialogBox } from 'helpers/paymentIntegrations/newStripeCheckout';
import { type Token } from 'helpers/paymentIntegrations/readerRevenueApis';

import PaymentFailureMessage from 'components/paymentFailureMessage/paymentFailureMessage';
import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';
import ProgressMessage from 'components/progressMessage/progressMessage';

import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewContributionPayment } from './ContributionPayment';
import { NewContributionState } from './ContributionState';
import { NewContributionSubmit } from './ContributionSubmit';
import { NewContributionTextInput } from './ContributionTextInput';

import { type State } from '../contributionsLandingReducer';
import { type Action, paymentWaiting, updateFirstName, updateLastName, updateEmail, updateState, onThirdPartyPaymentDone } from '../contributionsLandingActions';

// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  done: boolean,
  error: CheckoutFailureReason | null,
  isWaiting: boolean,
  countryGroupId: CountryGroupId,
  selectedCountryGroupDetails: CountryMetaData,
  contributionType: Contrib,
  thankYouRoute: string,
  firstName: string,
  lastName: string,
  email: string,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  otherAmount: string | null,
  paymentMethod: PaymentMethod,
  paymentHandler: { [PaymentMethod]: PaymentHandler | null },
  updateFirstName: Event => void,
  updateLastName: Event => void,
  updateEmail: Event => void,
  updateState: Event => void,
  onWaiting: boolean => void,
  onThirdPartyPaymentDone: Token => void,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  done: state.page.form.done,
  isWaiting: state.page.form.isWaiting,
  countryGroupId: state.common.internationalisation.countryGroupId,
  firstName: state.page.form.formData.firstName || state.page.user.firstName,
  lastName: state.page.form.formData.lastName || state.page.user.lastName,
  email: state.page.form.formData.email || state.page.user.email,
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmount: state.page.form.formData.otherAmount,
  paymentMethod: state.page.form.paymentMethod,
  paymentHandler: state.page.form.paymentHandler,
  contributionType: state.page.form.contributionType,
});

function maybeDispatch(dispatch: Dispatch<Action>, action: string => Action, string: string) {
  const cleanString = string.trim();
  if (cleanString !== '') {
    dispatch(action(cleanString));
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  updateFirstName: (event) => { maybeDispatch(dispatch, updateFirstName, event.target.value); },
  updateLastName: (event) => { maybeDispatch(dispatch, updateLastName, event.target.value); },
  updateEmail: (event) => { maybeDispatch(dispatch, updateEmail, event.target.value); },
  updateState: (event) => { dispatch(updateState(event.target.value === '' ? null : event.target.value)); },
  onWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentDone: (token) => { dispatch(onThirdPartyPaymentDone(token)); },
});

// ----- Functions ----- //

const getAmount = (props: PropTypes) =>
  parseFloat(props.selectedAmounts[props.contributionType] === 'other'
    ? props.otherAmount
    : props.selectedAmounts[props.contributionType].value);

const isNotEmpty: HTMLInputElement => boolean = input => input.value.trim() !== '';
const isValidEmail: HTMLInputElement => boolean = input => new RegExp(emailRegexPattern).test(input.value);

const checkFirstName: HTMLInputElement => boolean = isNotEmpty;
const checkLastName: HTMLInputElement => boolean = isNotEmpty;
const checkEmail: HTMLInputElement => boolean = input => isNotEmpty(input) && isValidEmail(input);

// ----- Event handlers ----- //

function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    event.preventDefault();
    const amount = getAmount(props);
    const { email } = props;

    if (props.paymentHandler) {
      switch (props.paymentMethod) {
        case 'DebitCard':
          // TODO
          break;

        case 'PayPal':
          // TODO
          break;

        case 'Stripe':
        default:
          if (props.paymentHandler.Stripe) {
            openDialogBox(props.paymentHandler.Stripe, amount, email);
          }
          break;
      }
    }
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
  } = props;

  const paymentCallback = (token: Token) => {
    props.onWaiting(true);
    props.onThirdPartyPaymentDone(token);
  };

  const widgetClosed = () => {
    props.onWaiting(false);
  }

  return props.done ?
    <Redirect to={thankYouRoute} />
    : (
      <div className="gu-content__content">
        <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
        <PaymentFailureMessage checkoutFailureReason={props.error} />
        <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])}>
          <NewContributionType />
          <NewContributionAmount countryGroupDetails={selectedCountryGroupDetails} />
          <NewContributionTextInput
            id="contributionFirstName"
            name="contribution-fname"
            label="First Name"
            value={firstName}
            icon={<SvgUser />}
            autoComplete="given-name"
            autoCapitalize="words"
            onInput={props.updateFirstName}
            checkValidity={checkFirstName}
            errorMessage="Please provide your first name"
            required
          />
          <NewContributionTextInput
            id="contributionLastName"
            name="contribution-lname"
            label="Last Name"
            value={lastName}
            icon={<SvgUser />}
            autoComplete="family-name"
            autoCapitalize="words"
            onInput={props.updateLastName}
            checkValidity={checkLastName}
            errorMessage="Please provide your last name"
            required
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
            checkValidity={checkEmail}
            errorMessage="Please provide a valid email address"
            required
          />
          <NewContributionState onChange={props.updateState} />
          <NewContributionPayment paymentCallback={paymentCallback} widgetClosed={widgetClosed} />
          <NewContributionSubmit />
          {props.isWaiting ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </form>
      </div>
    );
}

ContributionForm.defaultProps = {
  error: null,
};

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
