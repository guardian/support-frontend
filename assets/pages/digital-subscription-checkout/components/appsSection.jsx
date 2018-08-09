// @flow

// ----- Imports ----- //

import React from 'react';

import {
  iOSAppUrl,
  androidAppUrl,
  dailyEditionUrl,
} from 'helpers/externalLinks';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Component ----- //

function AppsSection() {

  return (
    <div className="apps-section">
      <LeftMarginSection>
        <h2 className="apps-section__heading">
          Have you downloaded the app?
        </h2>
        <p className="apps-section__copy">
          <strong className="apps-section__strong">
            Your digital subscription is now live
          </strong>, and we&#39;ve sent you an email to explain everything you need to know.
          Log in to the app with the email you used to sign up
        </p>
        <div className="apps-section__ctas">
          <CtaLink
            text="Download on the App Store"
            accessibilityHint="Click to download the app on the Apple App Store"
            url={iOSAppUrl}
          />
          <CtaLink
            text="Get it on Google Play"
            accessibilityHint="Click to download the app on the Google Play store"
            url={androidAppUrl}
          />
        </div>
        <h2 className="apps-section__heading">
          and the iPad Daily Edition..?
        </h2>
        <p className="apps-section__copy">
          <strong className="apps-section__strong">
            If you&#39;re an iPad user
          </strong> you can now access our award winning journalism in a
          format tailored for the iPad available to read offline, and updated daily.
        </p>
        <div className="apps-section__ctas">
          <CtaLink
            text="Download the iPad Edition"
            accessibilityHint="Click to download the Daily Tablet Edition app on the Apple App Store"
            url={dailyEditionUrl}
          />
        </div>
      </LeftMarginSection>
    </div>
  );

}


// ----- Export ----- //

export default AppsSection;
