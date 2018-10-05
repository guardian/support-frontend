// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { type Contrib } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { setPasswordGuest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import SvgPasswordKey from 'components/svgs/passwordKey';
import SvgEnvelope from 'components/svgs/envelope';

import { NewContributionTextInput } from '../ContributionTextInput';
import { type ThankYouPageStage } from '../../contributionsLandingReducer';
import { setThankYouPageStage, setPasswordHasBeenSubmitted, updatePassword, type Action } from '../../contributionsLandingActions';
import { checkEmail, emailRegexPattern } from '../../formValidation';
import { ButtonWithRightArrow } from '../ButtonWithRightArrow';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
  email: string,
  password: string,
  guestAccountCreationToken: string,
  setThankYouPageStage: (ThankYouPageStage) => void,
  setPasswordHasBeenSubmitted: () => void,
  passwordHasBeenSubmitted: boolean,
  updatePassword: (Event) => void,
  csrf: CsrfState,
};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
  email: state.page.form.formData.email,
  password: state.page.form.setPasswordData.password,
  passwordHasBeenSubmitted: state.page.form.setPasswordData.passwordHasBeenSubmitted,
  guestAccountCreationToken: state.page.form.guestAccountCreationToken,
  csrf: state.page.csrf,
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
  };
}


// ----- Functions ----- //

function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    props.setPasswordHasBeenSubmitted();
    event.preventDefault();

    if (!(event.target: any).checkValidity()) {
      return;
    }

    // TODO: send user to thank you page with error if password was not set
    setPasswordGuest(props.password, props.guestAccountCreationToken, props.csrf)
      .then((response) => {
        if (response === true) {
          props.setThankYouPageStage('thankYouPasswordSet');
        } else {
          props.setThankYouPageStage('thankYouPasswordNotSet');
        }
      });
  };
}


// ----- Render ----- //

function SetPassword(props: PropTypes) {
  return (
    <div className="set-password__container">
      <h1 className="header">Set up a free account to manage your payments</h1>
      <section className="set-password">
        <p className="blurb">
          Thank you for a valuable contribution. As a contributor, being signed in means you will no
          longer see the “Since you’re here …” messages asking you to support our journalism.
        </p>
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
            onClick={() => props.setThankYouPageStage('thankYou')}
          />
        </form>
      </section>
    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);
