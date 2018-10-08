// @flow

import React from 'react';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';
import { displayPrice, sendTrackingEventsOnClick } from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ComponentAbTest } from 'helpers/subscriptions';

// ----- Types ----- //

type PropTypes = {|
  url: string,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | null,
  gridId: 'paperDigitalCirclePink' | 'paperDigitalCircleOrange'
|};


// ----- Component ----- //

export default function PaperDigital(props: PropTypes) {
  return (

    <SubscriptionBundle
      modifierClass="paper-digital"
      heading="Paper+Digital"
      subheading={`from ${displayPrice('PaperAndDigital', props.countryGroupId)}`}
      headingSize={3}
      benefits={{
        list: false,
        copy: 'All the benefits of a paper subscription, plus access to the digital pack',
      }}
      gridImage={{
        gridId: props.gridId,
        altText: 'paper + digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Choose a package',
          url: props.url,
          accessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
          modifierClasses: ['border'],
          onClick: sendTrackingEventsOnClick('paper_digital_cta', 'PaperAndDigital', props.abTest),
        },
      ]}

    />
  );
}
