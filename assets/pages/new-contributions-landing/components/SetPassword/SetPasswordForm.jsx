// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { classNameWithModifiers } from 'helpers/utilities';
import { setPasswordGuest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import SvgPasswordKey from 'components/svgs/passwordKey';
import SvgEnvelope from 'components/svgs/envelope';
import SvgExclamationAlternate from 'components/svgs/exclamationAlternate';
import { checkEmail, emailRegexPattern } from 'helpers/formValidation';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';

import { NewContributionTextInput } from '../ContributionTextInput';
import { type ThankYouPageStage } from '../../contributionsLandingReducer';
import { setThankYouPageStage, setPasswordHasBeenSubmitted, setPasswordError, updatePassword, type Action } from '../../contributionsLandingActions';
import { ButtonWithRightArrow } from '../ButtonWithRightArrow';

const passwordErrorHeading = 'Account set up failure';
const passwordErrorMessage = 'Sorry, we are unable to register you at this time. We are working hard to fix the problem and hope to be back up and running soon. Please come back later to complete your registration. Thank you.';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  email: string,
  password: string,
  guestAccountCreationToken: string,
  setThankYouPageStage: (ThankYouPageStage) => void,
  setPasswordHasBeenSubmitted: () => void,
  passwordHasBeenSubmitted: boolean,
  updatePassword: (Event) => void,
  csrf: CsrfState,
  passwordError: boolean,
  setPasswordError: (boolean) => void,
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

function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    props.setPasswordHasBeenSubmitted();
    event.preventDefault();
    trackComponentClick('set-password');
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


// ----- Render ----- //

function SetPasswordForm(props: PropTypes) {
  return (
    <div className="set-password__form">
      <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
        <NewContributionTextInput
          id="email"
          name="contribution-email"
          label="Email address"
          value={props.email}
          isValid={checkEmail(props.email)}
          pattern={emailRegexPattern}
          icon={<SvgEnvelope />}
          autoComplete="email"
          type="email"
          errorMessage="Please enter a valid email address"
          required
          disabled
        />
        <NewContributionTextInput
          id="password"
          type="password"
          name="contribution-password"
          label="Set a password"
          icon={<SvgPasswordKey />}
          autoComplete="off"
          value={props.password}
          onInput={props.updatePassword}
          pattern={'^.{6,72}$'}
          isValid={props.password.length >= 6 && props.password.length <= 72}
          formHasBeenSubmitted={props.passwordHasBeenSubmitted}
          errorMessage="Please enter a password between 6 and 72 characters long"
          required
        />
        <ButtonWithRightArrow
          componentClassName={classNameWithModifiers('form__submit', ['create-account'])}
          buttonClassName={classNameWithModifiers('form__submit-button', ['create-account'])}
          accessibilityHintId="accessibility-hint-create-account"
          type="submit"
          buttonCopy="Create an account"
        />
        <ButtonWithRightArrow
          componentClassName={classNameWithModifiers('form__submit', ['no-thanks'])}
          buttonClassName={classNameWithModifiers('form__submit-button', ['no-thanks'])}
          accessibilityHintId="accessibility-hint-no-thanks"
          type="button"
          buttonCopy="No, thank you"
          onClick={
            () => {
              trackComponentClick('decline-to-set-password');
              props.setThankYouPageStage('thankYouPasswordDeclinedToSet');
            }
          }
        />
      </form>
      {props.passwordError === true ?
        <div className="component-password-failure-message component-payment-failure-message">
          <SvgExclamationAlternate /><span className="component-payment-failure-message__error-heading">{passwordErrorHeading}</span>
          <span className="component-payment-failure-message__small-print">{passwordErrorMessage}</span>
        </div> : null
      }
    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(SetPasswordForm);
