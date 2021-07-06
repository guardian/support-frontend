// ----- Imports ----- //
import { getGlobal } from "helpers/globalsAndSwitches/globals";
import { SubscriptionProduct } from "helpers/productPrice/subscriptions";
import { CountryGroupId } from "helpers/internationalisation/countryGroup";
import { detect as detectCountryGroup } from "helpers/internationalisation/countryGroup";
import { ReferrerAcquisitionData } from "helpers/tracking/acquisitions";
import { getReferrerAcquisitionData } from "helpers/tracking/acquisitions";
import { detect as detectCountry } from "helpers/internationalisation/country";
import { Participations } from "helpers/abTests/abtest";
import { init as initAbTests } from "helpers/abTests/abtest";
import { getSettings } from "helpers/globalsAndSwitches/globals";
export type PriceCopy = {
  price: number;
  discountCopy: string;
};
export type PricingCopy = Record<SubscriptionProduct, PriceCopy>;
export type SubscriptionsLandingPropTypes = {
  countryGroupId: CountryGroupId;
  participations: Participations;
  pricingCopy: PricingCopy | null | undefined;
  referrerAcquisitions: ReferrerAcquisitionData;
};
const countryGroupId = detectCountryGroup();
export const subscriptionsLandingProps = (): SubscriptionsLandingPropTypes => ({
  countryGroupId,
  participations: initAbTests(detectCountry(), countryGroupId, getSettings()),
  pricingCopy: getGlobal('pricingCopy'),
  referrerAcquisitions: getReferrerAcquisitionData()
});