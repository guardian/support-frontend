// @flow

// ----- Imports ----- //

import React from 'react';

import { getQueryParameter } from 'helpers/url';

import ThreeSubscriptionsContainer from 'components/threeSubscriptions/threeSubscriptionsContainer';
import DigitalSubscriptionsContainer from 'components/digitalSubscriptions/digitalSubscriptionsContainer';
import PaperSubscriptionsContainer from 'components/paperSubscriptions/paperSubscriptionsContainer';

import { trackComponentEvents } from 'helpers/tracking/ophanComponentEventTracking';
import { gaEvent } from 'helpers/tracking/googleTagManager';


// ----- Types ----- //

type PropTypes = {
  sectionId: string,
};


// ----- Functions ----- //

function sendEventsOnClick(
  id: string,
  product: 'digital' | 'print',
  variant: boolean,
): () => void {

  return () => {

    trackComponentEvents({
      component: {
        componentType: 'ACQUISITIONS_BUTTON',
        id,
        products: product === 'digital' ? ['DIGITAL_SUBSCRIPTION'] : ['PRINT_SUBSCRIPTION'],
      },
      action: 'CLICK',
      id: `split_subscriptions_test_${id}`,
      abTest: {
        name: 'split_subscriptions_test',
        variant: variant ? 'variant' : 'control',
      },
    });

    gaEvent({
      category: 'click',
      action: 'split_subscriptions_test',
      label: id,
    });

  };

}

function getSections() {

  if (getQueryParameter('splitSubscriptions') === 'true') {
    return [
      <DigitalSubscriptionsContainer
        headingSize={3}
        clickEvents={{
          iOSApp: sendEventsOnClick('premium_tier_ios_cta', 'digital', true),
          androidApp: sendEventsOnClick('premium_tier_android_cta', 'digital', true),
          dailyEdition: sendEventsOnClick('daily_edition_cta', 'digital', true),
          digiPack: sendEventsOnClick('digipack_cta', 'digital', true),
        }}
      />,
      <PaperSubscriptionsContainer
        headingSize={3}
        clickEvents={{
          paper: sendEventsOnClick('paper_cta', 'print', true),
          paperDigital: sendEventsOnClick('paper_digital_cta', 'print', true),
          weekly: sendEventsOnClick('weekly_cta', 'print', true),
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
        digital: sendEventsOnClick('digital_cta', 'digital', false),
        paper: sendEventsOnClick('paper_cta', 'print', false),
        paperDigital: sendEventsOnClick('paper_digital_cta', 'print', false),
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
