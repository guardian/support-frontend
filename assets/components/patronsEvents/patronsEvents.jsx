// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import OtherProduct from 'components/otherProduct/otherProduct';


// ----- Component ----- //

export default function PatronsEvents() {

  return (
    <PageSection heading="Other ways you can support us" modifierClass="patrons-events">
      <OtherProduct
        modifierClass="patrons"
        heading="Patrons"
        copy="The Patron tier is for those who want a deeper relationship with the Guardian and its journalists"
        ctaText="Find out more"
        ctaUrl="https://membership.theguardian.com/patrons"
        ctaId="patrons"
        ctaAccessibilityHint="Find out more about becoming a Patron"
      />
      <OtherProduct
        modifierClass="live-events"
        heading="Live events"
        copy="Meet Guardian journalists and readers at our events, debates, interviews and festivals"
        ctaText="Find out more"
        ctaUrl="https://membership.theguardian.com/events"
        ctaId="live-events"
        ctaAccessibilityHint="Find out more about Guardian live events"
      />
    </PageSection>
  );

}
