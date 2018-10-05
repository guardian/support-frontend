// @flow

import React from 'react';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ComponentAbTest } from 'helpers/subscriptions';
import { displayPrice, sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

// ----- Types ----- //

type PropTypes = {|
  url: string,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | null,
|};


// ----- Component ----- //

export default function Paper(props: PropTypes) {
  return (
    <SubscriptionBundle
      modifierClass="paper"
      heading="Paper"
      subheading={`from ${displayPrice('Paper', props.countryGroupId)}`}
      headingSize={3}
      benefits={{
        list: false,
        copy: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
      }}
      gridImage={{
        gridId: 'paperCircle',
        altText: 'paper subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Choose a package',
          url: props.url,
          accessibilityHint: 'Proceed to paper subscription options',
          modifierClasses: ['border'],
          onClick: sendTrackingEventsOnClick('paper_cta', 'Paper', props.abTest),
        },
      ]}
    />
  );
}
