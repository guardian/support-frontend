// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type Contrib, getSpokenType } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgPasswordKey from 'components/svgs/passwordKey';
import { NewContributionTextInput } from './ContributionTextInput';

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
           id="password"
           name="contribution-password"
           label="Set a password"
           value={"Example@domain.com"}
           icon={<SvgPasswordKey />}
           autoComplete="off"
           autoCapitalize="words"
           //  onInput={props.updateFirstName}
           // onBlur={() => props.updateBlurred('firstName')}
           //isValid={checkFirstName(firstName)}
           //wasBlurred={firstNameBlurred}
           //errorMessage="Please provide your first name"
           required
         />
       </section>
    </div>
  );
}

const NewContributionThanks = connect(mapStateToProps)(ContributionThanks);


export { NewContributionThanks };
