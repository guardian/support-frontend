// @flow

// ----- Imports ----- //

import React from 'react';

import {
  getIosAppUrl,
  androidAppUrl,
  getDailyEditionUrl,
} from 'helpers/externalLinks';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId;
};


// ----- Component ----- //

function ThankYouContent(props: PropTypes) {

  return (
    <div className="thank-you-content">
      <AppsSection countryGroupId={props.countryGroupId} />
      <EmailsSection />
    </div>
  );

}


// ----- Auxiliary Components ----- //

function AppsSection(props: { countryGroupId: CountryGroupId }) {

  return (
    <LeftMarginSection modifierClasses={['thank-you-apps']}>
      <h2 className="thank-you-content__heading">
        Get started with premium app
      </h2>
      <p className="thank-you-content__copy">
        <strong className="thank-you-content__strong">
          Your digital subscription is now live
        </strong>, and we&#39;ve sent you an email to explain everything you need to know.
        Log in to the app with the email you used to sign up
      </p>
      <CtaLink
        text="Download from the App Store"
        accessibilityHint="Click to download the app on the Apple App Store"
        url={getIosAppUrl(props.countryGroupId)}
      />
      <CtaLink
        text="Download from Google Play"
        accessibilityHint="Click to download the app on the Google Play store"
        url={androidAppUrl}
      />
      <CtaLink
        text="Download the iPad Edition"
        accessibilityHint="Click to download the Daily Tablet Edition app on the Apple App Store"
        url={getDailyEditionUrl(props.countryGroupId)}
      />
    </LeftMarginSection>
  );

}

function EmailsSection() {

  return (
    <LeftMarginSection modifierClasses={['thank-you-emails']}>
      <h2 className="thank-you-content__heading">
        Subscriptions, membership and contributions
      </h2>
      <p className="thank-you-content__copy">
        <strong className="thank-you-content__strong">
          News and offers from The Guardian, The Observer and Guardian Weekly
        </strong> on the ways to read and support our journalism. Already a member,
        subscriber or contributor, opt in here to receive your regular emails and updates.
      </p>
    </LeftMarginSection>
  );

}


// ----- Export ----- //

export default ThankYouContent;
