// @flow

// ----- Imports ----- //

import React from 'react';

import { getQueryParameter } from 'helpers/url';

import ThreeSubscriptionsContainer from 'components/threeSubscriptions/threeSubscriptionsContainer';
import DigitalSubscriptionsContainer from 'components/digitalSubscriptions/digitalSubscriptionsContainer';
import PaperSubscriptionsContainer from 'components/paperSubscriptions/paperSubscriptionsContainer';

import { trackComponentEvents } from 'helpers/tracking/ophanComponentEventTracking';


// ----- Types ----- //

type PropTypes = {
  sectionId: string,
};


// ----- Functions ----- //

function createEventOnClick(
  id: string,
  product: 'digital' | 'print',
  variant: boolean,
): () => void {

  return () => trackComponentEvents({
    component: {
      componentType: 'ACQUISITIONS_BUTTON',
      id,
      products: product === 'digital' ? ['DIGITAL_SUBSCRIPTION'] : ['PRINT_SUBSCRIPTION'],
    },
    action: 'CLICK',
    id: `split_subscription_test_${id}`,
    abTest: {
      name: 'split_subscription_test',
      variant: variant ? 'variant' : 'control',
    },
  });

}

function getSections() {

  if (getQueryParameter('splitSubscriptions') === 'true') {
    return [
      <DigitalSubscriptionsContainer
        headingSize={3}
        clickEvents={{
          iOSApp: createEventOnClick('premium_tier_ios_cta', 'digital', true),
          androidApp: createEventOnClick('premium_tier_android_cta', 'digital', true),
          dailyEdition: createEventOnClick('daily_edition_cta', 'digital', true),
          digiPack: createEventOnClick('digipack_cta', 'digital', true),
        }}
      />,
      <PaperSubscriptionsContainer
        headingSize={3}
        clickEvents={{
          paper: createEventOnClick('paper_cta', 'print', true),
          paperDigital: createEventOnClick('paper_digital_cta', 'print', true),
          weekly: createEventOnClick('weekly_cta', 'print', true),
        }}
      />,
    ];
  }

  return (
    <ThreeSubscriptionsContainer
      digitalHeadingSize={3}
      paperHeadingSize={3}
      paperDigitalHeadingSize={3}
      clickEvents={{
        digital: createEventOnClick('digital_cta', 'digital', false),
        paper: createEventOnClick('paper_cta', 'print', false),
        paperDigital: createEventOnClick('paper_digital_cta', 'print', false),
      }}
    />
  );

}


// ----- Component ----- //

export default function SplitSubscriptionsTest(props: PropTypes) {

  return (
    <section id={props.sectionId}>
      {getSections()}
    </section>
  );

}
