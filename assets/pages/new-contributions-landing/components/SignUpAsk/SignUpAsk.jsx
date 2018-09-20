// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type Contrib } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgPasswordKey from 'components/svgs/passwordKey';
import SvgEnvelope from 'components/svgs/envelope';
import CtaLink from 'components/ctaLink/ctaLink';
import { NewContributionTextInput } from '../ContributionTextInput';
import { CreateAccountButton } from './CreateAccountButton';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
  email: state.page.user.email,
});


function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    event.preventDefault();

    if (!(event.target: any).checkValidity()) {
      return;
    }

    alert("hello")

  };
}


// ----- Render ----- //

function SignUpAsk(props: PropTypes) {
  return (
    <div className="gu-content__content">
      <h1>Get a free account to manage your payments and subscriptions</h1>
       <section className="sign-up-ask">
          <p className="sign-up-ask__standfirst">
            If you give a monthly contribution to the Guardian, being signed in means you will no longer see the “Since you’re here…” messages asking you to support our journalism.
          </p>
         <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
           <NewContributionTextInput
             id="email"
             name="contribution-email"
             label="Email address"
             value={props.email}
             icon={<SvgEnvelope />}
             autoComplete="off"
             autoCapitalize="words"
             required
             disabled
           />

           <NewContributionTextInput
             id="password"
             type={"password"}
             name="contribution-password"
             label="Set a password"
             icon={<SvgPasswordKey />}
             autoComplete="off"
             autoCapitalize="words"
             required
           />
           <CreateAccountButton />
           <CtaLink
             text="No, thank you"
             accessibilityHint="no thank you"
             id="qa-no-thankyou"
             onClick={() => alert("No thanks")}
             modifierClasses={['form-navigation', 'no-thanks']}
           />
         </form>
       </section>
    </div>
  );
}

const SignUpAsk = connect(mapStateToProps)(SignUpAsk);


export { SignUpAsk };
