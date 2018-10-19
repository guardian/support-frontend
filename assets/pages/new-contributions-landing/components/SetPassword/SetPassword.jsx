// @flow

// ----- Imports ----- //

import { classNameWithModifiers } from 'helpers/utilities';
import type { PaymentMethod } from 'helpers/contributions';
import React from 'react';
import { connect } from 'react-redux';
import SetPasswordForm from './SetPasswordForm';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  paymentMethod: PaymentMethod,
};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  paymentMethod: state.page.form.paymentMethod,
});

// ----- Render ----- //

function SetPassword(props: PropTypes) {
  if (props.paymentMethod === 'DirectDebit') {
    return (
      <div className="set-password__content">
        <h1 className="header">Thank you for a valuable contribution. Your Direct Debit has been set up</h1>
        <section className={classNameWithModifiers('confirmation__message', ['direct-debit'])}>
          <p>{'Look out for an email confirming you montcty recurring payment. This will appear as \'Guardian Media Group\' on your bank statements'}</p>
        </section>
        <section className="set-password">
          <h3 className="confirmation__title">Set up a free account to manage your payments</h3>
          <p>
            As a contributor, being signed in means you will no longer see the “Since you’re here …” messages asking you
            to support our journalism.
          </p>
          <SetPasswordForm />
        </section>
      </div>
    );
  }
  return (
    <div className="set-password__content">
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
