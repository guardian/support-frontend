// @flow

// ----- Imports ----- //

import React from 'react';
import MarketingConsent from '../MarketingConsentContainer';
import ContributionsSurvey from '../ContributionSurvey/ContributionsSurvey';
import { ButtonWithRightArrow } from '../ButtonWithRightArrow/ButtonWithRightArrow';

// ----- Render ----- //

function ContributionThankYouPasswordSet() {
  return (
    <div className="thank-you__container">
      <h1 className="header">You now have a Guardian account</h1>
      <section className="confirmation">
        <p className="confirmation__message">
          Stay signed in so we can recognise you on The Guardian, and you can easily manage your payments and
          preferences.
        </p>
      </section>
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

export default ContributionThankYouPasswordSet;
