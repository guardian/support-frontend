// @flow

// ----- Imports ----- //

import React from 'react';
import { type Contrib } from 'helpers/contributions';
import { connect } from 'react-redux';
import SetPasswordForm from './SetPasswordForm';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
});

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
        <SetPasswordForm />
      </section>
    </div>
  );

}

export default connect(mapStateToProps)(SetPassword);
