// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Component ----- //

export default function DotcomCta() {

  return (
    <div className="component-dotcom-cta">
      <PageSection modifierClass="dotcom-cta">
        <CtaLink
          text="Return to The Guardian"
          accessibilityHint="click here to return to The Guardian"
          ctaId="return-to-the-guardian"
          url="https://www.theguardian.com"
        />
      </PageSection>
    </div>
  );

}
