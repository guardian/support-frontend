import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from 'react-stripe-elements';

const CardNumber = () => (
  <label htmlFor="card-details">
    Card number
    <CardNumberElement style={{ base: { fontSize: '18px' } }} />
  </label>
);

const CardExpiry = () => (
  <label htmlFor="expiry">
    Expiry date
    <CardExpiryElement style={{ base: { fontSize: '18px' } }} />
  </label>
);

const CardCvc = () => (
  <label htmlFor="cvc">
    CVC
    <CardCvcElement style={{ base: { fontSize: '18px' } }} />
  </label>
);

export {
  CardNumber,
  CardExpiry,
  CardCvc,
};
