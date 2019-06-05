// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ContributionType } from 'helpers/contributions';
import MarketingConsent from '../MarketingConsentContainer';
import AnchorButton from 'components/button/anchorButton';
import SvgArrowLeft from 'components/svgs/arrowLeftStraight';
import { ContributionThankYouBlurb } from './ContributionThankYouBlurb';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import ContributionSurvey from '../ContributionSurvey/ContributionsSurvey';

type PropTypes = {|
  contributionType: ContributionType,
|};

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
});

// ----- Render ----- //

function ContributionThankYouPasswordSet(props: PropTypes) {
  const title = 'Set up a free account to manage your payments';
  const body = 'Please check your inbox to validate your email address – it only takes a minute. And then sign in on each of the devices you use to access The Guardian.';

  return (
    <div className="thank-you__container">
      <div className="gu-content__form gu-content__form--thank-you gu-content__form--password-set">
        <section className="confirmation">
          <h3 className="confirmation__title">{title}</h3>
          <p className="confirmation__message">
            {body}
          </p>
        </section>
        <MarketingConsent />
        <ContributionSurvey isRunning={false} contributionType={props.contributionType} />
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

export default connect(mapStateToProps)(ContributionThankYouPasswordSet);
