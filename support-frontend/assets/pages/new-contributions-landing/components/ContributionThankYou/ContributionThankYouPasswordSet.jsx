// @flow

// ----- Imports ----- //

import React from 'react';
import MarketingConsent from '../MarketingConsentContainer';
import AnchorButton from 'components/button/anchorButton';
import SvgArrowLeft from 'components/svgs/arrowLeftStraight';
import { ContributionThankYouBlurb } from './ContributionThankYouBlurb';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import ContributionSurvey from '../ContributionSurvey/ContributionsSurvey';

// ----- Render ----- //

function ContributionThankYouPasswordSet(props: PropTypes) {
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
        <ContributionSurvey contributionType={props.contributionType}/>
        <SpreadTheWord />
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
