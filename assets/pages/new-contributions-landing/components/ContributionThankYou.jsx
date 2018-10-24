// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import type { PaymentMethod } from 'helpers/contributions';
import React from 'react';
import { connect } from 'react-redux';
import { type Contrib, getSpokenType } from 'helpers/contributions';
import CtaLink from 'components/ctaLink/ctaLink';
import MarketingConsent from '../components/MarketingConsent';
import { type Action, setHasSeenDirectDebitThankYouCopy } from '../contributionsLandingActions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  contributionType: Contrib,
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
            {`Look out for an email confirming your ${getSpokenType(props.contributionType)} recurring payment. ${directDebitMessageSuffix}`}
          </p>
        </section>
      ) : null}
      <MarketingConsent />
      <div className="confirmation confirmation--backtothegu">
        <CtaLink
          modifierClasses={['backtothegu']}
          accessibilityHint="accessibility-hint-return-to-guardian"
          url="https://www.theguardian.com"
          text="Return to The Guardian&nbsp;"
        />
      </div>
    </div>
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYou);
