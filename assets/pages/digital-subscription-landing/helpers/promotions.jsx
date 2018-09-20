// @flow

import { getQueryParameter } from 'helpers/url';

function showPromotion(): boolean {
  return getQueryParameter('promoCode', null) === 'the_code'; // TODO: need the actual code here
}


function getPageTitle(): string {
  if (showPromotion()) {
    return 'Upgrade your subscription to Paper+Digital now';
  }
  return 'Support The Guardian with a digital subscription';
}

export { getPageTitle, showPromotion };
