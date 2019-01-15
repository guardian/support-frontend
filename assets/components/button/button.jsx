// @flow

// ----- Imports ----- //

import React from 'react';

import DangerouslySetButtonOnAnyElement, { defaultProps, type GenericPropTypes } from './dangerouslySetButtonOnAnyElement';
import './button.scss';

// ----- Render ----- //

type PropTypes = {
  ...GenericPropTypes,
  'aria-label': ?string,
};

const Button = (props: PropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="button"
    {...props}
  />
);

Button.defaultProps = {
  ...defaultProps,
};

export default Button;
