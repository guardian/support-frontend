// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import React from 'react';
import { connect } from 'react-redux';
import { type Action, setHasSeenDirectDebitThankYouCopy } from '../../contributionsLandingActions';
import SetPasswordForm from '../SetPasswordForm';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import type { ContributionType } from 'helpers/contributions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  passwordFailed: boolean,
  hasSeenDirectDebitThankYouCopy: boolean,
  setHasSeenDirectDebitThankYouCopy: () => void,
|};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
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
  const oneOffTitle = 'Complete your Guardian account';
  const oneOffBody = 'Having an account means you’ll notice far fewer messages asking you for financial support. And if you want to support us again in the future, making a contribution will be even easier. Please make sure you validate your account via your inbox, and stay signed in on each of your devices.';
  const recurringTitle = 'Set up a free account to manage your payments';
  const recurringBody = 'If you stay signed in when you’re reading The Guardian as a contributor, you’ll no longer see messages asking you to support our journalism';

  const setPasswordCopy = {
    ONE_OFF: {
      title: oneOffTitle,
      body: oneOffBody,
    },
    MONTHLY: {
      title: recurringTitle,
      body: recurringBody,
    },
    ANNUAL: {
      title: recurringTitle,
      body: recurringBody,
    },
  };

  const renderDirectDebit = () => {
    props.setHasSeenDirectDebitThankYouCopy();
    return (
      <section className="confirmation">
        <h3 className="confirmation__title">
          {'Your Direct Debit has been set up. Look out for an email within three business days confirming your recurring payment. This will appear as \'Guardian Media Group\' on your bank statements'}
        </h3>
      </section>
    );
  };

  return (
    <div className="thank-you__container">
      <div className="gu-content__form gu-content__form--thank-you gu-content__form--set-password">
        { props.paymentMethod === DirectDebit && !props.hasSeenDirectDebitThankYouCopy ?
            renderDirectDebit() : null }
        <section className="set-password">
          <h3 className="set-password__title">{setPasswordCopy[props.contributionType].title}</h3>
          <p className="set-password__message">
            {setPasswordCopy[props.contributionType].body}
          </p>
          <SetPasswordForm />
        </section>
      </div>

      <div className="gu-content__blurb gu-content__blurb--thank-you">
        <h1 className="gu-content__blurb-header">Set up a free <br className="gu-content__blurb-header-break" />Guardian <br className="gu-content__blurb-header-break" />account</h1>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYouSetPassword);
