// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { classNameWithModifiers } from 'helpers/utilities';

import type { ContributionType } from 'helpers/contributions';
import { resetPassword, setPasswordGuest } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import SvgPasswordKey from 'components/svgs/passwordKey';
import SvgEnvelope from 'components/svgs/envelope';
import SvgExclamationAlternate from 'components/svgs/exclamationAlternate';
import { checkEmail, emailRegexPattern } from 'helpers/formValidation';
import { trackComponentClick } from 'helpers/tracking/ophan';

import ContributionTextInput from './ContributionTextInput';
import { type ThankYouPageStage } from '../contributionsLandingReducer';
import { setThankYouPageStage, setPasswordHasBeenSubmitted, setPasswordError, updatePassword, type Action } from '../contributionsLandingActions';
import Button from 'components/button/button';

const passwordErrorHeading = 'Account set up failure';
const passwordErrorMessage = 'Sorry, we are unable to register you at this time. We are working hard to fix the problem and hope to be back up and running soon. Please come back later to complete your registration. Thank you.';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  email: string,
  password: string,
  guestAccountCreationToken: ?string,
  setThankYouPageStage: (ThankYouPageStage) => void,
  setPasswordHasBeenSubmitted: () => void,
  passwordHasBeenSubmitted: boolean,
  updatePassword: (Event) => void,
  csrf: CsrfState,
  passwordError: boolean,
  setPasswordError: (boolean) => void,
  contributionType: ContributionType
|};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  email: state.page.form.formData.email,
  password: state.page.form.setPasswordData.password,
  passwordHasBeenSubmitted: state.page.form.setPasswordData.passwordHasBeenSubmitted,
  guestAccountCreationToken: state.page.form.guestAccountCreationToken,
  csrf: state.page.csrf,
  passwordError: state.page.form.setPasswordData.passwordError,
  contributionType: state.page.form.contributionType,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setThankYouPageStage: (thankYouPageStage: ThankYouPageStage) => {
      dispatch(setThankYouPageStage(thankYouPageStage));
    },
    setPasswordHasBeenSubmitted: () => {
      dispatch(setPasswordHasBeenSubmitted());
    },
    updatePassword: (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        dispatch(updatePassword(event.target.value));
      }
    },
    setPasswordError: (passwordError: boolean) => {
      dispatch(setPasswordError(passwordError));
    },
  };
}


// ----- Functions ----- //

function onSubmitSetPasswordGuest(props: PropTypes): Event => void {
  return (event) => {
    props.setPasswordHasBeenSubmitted();
    event.preventDefault();
    trackComponentClick(`set-password-${props.contributionType}`);
    if (!(event.target: any).checkValidity()) {
      return;
    }

    // TODO: send user to thank you page with error if password was not set
    setPasswordGuest(props.password, props.guestAccountCreationToken, props.csrf)
      .then((response) => {
        if (response === true) {
          props.setThankYouPageStage('thankYouPasswordSet');
        } else {
          props.setPasswordError(true);
        }
      });
  };
}

function onSubmitResetPassword(props: PropTypes): Event => void {
  return (event) => {
    props.setPasswordHasBeenSubmitted();
    event.preventDefault();
    trackComponentClick(`reset-password-${props.contributionType}`);
    if (!(event.target: any).checkValidity()) {
      return;
    }

    resetPassword(props.email, props.csrf)
      .then((response) => {
        if (response === true) {
          props.setThankYouPageStage('thankYouPasswordSet');
        } else {
          props.setPasswordError(true);
        }
      });
  };
}


// ----- Render ----- //
function renderEmailField(email: string) {
  return (
    <ContributionTextInput
      id="email"
      name="contribution-email"
      label="Email address"
      value={email}
      isValid={checkEmail(email)}
      pattern={emailRegexPattern}
      icon={<SvgEnvelope />}
      autoComplete="email"
      type="email"
      errorMessage="Please enter a valid email address"
      required
      disabled
    />
  );
}

function renderNewPasswordForm(props: PropTypes) {
  return (
    <div>
      <form onSubmit={onSubmitSetPasswordGuest(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
        {renderEmailField(props.email)}
        <ContributionTextInput
          id="password"
          type="password"
          name="contribution-password"
          label="Set a password"
          icon={<SvgPasswordKey />}
          autoComplete="off"
          value={props.password}
          onInput={props.updatePassword}
          pattern={'^.{6,20}$'}
          isValid={props.password.length >= 6 && props.password.length <= 20}
          formHasBeenSubmitted={props.passwordHasBeenSubmitted}
          errorMessage="Please enter a password between 6 and 20 characters long"
          required
        />
        <Button
          appearance="secondary"
          modifierClasses={['create-account']}
          aria-label="Create a guardian account"
          type="submit"
        >
        Create a Guardian account
        </Button>
        <Button
          appearance="greyHollow"
          aria-label="No thank you"
          onClick={
          () => {
            trackComponentClick('decline-to-set-password');
            props.setThankYouPageStage('thankYouPasswordDeclinedToSet');
          }}
        >
        No thank you
        </Button>
      </form>
      {props.passwordError === true ?
        <div className="component-password-failure-message component-general-error-message">
          <SvgExclamationAlternate /><span className="component-general-error-message__error-heading">{passwordErrorHeading}</span>
          <span className="component-general-error-message__small-print">{passwordErrorMessage}</span>
        </div> : null
      }
    </div>);
}

function renderPasswordResetForm(props: PropTypes) {
  return (
    <div>
      <form onSubmit={onSubmitResetPassword(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
        {renderEmailField(props.email)}
        <Button
          appearance="secondary"
          modifierClasses={['create-account']}
          aria-label="Create a guardian account"
          type="submit"
        >
          Validate my email address
        </Button>
        <Button
          appearance="greyHollow"
          aria-label="No thank you"
          onClick={
            () => {
              trackComponentClick('decline-to-reset-password');
              props.setThankYouPageStage('thankYou');
            }}
        >
          No thank you
        </Button>
      </form>
    </div>);
}

function SetPasswordForm(props: PropTypes) {
  return (
    <div className="set-password__form">
      {props.guestAccountCreationToken ?
      renderNewPasswordForm(props) :
      renderPasswordResetForm(props)}
    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(SetPasswordForm);
