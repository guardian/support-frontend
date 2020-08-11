// Google Tag Manager
/* eslint-disable */
import { doNotTrack } from 'helpers/tracking/doNotTrack';
import { getTrackingConsent, type ThirdPartyTrackingConsent, OptedIn } from './thirdPartyTrackingConsent';


/**
 * getTrackingConsent() will only resolve if cmp.init()
 * has already been called. cmp.init() is called in a seperate
 * 'main bundle' (see page.js), which is loaded and executed
 * before this 'googleTagManagerScript bundle'. This is due to the
 * script ordering in main.scala.html, where the googleTagManagerScript
 * script has the 'defer' attribute and comes after the main bundle
 * which has the 'async' attribute.
 */
getTrackingConsent().then((thirdPartyTrackingConsent: ThirdPartyTrackingConsent) => {
  if(!doNotTrack() && thirdPartyTrackingConsent === OptedIn) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start':
          new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src =
        // $FlowFixMe
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'googleTagManagerDataLayer', 'GTM-W6GJ68L');
  }
})

/* eslint-enable */
// End Google Tag Manager
