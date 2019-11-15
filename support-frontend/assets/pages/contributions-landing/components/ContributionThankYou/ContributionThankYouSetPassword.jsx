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
import ContributionsReminder from 'components/contributionsReminder/contributionsReminder';
import type { IsoCountry } from 'helpers/internationalisation/country';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  passwordFailed: boolean,
  hasSeenDirectDebitThankYouCopy: boolean,
  setHasSeenDirectDebitThankYouCopy: () => void,
  countryCode: IsoCountry,
|};
/* eslint-enable react/no-unused-prop-types */


// ----- State Maps ----- //

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  passwordFailed: state.page.form.passwordFailed,
  hasSeenDirectDebitThankYouCopy: state.page.hasSeenDirectDebitThankYouCopy,
  countryCode: state.common.internationalisation.countryId,
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
  const oneOffBody = 'If you create an account and stay signed in on each of your devices, you’ll notice far fewer messages asking you for financial support. Please make sure you validate your account via your inbox.';
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

  const thankYouBlurb = props.countryCode === 'US' ? (
    <div className="gu-content__blurb gu-content__blurb--thank-you">
      <h1 className="gu-content__blurb-header">Thank you for <br className="gu-content__blurb-header-break" />making a <br className="gu-content__blurb-header-break" />year-end gift</h1>
      <p className="gu-content__blurb-blurb gu-content__blurb-blurb--thank-you">Every reader contribution, however big or small, is so valuable and brings us one step closer to hitting our $1.5 million goal.</p>
    </div>
  ) : (
    <div className="gu-content__blurb gu-content__blurb--thank-you">
      <h1 className="gu-content__blurb-header">Thank you for <br className="gu-content__blurb-header-break" />a valuable <br className="gu-content__blurb-header-break" />contribution</h1>
    </div>
  );

  const renderDirectDebit = () => {
    props.setHasSeenDirectDebitThankYouCopy();
    return (
      <section className="contribution-thank-you-block">
        <h3 className="contribution-thank-you-block__title">
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
        {props.contributionType === 'ONE_OFF' && <ContributionsReminder /> }
        <section className="set-password">
          <h3 className="set-password__title">{setPasswordCopy[props.contributionType].title}</h3>
          <p className="set-password__message">
            {setPasswordCopy[props.contributionType].body}
          </p>
          <SetPasswordForm />
        </section>
      </div>

      {thankYouBlurb}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYouSetPassword);
