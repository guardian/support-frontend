// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Types ----- //

type PropTypes = {|
  heading: string,
  children: Node,
|};


// ----- Component ----- //

function SubscriptionsThankYou(props: PropTypes) {

  return (
    <div className="component-subscriptions-thank-you">
      <LeftMarginSection>
        <HeadingBlock heading={props.heading}>
          <p className="component-subscriptions-thank-you__heading-banner">
            We have sent you an email confirmation
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
