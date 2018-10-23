// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import MarketingConsent from '../components/MarketingConsent';
import { ButtonWithRightArrow } from '../components/ButtonWithRightArrow';

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

export default ContributionThankYouPasswordSet;
