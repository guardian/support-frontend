// @flow

// ----- Imports ----- //

import { getGlobal } from 'helpers/globals';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import {
  detect as detectCountryGroup,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';


export type PriceCopy = {
  price: number,
  discountCopy: string,
}

export type PricingCopy = {
  [SubscriptionProduct]: PriceCopy,
}

export type SubscriptionsLandingPropTypes = {|
  countryGroupId: CountryGroupId;
  pricingCopy: ?PricingCopy;
|}

export const subscriptionsLandingProps: SubscriptionsLandingPropTypes = {
  countryGroupId: detectCountryGroup(),
  pricingCopy: getGlobal('pricingCopy'),
};
