// @flow

import React, { type Node } from 'react';

import { Error } from 'components/forms/customFields/error';

import './stripeForm.scss';

type PropTypes = {
  error: string,
  children: Node,
  className: string,
  classNameError: string,
  fieldLabel: string,
  fieldName: string,
}

const CardElementWrapper = (props: PropTypes) => (
  <div>
    <label htmlFor={props.fieldLabel} className={props.error ? props.classNameError : props.className}>
      <span>{props.fieldName}</span>
      <span>{props.children}</span>
      <span>{props.error && <Error htmlFor={props.fieldLabel} error={props.error} />}</span>
    </label>
  </div>
);

export {
  CardElementWrapper,
};
