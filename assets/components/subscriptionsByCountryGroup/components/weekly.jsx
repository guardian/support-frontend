// @flow

// ----- Imports  ----- //

import React from 'react';

import { type HeadingSize } from 'components/heading/heading';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import { sendTrackingEventsOnClick, type ComponentAbTest } from 'helpers/subscriptions';


// ----- Types ----- //

type PropTypes = {
  headingSize: HeadingSize,
  url: string,
  subheading: string,
  abTest: ComponentAbTest | void,
};


// ----- Component ----- //

function Weekly(props: PropTypes) {

  return (
    <SubscriptionBundle
      modifierClass="weekly"
      heading="Guardian&nbsp;Weekly"
      subheading={props.subheading}
      headingSize={props.headingSize}
      benefits={{
        list: false,
        copy: 'A weekly, global newspaper from The Guardian, with free delivery worldwide',
      }}
      gridImage={{
        gridId: 'weeklyCircle',
        altText: 'weekly subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Find out more',
          url: props.url,
          accessibilityHint: 'Proceed to buy a subscription to The Guardian Weekly',
          modifierClasses: ['border'],
          onClick: sendTrackingEventsOnClick('weekly_cta', 'print', props.abTest),
        },
      ]}
    />
  );

}


// ----- Default Props ----- //

Weekly.defaultProps = {
  abTest: undefined,
};


// ----- Exports ----- //

export default Weekly;
