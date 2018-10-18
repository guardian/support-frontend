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


// ----- Component ----- //

function AppsSection(props: {
  countryGroupId: CountryGroupId,
}) {

  return (
    <div className="apps-section">
      <LeftMarginSection>
        <h2 className="apps-section__heading">
          Get started with premium app
        </h2>
        <p className="apps-section__copy">
          <strong className="apps-section__strong">
            Your digital subscription is now live
          </strong>, and we&#39;ve sent you an email to explain everything you need to know.
          Log in to the app with the email you used to sign up
        </p>
        <div className="apps-section__ctas">
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
        </div>
      </LeftMarginSection>
    </div>
  );

}


// ----- Export ----- //

export default AppsSection;
