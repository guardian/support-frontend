// @flow

import { getQueryParameter } from 'helpers/url';

function showPromotion(): boolean {
  return getQueryParameter('promoCode') === 'the_code'; // TODO: need the actual code here
}


function getPageTitle(): string {
  if (showPromotion()) {
    return 'Upgrade your subscription to Paper+Digital now';
  }
  return 'Get the full digital experience of The Guardian';
}

export { getPageTitle, showPromotion };
