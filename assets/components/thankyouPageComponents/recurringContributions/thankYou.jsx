// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import InfoSection from 'components/infoSection/infoSection';
import SocialShare from 'components/socialShare/socialShare';
import { connect } from 'react-redux';

type PropTypes = {
  marketingPreferencesSelected: boolean
};

// ----- Component ----- //

function ThankYou(props: PropTypes) {
  console.log("prefs2 = " + props.marketingPreferencesSelected.toString())
  if (props.marketingPreferencesSelected === true) {
    return (
      <div>
        <div className="thankyou__wrapper">
          <h1 className="thankyou__heading">Thank you!</h1>
          <h2 id="qa-thank-you-message" className="thankyou__subheading">
            <p>You have helped to make the Guardian&#39;s future more secure.
              Look out for an email confirming your recurring
              payment.
            </p>
          </h2>
          <CtaLink
            ctaId="return-to-the-guardian"
            text="Return to the Guardian"
            url="https://theguardian.com"
            accessibilityHint="Go to the guardian dot com front page"
          />
        </div>
        <InfoSection heading="Questions?" className="thankyou__questions">
          <p>
            If you have any questions about contributing to the Guardian,
            please <a href="mailto:contribution.support@theguardian.com">contact us</a>
          </p>
        </InfoSection>
        <InfoSection
          heading="Spread the word"
          className="thankyou__spread-the-word"
        >
          <p>
            We report for everyone. Let your friends and followers know that
            you support independent journalism.
          </p>
          <SocialShare name="facebook" />
          <SocialShare name="twitter" />
        </InfoSection>
      </div>);
  }
}

function mapStateToProps(state) {
  return {
    marketingPreferencesSelected:
    state.page.regularContributionsThankYou.marketingPreferencesSelected,
  };
}

// ----- Exports ----- //

export default connect(mapStateToProps)(ThankYou);

