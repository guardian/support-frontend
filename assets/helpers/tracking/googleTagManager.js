import uuidv4 from 'uuid';
import { forCountry } from '../internationalisation/currency';
import { getQueryParameter } from '../url';
import { detect as detectCountry } from '../internationalisation/country';

function getDataValue(name, generator) {
  let value = sessionStorage.getItem(name);
  if (value === null) {
    value = generator();
    sessionStorage.setItem(name, value);
  }
  return value;
}

function getCurrency() {
  return forCountry(detectCountry()).iso;
}

function getContributionValue() {
  const param = getQueryParameter('contributionValue');
  if (param) {
    sessionStorage.setItem('contributionValue', parseInt(param, 10));
  }
  return sessionStorage.getItem('contributionValue') || 0;
}

window.googleTagManagerDataLayer = [{
  // orderId anonymously identifies this user in this session.
  // We need this to prevent page refreshes on conversion pages being
  // treated as new conversions
  orderId: getDataValue('orderId', uuidv4),
  currency: getDataValue('currency', getCurrency),
  value: getContributionValue(),
}];

// Google Tag Manager
/* eslint-disable */
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','googleTagManagerDataLayer','GTM-5PKPPQZ');
/* eslint-enable */
// End Google Tag Manager
