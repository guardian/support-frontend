// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import CtaLink from 'components/ctaLink/ctaLink';
import SvgSubsThankYouHeroMobile from 'components/svgs/subsThankYouHeroMobile';
import SvgSubsThankYouHeroTablet from 'components/svgs/subsThankYouHeroTablet';
import SvgSubsThankYouHeroDesktop from 'components/svgs/subsThankYouHeroDesktop';


// ----- Types ----- //

type PropTypes = {
  children: Node,
};


// ----- Component ----- //

function SubscriptionsThankYou(props: PropTypes) {

  return (
    <div className="component-subscriptions-thank-you">
      <div className="component-subscriptions-thank-you__hero">
        <SvgSubsThankYouHeroMobile />
        <SvgSubsThankYouHeroTablet />
        <SvgSubsThankYouHeroDesktop />
      </div>
      <LeftMarginSection>
        <HeadingBlock heading="Thank you for helping to support our journalism">
          <p className="component-subscriptions-thank-you__heading-banner">
            <strong className="component-subscriptions-thank-you__congrats">
              Congratulations
            </strong>, you are now a subscriber!
          </p>
        </HeadingBlock>
      </LeftMarginSection>
      {props.children}
      <LeftMarginSection modifierClasses={['return']}>
        <CtaLink
          text="Return to The Guardian"
          accessibilityHint="Return to The Guardian home page"
          url="https://theguardian.com"
        />
      </LeftMarginSection>
    </div>
  );

}


// ----- Exports ----- //

export default SubscriptionsThankYou;
