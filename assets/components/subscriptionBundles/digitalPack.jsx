// @flow

// ----- Imports  ----- //

import React from 'react';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import { type ImageId } from 'helpers/theGrid';
import {
  type ComponentAbTest,
  displayDigitalPackBenefitCopy,
  displayPrice,
  sendTrackingEventsOnClick,
} from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Component ----- //

function DigitalPack(props: {
  countryGroupId: CountryGroupId,
  url: string,
  gridId: ImageId,
  subheading?: string | null,
  abTest: ComponentAbTest | null,
}) {
  const subHeadingCopy = props.subheading || displayPrice('DigitalPack', props.countryGroupId);
  return (
    <SubscriptionBundle
      modifierClass="digital"
      heading="Digital Pack"
      subheading={subHeadingCopy}
      headingSize={3}
      benefits={{
        list: false,
        copy: displayDigitalPackBenefitCopy(props.countryGroupId),
      }}
      gridImage={{
        gridId: props.gridId,
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Find out more',
          url: props.url,
          accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
          modifierClasses: ['border'],
          onClick: sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', props.abTest),
        },
      ]}
    />
  );

}


// ----- Default Props ----- //

DigitalPack.defaultProps = {
  abTest: null,
  subheading: null,
};


// ----- Exports ----- //

export default DigitalPack;
