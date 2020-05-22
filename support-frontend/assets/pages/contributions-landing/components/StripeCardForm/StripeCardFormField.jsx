// @flow
import React from 'react';
import type { Node } from 'react';
import './stripeCardForm.scss';

type PropTypes = {|
  labelChildren: Node,
  hintChildren?: Node,
  inputChildren: Node,
  error: boolean,
|}

export function StripeCardFormField(props: PropTypes) {


  return (
    <>
      <div
        className="ds-stripe-card-form-field"
      >
        {props.labelChildren}
      </div>
      {props.hintChildren || null}
      <div
        className={`ds-stripe-card-input ${props.error ? 'ds-stripe-card-input-error' : ''}`}
      >
        {props.inputChildren}
      </div>
    </>
  );
}
