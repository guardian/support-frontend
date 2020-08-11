// Google Tag Manager
/* eslint-disable */
import { doNotTrack } from 'helpers/tracking/doNotTrack';
import { getTrackingConsent, type ThirdPartyTrackingConsent, OptedIn, onConsentChangeEvent } from './thirdPartyTrackingConsent';

// Default userHasGrantedConsent to false
let userHasGrantedConsent: boolean = false;
// Default scriptAdded to false
let scriptAdded: boolean = false;

/**
 * onConsentChangeEvent() will only execute the callback it receives
 * if cmp.init() has already been called. cmp.init() is called in a seperate
 * 'main bundle' (see page.js), which is loaded and executed
 * before this 'googleTagManagerScript bundle'. This is due to the
 * script ordering in main.scala.html, where the googleTagManagerScript
 * script has the 'defer' attribute and comes after the main bundle
 * which has the 'async' attribute.
 */

/**
 * The callback passed to onConsentChangeEvent is called
 * each time consent changes. EG. if a user consents via the CMP.
 */
onConsentChangeEvent((thirdPartyTrackingConsent: ThirdPartyTrackingConsent) => {
  /**
   * update userHasGrantedConsent value when
   * consent changes via the CMP library.
   */
  userHasGrantedConsent = thirdPartyTrackingConsent === OptedIn;

  console.log('userHasGrantedConsent --->', userHasGrantedConsent);
  console.log('scriptAdded --->', scriptAdded);

  if (userHasGrantedConsent && !scriptAdded) {
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
      /**
       * set scriptAdded to true so we don't try and add more than once
       * if a user toggles there consent state.
      */
      scriptAdded = true;
    })(window, document, 'script', 'googleTagManagerDataLayer', 'GTM-W6GJ68L');
  }
});

/* eslint-enable */
// End Google Tag Manager
