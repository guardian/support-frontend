// @flow

// ----- Imports ----- //

import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
  detect as detectCountryGroup,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import {
  getReferrerAcquisitionData,
  type ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';

import { detect as detectCountry } from 'helpers/internationalisation/country';
import { init as initAbTests, type Participations } from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globalsAndSwitches/globals';

export type PriceCopy = {
  price: number,
  discountCopy: string,
}

export type PricingCopy = {
  [SubscriptionProduct]: PriceCopy,
}

export type SubscriptionsLandingPropTypes = {|
  countryGroupId: CountryGroupId;
  participations: Participations;
  pricingCopy: ?PricingCopy;
  referrerAcquisitions: ReferrerAcquisitionData;
|}

const countryGroupId = detectCountryGroup();

export const subscriptionsLandingProps = (): SubscriptionsLandingPropTypes => ({
  countryGroupId,
  participations: initAbTests(detectCountry(), countryGroupId, getSettings()),
  pricingCopy: getGlobal('pricingCopy'),
  referrerAcquisitions: getReferrerAcquisitionData(),
});
