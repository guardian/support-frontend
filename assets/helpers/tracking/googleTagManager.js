// @flow

// ----- Imports ----- //

import uuidv4 from 'uuid';
import * as storage from 'helpers/storage';
import { detect as detectCurrency } from '../internationalisation/currency';
import { getQueryParameter } from '../url';
import { detect as detectCountry } from '../internationalisation/country';


// ----- Functions ----- //

function getDataValue(name, generator) {
  let value = storage.getSession(name);
  if (value === null) {
    value = generator();
    storage.setSession(name, value);
  }
  return value;
}

function getCurrency() {
  return detectCurrency(detectCountry()).iso;
}

function getContributionValue() {
  const param = getQueryParameter('contributionValue');
  if (param) {
    storage.setSession('contributionValue', String(parseInt(param, 10)));
  }
  return storage.getSession('contributionValue') || 0;
}


// ----- Run ----- //

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
// $FlowFixMe
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','googleTagManagerDataLayer','GTM-5PKPPQZ');
/* eslint-enable */
// End Google Tag Manager
