// @flow

// ----- Imports ----- //

import React from 'react';

import Countdown from 'components/countdown/countdown';
import { getEndTime } from 'helpers/flashSale';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import './flashSaleCountdown.scss';


// ----- Render ----- //
type PropTypes = {|
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId
|};

const FlashSaleCountdownInHero = ({ product, countryGroupId }: PropTypes) => (
  <div className="component-flash-sale-countdown-hero">
    <FlashSaleCountdown {...{ product, countryGroupId }} />
  </div>
);

function FlashSaleCountdown({ product, countryGroupId }: PropTypes) {
  return (
    <div className="component-flash-sale-countdown">
      <Countdown legend="until sale ends" to={getEndTime(product, countryGroupId)} />
    </div>
  );
}

export {
  FlashSaleCountdown,
  FlashSaleCountdownInHero,
};
