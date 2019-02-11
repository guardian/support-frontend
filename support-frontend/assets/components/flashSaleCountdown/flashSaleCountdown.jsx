// @flow

// ----- Imports ----- //

import React from 'react';

import Countdown from 'components/countdown/countdown';
import { getEndTime } from 'helpers/flashSale';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Render ----- //

function FlashSaleCountdown({ product, countryGroupId }: {
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId }) {
  return (
    <div className="component-flash-sale-countdown">
      <Countdown legend="until sale ends" to={getEndTime(product, countryGroupId)} />
    </div>
  );
}

export {
  FlashSaleCountdown,
};
