// @flow

// ----- Imports ----- //

import React from 'react';

import {
  getIosAppUrl,
  androidAppUrl,
  getDailyEditionUrl,
} from 'helpers/externalLinks';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import CtaLink from 'components/ctaLink/ctaLink';
import MarketingConsent from './MarketingConsentContainer';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId;
};


// ----- Component ----- //

function ThankYouContent(props: PropTypes) {

  return (
    <div className="thank-you-content">
      <LeftMarginSection>
        <p className={classNameWithModifiers('thank-you-content__copy', ['italic'])}>
          We have sent you an email with everything you need to know
        </p>
      </LeftMarginSection>
      <AppsSection countryGroupId={props.countryGroupId} />
      <MarketingConsent />
    </div>
  );

}


// ----- Auxiliary Components ----- //

function AppsSection(props: { countryGroupId: CountryGroupId }) {

  return (
    <LeftMarginSection modifierClasses={['thank-you-apps']}>
      <h2 className="thank-you-content__heading">
        Can&#39;t wait to get started?
      </h2>
      <p className="thank-you-content__copy">
        Just download the apps and log in with your Guardian account details.
      </p>
      <p className="thank-you-content__copy">
        You can use all the features free for the next 14 days,
        and then your first payment will be taken.
      </p>
      <h3 className="thank-you-content__subheading">
        Premium App
      </h3>
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
      <h3 className="thank-you-content__subheading">
        Daily Edition (iPad only)
      </h3>
      <CtaLink
        text="Download the Daily Edition"
        accessibilityHint="Click to download the Daily Tablet Edition app on the Apple App Store"
        url={getDailyEditionUrl(props.countryGroupId)}
      />
    </LeftMarginSection>
  );

}


// ----- Export ----- //

export default ThankYouContent;
