// @flow

// ----- Imports  ----- //

import React from 'react';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';
import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';

import { type ImageId } from 'helpers/theGrid';
import {
  type ComponentAbTest,
  displayPrice,
  sendTrackingEventsOnClick,
} from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

function getCopy(countryGroupId: CountryGroupId) {
  if (flashSaleIsActive('DigitalPack', countryGroupId)) {
    const saleCopy = getSaleCopy('DigitalPack', countryGroupId);
    return {
      subHeading: <span>{saleCopy.bundle.subHeading}</span>,
      description: <span>{saleCopy.bundle.description}</span>,
    };
  }
  if (countryGroupId === 'GBPCountries') {
    return {
      subHeading: displayPrice('DigitalPack', countryGroupId),
      description: 'The Premium App and the daily edition iPad app in one pack, plus ad-free reading on all your devices',
    };
  }
  return {
    subHeading: '14-day free trial',
    description: 'The Premium App and the daily edition iPad app of the UK newspaper in one pack, plus ad-free reading on all your devices',
  };
}

// ----- Component ----- //

function DigitalPack(props: {
  countryGroupId: CountryGroupId,
  url: string,
  gridId: ImageId,
  abTest: ComponentAbTest | null,
  context: string,
}) {
  const copy = getCopy(props.countryGroupId);
  return (
    <SubscriptionBundle
      modifierClass="digital"
      heading="Digital Pack"
      subheading={copy.subHeading}
      headingSize={3}
      benefits={{
        list: false,
        copy: copy.description,
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
          onClick: sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', props.abTest, props.context),
        },
      ]}
    />
  );

}


// ----- Default Props ----- //

DigitalPack.defaultProps = {
  abTest: null,
  context: 'digital-subscription',
};


// ----- Exports ----- //

export default DigitalPack;
