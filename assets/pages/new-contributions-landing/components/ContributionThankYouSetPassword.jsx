// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import React from 'react';
import type { PaymentMethod } from 'helpers/contributions';
import { connect } from 'react-redux';
import { type Action, setHasSeenDirectDebitThankYouCopy } from '../contributionsLandingActions';
import SetPasswordForm from './SetPasswordForm';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  paymentMethod: PaymentMethod,
  passwordFailed: boolean,
  hasSeenDirectDebitThankYouCopy: boolean,
  setHasSeenDirectDebitThankYouCopy: () => void,
|};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  paymentMethod: state.page.form.paymentMethod,
  passwordFailed: state.page.form.passwordFailed,
  hasSeenDirectDebitThankYouCopy: state.page.hasSeenDirectDebitThankYouCopy,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setHasSeenDirectDebitThankYouCopy: () => {
      dispatch(setHasSeenDirectDebitThankYouCopy());
    },
  };
}

// ----- Render ----- //

function ContributionThankYouSetPassword(props: PropTypes) {
  if (props.paymentMethod === 'DirectDebit' && !props.hasSeenDirectDebitThankYouCopy) {
    props.setHasSeenDirectDebitThankYouCopy();
    return (
      <div className="set-password__content">
        <h1 className="header">Thank you for a valuable contribution. Your Direct Debit has been set up.</h1>
        <section className="confirmation">
          <p className="confirmation__message">{'Look out for an email within three business days confirming your recurring payment. This will appear as \'Guardian Media Group\' on your bank statements.'}</p>
        </section>
        <section className="set-password">
          <h3 className="set-password__title">Set up a free account to manage your payments</h3>
          <p className="set-password__message">
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

export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYouSetPassword);
