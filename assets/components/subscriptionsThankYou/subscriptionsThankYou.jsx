// @flow

// ----- Imports ----- //

import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Component ----- //

function SubscriptionsThankYou() {

  return (
    <div className="component-subscriptions-thank-you">
      <LeftMarginSection>
        <HeadingBlock heading="Thank you, for helping to support our journalism">
          <p className="component-subscriptions-thank-you__heading-banner">
            <strong className="component-subscriptions-thank-you__congrats">
              Congratulations
            </strong>, you are now subscribed!
          </p>
        </HeadingBlock>
        <div className="component-subscriptions-thank-you__content">
          <h2 className="component-subscriptions-thank-you__heading">
            Have you downloaded the app?
          </h2>
          <p className="component-subscriptions-thank-you__copy">
            <strong className="component-subscriptions-thank-you__strong">
              Your digital subscription is now live
            </strong>, and we&#39;ve sent you an email to explain everything you need to know.
            Log in to the app with the email you used to sign up
          </p>
          <div className="component-subscriptions-thank-you__ctas">
            <CtaLink
              text="Download on the App Store"
              accessibilityHint="Click to download the app on the Apple App Store"
              url="/"
            />
            <CtaLink
              text="Get it on Google Play"
              accessibilityHint="Click to download the app on the Google Play store"
              url="/"
            />
          </div>
          <h2 className="component-subscriptions-thank-you__heading">
            and the Daily Tablet Edition?
          </h2>
          <p className="component-subscriptions-thank-you__copy">
            <strong className="component-subscriptions-thank-you__strong">
              If you&#39;re and iPad user
            </strong> you can now access our award winning journalism in a
            format tailored for the iPad available to read offline, and updated daily.
          </p>
          <div className="component-subscriptions-thank-you__ctas">
            <CtaLink
              text="Download the Daily Tablet Edition"
              accessibilityHint="Click to download the Daily Tablet Edition app on the Apple App Store"
              url="/"
            />
          </div>
        </div>
      </LeftMarginSection>
    </div>
  );

}


// ----- Exports ----- //

export default SubscriptionsThankYou;
