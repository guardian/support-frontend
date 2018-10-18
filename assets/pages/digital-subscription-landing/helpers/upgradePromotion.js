// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';


// ----- Functions ----- //

function showUpgradeMessage(): boolean {
  // ?utm_source=eml&utm_medium=emlf&utm_campaign=SC_AD_Print_Upsell_270918_ID2
  return getQueryParameter('utm_source') === 'eml' &&
    getQueryParameter('utm_medium') === 'emlf' &&
    getQueryParameter('utm_campaign') === 'SC_AD_Print_Upsell_270918_ID2';
}


// ----- Exports ----- //

export { showUpgradeMessage };
