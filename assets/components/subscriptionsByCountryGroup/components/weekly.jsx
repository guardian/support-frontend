// @flow

// ----- Imports  ----- //

import React from 'react';

import { type HeadingSize } from 'components/heading/heading';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';


// ----- Component ----- //

function Weekly(props: { headingSize: HeadingSize, url: string, subheading: string }) {

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
        },
      ]}
    />
  );

}


// ----- Exports ----- //

export default Weekly;
