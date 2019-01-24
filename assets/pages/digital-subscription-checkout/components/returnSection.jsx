// @flow

// ----- Imports ----- //

import React from 'react';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import CtaLink from 'components/ctaLink/ctaLink';

import './returnSection.scss'

// ----- Component ----- //

function ReturnSection() {

  return (
    <div className="return-section">
      <LeftMarginSection>
        <CtaLink
          text="Return to The Guardian"
          accessibilityHint="Return to The Guardian home page"
          url="https://theguardian.com"
          onClick={sendTrackingEventsOnClick('checkout_return_home', 'DigitalPack', null)}
        />
      </LeftMarginSection>
    </div>
  );

}


// ----- Exports ----- //

export default ReturnSection;
