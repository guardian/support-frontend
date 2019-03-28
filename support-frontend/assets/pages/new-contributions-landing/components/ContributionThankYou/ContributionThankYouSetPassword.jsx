// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import React from 'react';
import { connect } from 'react-redux';
import { type Action, setHasSeenDirectDebitThankYouCopy } from '../../contributionsLandingActions';
import SetPasswordForm from '../SetPasswordForm';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import { ContributionThankYouBlurb } from './ContributionThankYouBlurb';

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
  const renderDirectDebit = () => {
    props.setHasSeenDirectDebitThankYouCopy();
    return (
      <section className="confirmation">
        <p className="confirmation__message">{'Look out for an email within three business days confirming your recurring payment. This will appear as \'Guardian Media Group\' on your bank statements.'}</p>
      </section>
    );
  };

  return (
    <div className="thank-you__container">
      <div className="gu-content__form gu-content__form--thank-you gu-content__form--set-password">
        { props.paymentMethod === DirectDebit && !props.hasSeenDirectDebitThankYouCopy ?
            renderDirectDebit() : null }
        <section className="set-password">
          <h3 className="set-password__title">Set up a free account to manage your payments</h3>
          <p className="set-password__message">
            {`As a contributor, being signed in means you will no longer see the “Since you’re here …”
            messages asking you to support our journalism.`}
          </p>
          <SetPasswordForm />
        </section>
      </div>

      <ContributionThankYouBlurb />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYouSetPassword);
