// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Contrib, getSpokenType } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import MarketingConsent from '../components/MarketingConsent';
import { ButtonWithRightArrow } from '../components/ButtonWithRightArrow';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
  showDirectDebitCopy: boolean,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
});


// ----- Render ----- //

function ContributionThankYou(props: PropTypes) {

  const directDebitHeaderSuffix =
    props.showDirectDebitCopy
      ? 'Your Direct Debit has been set up.'
      : '';

  const directDebitMessageSuffix =
    props.showDirectDebitCopy
      ? 'This will appear as \'Guardian Media Group\' on your bank statements'
      : '';

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
      <ButtonWithRightArrow
        componentClassName={classNameWithModifiers('confirmation', ['backtothegu'])}
        buttonClassName={classNameWithModifiers('button', ['wob'])}
        accessibilityHintId="accessibility-hint-return-to-guardian"
        type="button"
        url="https://www.theguardian.com"
        buttonCopy="Return to The Guardian&nbsp;"
      />
    </div>
  );
}

export default connect(mapStateToProps)(ContributionThankYou);
