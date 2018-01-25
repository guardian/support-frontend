// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import OtherProduct from 'components/otherProduct/otherProduct';

import { getMemLink } from '../../pages/bundles-landing/helpers/externalLinks';


// ----- Types ----- //

type PropTypes = {
  campaignCode?: ?string,
};


// ----- Component ----- //

export default function PatronsEvents(props: PropTypes) {

  return (
    <PageSection heading="Other ways you can support us" modifierClass="patrons-events">
      <OtherProduct
        modifierClass="patrons"
        gridImg="newsroom"
        imgAlt="newsroom"
        heading="Patrons"
        copy="The Patron tier is for those who want a deeper relationship with the Guardian and its journalists"
        ctaText="Find out more"
        ctaUrl={getMemLink('patrons', props.campaignCode)}
        ctaId="patrons"
        ctaAccessibilityHint="Find out more about becoming a Patron"
      />
      <OtherProduct
        modifierClass="live-events"
        gridImg="liveEvent"
        imgAlt="live event"
        heading="Live events"
        copy="Meet Guardian journalists and readers at our events, debates, interviews and festivals"
        ctaText="Find out more"
        ctaUrl={getMemLink('events', props.campaignCode)}
        ctaId="live-events"
        ctaAccessibilityHint="Find out more about Guardian live events"
      />
    </PageSection>
  );

}


// ----- Default Props ----- //

PatronsEvents.defaultProps = {
  campaignCode: null,
};
