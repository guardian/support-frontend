// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import type { PaymentMethod } from 'helpers/contributions';
import React from 'react';
import { connect } from 'react-redux';
import { type ContributionType, getSpokenType } from 'helpers/contributions';
import { ButtonWithRightArrow } from './ButtonWithRightArrow/ButtonWithRightArrow';
import MarketingConsent from './MarketingConsentContainer';
import ContributionsSurvey from './ContributionSurvey/ContributionsSurvey';
import { type Action, setHasSeenDirectDebitThankYouCopy } from '../contributionsLandingActions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  hasSeenDirectDebitThankYouCopy: boolean,
  setHasSeenDirectDebitThankYouCopy: () => void,
  |};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
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

function ContributionThankYou(props: PropTypes) {

  let directDebitHeaderSuffix = '';
  let directDebitMessageSuffix = '';

  if (props.paymentMethod === 'DirectDebit' && !props.hasSeenDirectDebitThankYouCopy) {
    directDebitHeaderSuffix = 'Your Direct Debit has been set up.';
    directDebitMessageSuffix = 'This will appear as \'Guardian Media Group\' on your bank statements';
    props.setHasSeenDirectDebitThankYouCopy();
  }

  return (
    <div className="thank-you__container">
      <h1 className="header">{`Thank you for a valuable contribution. ${directDebitHeaderSuffix}`}</h1>
      {props.contributionType !== 'ONE_OFF' ? (
        <section className="confirmation">
          <p className="confirmation__message">
            {`Look out for an email within three business days confirming your ${getSpokenType(props.contributionType)} recurring payment. ${directDebitMessageSuffix}`}
          </p>
        </section>
      ) : null}
      <ContributionsSurvey />
      <MarketingConsent />
      <ButtonWithRightArrow
        componentClassName="confirmation confirmation--backtothegu"
        buttonClassName=""
        accessibilityHintId="accessibility-hint-return-to-guardian"
        type="button"
        buttonCopy="Return to The Guardian&nbsp;"
        onClick={
          () => {
            window.location.assign('https://www.theguardian.com');
          }
        }
      />
    </div>
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYou);
