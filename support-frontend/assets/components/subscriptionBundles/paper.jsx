// @flow

import React from 'react';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import type { ComponentAbTest } from 'helpers/subscriptions';
import { displayPrice, sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';
import { flashSaleIsActive, getSaleCopy, getFormattedFlashSalePrice } from 'helpers/flashSale';

// ----- Types ----- //

type PropTypes = {|
  url: string,
  abTest: ComponentAbTest | null,
  context: string,
|};


// ----- Component ----- //

function getCopy() {
  if (flashSaleIsActive('Paper', 'GBPCountries')) {
    const saleCopy = getSaleCopy('Paper', 'GBPCountries');
    const salePrice = getFormattedFlashSalePrice('Paper', 'GBPCountries');
    return {
      subHeading: `from £${salePrice}/Monthly`,
      description: `${saleCopy.bundle.description}`,
    };
  }
  return {
    subHeading: `from ${displayPrice('Paper', 'GBPCountries')}`,
    description: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
  };
}

export default function Paper(props: PropTypes) {
  const copy = getCopy();
  return (
    <SubscriptionBundle
      modifierClass="paper"
      heading="Paper"
      subheading={copy.subHeading}
      headingSize={3}
      benefits={{
        list: false,
        copy: copy.description,
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
          onClick: sendTrackingEventsOnClick('paper_cta', 'Paper', props.abTest, props.context),
        },
      ]}
    />
  );
}

Paper.defaultProps = {
  context: 'paper-subscription',
};
