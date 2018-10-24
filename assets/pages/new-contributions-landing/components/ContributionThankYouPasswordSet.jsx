// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import MarketingConsent from '../components/MarketingConsent';

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

export default ContributionThankYouPasswordSet;
