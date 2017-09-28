import uuidv4 from 'uuid';
import { forCountry } from '../internationalisation/currency';
import { get as getCookie } from '../cookie';

// Generates a uuid to anonymously identify this user in this session.
// We need this to prevent page refreshes on conversion pages being
// treated as new conversions
export function getOrderId() {
  let orderId = sessionStorage.getItem('orderId');
  if (orderId === null) {
    orderId = uuidv4();
    sessionStorage.setItem('orderId', orderId);
  }
  return orderId;
}

export function getCurrency() {
  const country = getCookie('GU_country');
  return forCountry(country).iso;
}

window.googleTagManagerDataLayer = [{
  orderId: getOrderId(),
  currency: getCurrency(),
  value: 1.00,
}];
