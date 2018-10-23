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


// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId;
};


// ----- Component ----- //

function ThankYouContent(props: PropTypes) {

  return (
    <div className="thank-you-content">
      <LeftMarginSection>
        <p className={classNameWithModifiers('thank-you-content__copy', ['free-trial'])}>
          You can use all the features free for the next 14 days,
          and then your first monthly payment will be taken.
        </p>
      </LeftMarginSection>
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
        Can&#39;t wait to get started?
      </h2>
      <p className="thank-you-content__copy">
        Just download the apps and login with the details you used to sign in.
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
      <h3 className="thank-you-content__subheading">
        Daily edition (iPad only)
      </h3>
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
        Stay in the know
      </h2>
      <p className="thank-you-content__copy">
        <strong className="thank-you-content__strong">
          Opt in below to receive news and offers from The Guardian, The Observer and Guardian Weekly
        </strong> on the ways to read and support our journalism. Already a member,
        subscriber or contributor, opt in here to receive your regular emails and updates.
      </p>
      <p className="thank-you-content__copy thank-you-content__copy--small">
        <small>You can unsubscribe at any time by going to the preference centre</small>
      </p>
    </LeftMarginSection>
  );

}


// ----- Export ----- //

export default ThankYouContent;
