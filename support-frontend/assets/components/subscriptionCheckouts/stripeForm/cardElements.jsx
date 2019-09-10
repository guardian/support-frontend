// @flow

import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from 'react-stripe-elements';
import { Error } from 'components/forms/customFields/error';

import './stripeForm.scss';

const baseStyles = {
  fontSize: '16px',
  color: '#000',
  '::placeholder': {
    color: 'white',
  },
};

const invalidStyles = {
  color: '#c70000',
};

type PropTypes = {
  error: string,
  handleChange: Function,
}

const CardNumber = (props: PropTypes) => (
  <label htmlFor="card-details" className="component-credit-card-label">
    Card number
    {props.error && <Error htmlFor="card-details" error={props.error} />}
    <CardNumberElement
      style={{ base: { ...baseStyles }, invalid: { ...invalidStyles } }}
      onChange={e => props.handleChange(e)}
    />
  </label>
);

const CardExpiry = (props: PropTypes) => (
  <div className="component-credit-card-inline-elements">
    <label htmlFor="expiry" className="component-credit-card-label">
      Expiry date
      {props.error && <Error htmlFor="expiry" error={props.error} />}
      <CardExpiryElement
        style={{ base: { ...baseStyles }, invalid: { ...invalidStyles } }}
        onChange={e => props.handleChange(e)}
      />
    </label>
  </div>
);

const CardCvc = (props: PropTypes) => (
  <div className="component-credit-card-inline-elements">
    <label htmlFor="cvc" className="component-credit-card-label">
      CVC
      {props.error && <Error htmlFor="cvc" error={props.error} />}
      <CardCvcElement
        style={{ base: { ...baseStyles }, invalid: { ...invalidStyles } }}
        onChange={e => props.handleChange(e)}
      />
    </label>
  </div>
);

export {
  CardNumber,
  CardExpiry,
  CardCvc,
};
