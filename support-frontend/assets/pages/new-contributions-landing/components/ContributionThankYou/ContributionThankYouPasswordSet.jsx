// @flow

// ----- Imports ----- //

import React from 'react';
import MarketingConsent from '../MarketingConsentContainer';
import AnchorButton from 'components/button/anchorButton';
import SvgArrowLeft from 'components/svgs/arrowLeftStraight';
import { ContributionThankYouBlurb } from './ContributionThankYouBlurb';

//  TBD: Implement Social On this page beneath Marketing Consent:
// import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';

// ----- Render ----- //

function ContributionThankYouPasswordSet() {
  return (
    <div className="thank-you__container">
      <div className="gu-content__form gu-content__form--thank-you gu-content__form--password-set">
        <section className="confirmation">
          <h3 className="confirmation__title">You now have a Guardian account</h3>
          <p className="confirmation__message">
            Stay signed in on all your devices to easily manage your
            contributions and to stop seeing our appeals for support
          </p>
        </section>
        <MarketingConsent />
        <div className="gu-content__return-link">
          <AnchorButton
            href="https://www.theguardian.com"
            appearance="greyHollow"
            aria-label="Return to The Guardian"
            icon={<SvgArrowLeft />}
            iconSide="left"
          >
            Return to The Guardian
          </AnchorButton>
        </div>
      </div>

      <ContributionThankYouBlurb />
    </div>
  );
}

export default ContributionThankYouPasswordSet;
