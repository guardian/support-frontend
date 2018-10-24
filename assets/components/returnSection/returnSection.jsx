// @flow

// ----- Imports ----- //

import React from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Component ----- //

function ReturnSection() {

  return (
    <div className="component-return-section">
      <LeftMarginSection>
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

export default ReturnSection;
