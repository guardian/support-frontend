// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type Contrib, getSpokenType } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgPasswordKey from 'components/svgs/passwordKey';
import SvgEnvelope from 'components/svgs/envelope';
import { NewContributionTextInput } from '../ContributionTextInput';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
});

// ----- Render ----- //

function SignUpAsk(props: PropTypes) {
  return (
    <div className="gu-content__content">
      <h1>Get a free account to manage your payments and subscriptions</h1>
       <section className="sign-up">
          <p className="sign-up__standfirst">
            If you give a monthly contribution to the Guardian, being signed in means you will no longer see the “Since you’re here…” messages asking you to support our journalism.
          </p>

         <NewContributionTextInput
           id="email"
           name="contribution-email"
           label="Email address"
           value={"Example@domain.com"}
           icon={<SvgEnvelope />}
           autoComplete="off"
           autoCapitalize="words"
           required
           disabled
         />

         <NewContributionTextInput
           id="password"
           name="contribution-password"
           label="Set a password"
           value={"******"}
           icon={<SvgPasswordKey />}
           autoComplete="off"
           autoCapitalize="words"
           required
         />
       </section>
    </div>
  );
}

const SignUpAsk = connect(mapStateToProps)(SignUpAsk);


export { SignUpAsk };
