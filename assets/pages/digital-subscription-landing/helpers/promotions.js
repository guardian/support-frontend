// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { displayPrice } from 'helpers/subscriptions';


// ----- Functions ----- //

function showPromotion(): boolean {
  return getQueryParameter('utm_source') === 'eml' &&
    getQueryParameter('utm_medium') === 'emlf' &&
    getQueryParameter('utm_campaign') === 'SC_AD_Print_Upsell_270918_ID2';
}

function getPageTitle(cgId: CountryGroupId): string {
  if (showPromotion()) {
    return 'Upgrade your subscription to Paper+Digital now';
  }
  return `14-day free trial and then ${displayPrice('DigitalPack', cgId)}`;
}


// ----- Exports ----- //

export { getPageTitle, showPromotion };
