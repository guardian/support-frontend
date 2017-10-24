// @flow

import uuidv4 from 'uuid';
import * as storage from 'helpers/storage';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import { getQueryParameter } from 'helpers/url';
import { detect as detectCountry } from 'helpers/internationalisation/country';

export type Dimensions = {|
  campaignCodeBusinessUnit?: string,
  campaignCodeTeam?: string,
  experience?: string,
|}

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

// ----- Exports ---//

export function pushDimensions(dimensions: Dimensions) {
  window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];
  window.googleTagManagerDataLayer.push(dimensions);
}

export function init() {
  window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];

  window.googleTagManagerDataLayer.push({
    // orderId anonymously identifies this user in this session.
    // We need this to prevent page refreshes on conversion pages being
    // treated as new conversions
    orderId: getDataValue('orderId', uuidv4),
    currency: getDataValue('currency', getCurrency),
    value: getContributionValue(),
  });
}
