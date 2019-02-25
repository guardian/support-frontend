// @flow

import { set as setCookie } from 'helpers/cookie';

export default function storeReferrer() {
  const cookieExpiryDays = 30;
  const parsedUrl = new URL(window.location.href);
  const utmSource = parsedUrl.searchParams.get('utm_source');
  const utmMedium = parsedUrl.searchParams.get('utm_medium');
  const gclid = parsedUrl.searchParams.get('gclid'); // Google AdWords
  if (utmSource && utmMedium) {
    setCookie('gu_referrer_channel', `${utmSource}&${utmMedium}`, cookieExpiryDays);
  } else if (gclid) {
    setCookie('gu_referrer_channel', 'google&adwords', cookieExpiryDays);
  }

}
