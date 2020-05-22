// @flow
import React from 'react';
import type { Node } from 'react';
import './stripeCardForm.scss';

type PropTypes = {|
  label: Node,
  hint?: Node,
  input: Node,
  error: boolean,
|}

export function StripeCardFormField(props: PropTypes) {


  return (
    <>
      <div
        className="ds-stripe-card-form-field"
      >
        {props.label}
      </div>
      {props.hint || null}
      <div
        className={`ds-stripe-card-input ${props.error ? 'ds-stripe-card-input-error' : ''}`}
      >
        {props.input}
      </div>
    </>
  );
}
