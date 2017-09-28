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
