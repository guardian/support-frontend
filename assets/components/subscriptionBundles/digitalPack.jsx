// @flow

// ----- Imports  ----- //

import React from 'react';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';
import { flashSaleIsActive } from 'helpers/flashSale';

import { type ImageId } from 'helpers/theGrid';
import {
  type ComponentAbTest,
  discountedDisplayPrice,
  displayPrice,
  sendTrackingEventsOnClick,
} from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

function getFlashSaleCopy(countryGroupId: CountryGroupId) {
  if (countryGroupId === 'GBPCountries') {
    return {
      subHeading: <span>{discountedDisplayPrice('DigitalPack', countryGroupId)} - save 50%</span>,
      description:
      // eslint-disable-next-line react/jsx-indent
        <span>Ad-free reading on all devices, including the Premium App and Daily Edition iPad app.
          <strong> Free 14 day trial, then save 50% for three months.</strong>
        </span>,

    };
  }
  return {
    subHeading: 'Save 50% for three months',
    description: 'The Guardian ad-free on all devices, including the Premium App and Daily Edition iPad app. Free 14 day trial, then save 50% for three months.',
  };
}

function getCopy(countryGroupId: CountryGroupId) {
  if (flashSaleIsActive('DigitalPack')) {
    return getFlashSaleCopy(countryGroupId);
  }

  if (countryGroupId === 'GBPCountries') {
    return {
      subHeading: displayPrice('DigitalPack', countryGroupId),
      description: 'The premium app and the daily edition iPad app in one pack, plus ad-free reading on all your devices',
    };
  }
  return {
    subHeading: '14-day free trial',
    description: 'The premium app and the daily edition iPad app of the UK newspaper in one pack, plus ad-free reading on all your devices',
  };
}

// ----- Component ----- //

function DigitalPack(props: {
  countryGroupId: CountryGroupId,
  url: string,
  gridId: ImageId,
  abTest: ComponentAbTest | null,
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
          onClick: sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', props.abTest),
        },
      ]}
    />
  );

}


// ----- Default Props ----- //

DigitalPack.defaultProps = {
  abTest: null,
};


// ----- Exports ----- //

export default DigitalPack;
