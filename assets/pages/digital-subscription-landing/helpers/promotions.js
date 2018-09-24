// @flow

import { getQueryParameter } from 'helpers/url';

function showPromotion(): boolean {
  return getQueryParameter('utm_source') === 'eml' &&
    getQueryParameter('utm_medium') === 'emlf' &&
    getQueryParameter('utm_campaign') === 'SC_AD_Print_Upsell_270918_ID2';
}

function getPageTitle(): string {
  if (showPromotion()) {
    return 'Upgrade your subscription to Paper+Digital now';
  }
  return 'Get the full digital experience of The Guardian';
}

export { getPageTitle, showPromotion };
