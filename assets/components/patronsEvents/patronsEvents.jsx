// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import OtherProduct from 'components/otherProduct/otherProduct';

import { getMemLink, getPatronsLink } from 'helpers/externalLinks';

// ----- Types ----- //

type PropTypes = {|
  campaignCode?: ?string,
  context?: string,
|};


// ----- Component ----- //

export default function PatronsEvents(props: PropTypes) {

  return (
    <PageSection heading="Other ways you can support us" modifierClass="patrons-events">
      <OtherProduct
        modifierClass="patrons"
        gridImg="windrushGreyscale"
        imgAlt="passengers aboard windrush ship"
        heading="Patrons"
        copy="Support from our Patrons is crucial to ensure that generations to come will be able to enjoy The Guardian."
        ctaText="Find out more"
        ctaUrl={getPatronsLink(props.campaignCode)}
        ctaAccessibilityHint="Find out more about becoming a Patron"
        imgType="png"
        context={(props.context ? props.context + '-' : '') +  'patrons'}
      />
      <OtherProduct
        modifierClass="live-events"
        gridImg="liveEvent"
        imgAlt="live event"
        heading="Live events"
        copy="Meet Guardian journalists and readers at our events, debates, interviews and festivals"
        ctaText="Find out more"
        ctaUrl={getMemLink('events', props.campaignCode)}
        ctaAccessibilityHint="Find out more about Guardian live events"
        context={(props.context ? props.context + '-' : '') + 'events'}
      />
    </PageSection>
  );

}


// ----- Default Props ----- //

PatronsEvents.defaultProps = {
  campaignCode: null,
};
