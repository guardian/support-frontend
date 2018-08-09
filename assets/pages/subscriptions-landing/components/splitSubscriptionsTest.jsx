// @flow

// ----- Imports ----- //

import React from 'react';

import { getQueryParameter } from 'helpers/url';

import ThreeSubscriptionsContainer from 'components/threeSubscriptions/threeSubscriptionsContainer';
import DigitalSubscriptionsContainer from 'components/digitalSubscriptions/digitalSubscriptionsContainer';
import PaperSubscriptionsContainer from 'components/paperSubscriptions/paperSubscriptionsContainer';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

// ----- Types ----- //

type PropTypes = {
  sectionId: string,
};

const testName = 'split_subscriptions_test';

function getSections() {

  if (getQueryParameter('splitSubscriptions') === 'true') {
    return [
      <DigitalSubscriptionsContainer
        headingSize={3}
        clickEvents={{
          iOSApp: sendTrackingEventsOnClick('premium_tier_ios_cta', 'digital', testName, true),
          androidApp: sendTrackingEventsOnClick('premium_tier_android_cta', 'digital', testName, true),
          dailyEdition: sendTrackingEventsOnClick('daily_edition_cta', 'digital', testName, true),
          digiPack: sendTrackingEventsOnClick('digipack_cta', 'digital', testName, true),
        }}
      />,
      <PaperSubscriptionsContainer
        headingSize={3}
        clickEvents={{
          paper: sendTrackingEventsOnClick('paper_cta', 'print', testName, true),
          paperDigital: sendTrackingEventsOnClick('paper_digital_cta', 'print', testName, true),
          weekly: sendTrackingEventsOnClick('weekly_cta', 'print', testName, true),
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
        digital: sendTrackingEventsOnClick('digital_cta', 'digital', testName, false),
        paper: sendTrackingEventsOnClick('paper_cta', 'print', testName, false),
        paperDigital: sendTrackingEventsOnClick('paper_digital_cta', 'print', testName, false),
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
