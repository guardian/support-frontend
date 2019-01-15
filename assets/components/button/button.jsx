// @flow

// ----- Imports ----- //

import React from 'react';

import DangerouslySetButtonOnAnyElement, { defaultProps, type PropTypes } from './dangerouslySetButtonOnAnyElement';
import './button.scss';

// ----- Render ----- //

type AllPropTypes = {
  ...PropTypes,
  'aria-label': ?string,
};

const Button = (props: AllPropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="button"
    {...props}
  />
);

Button.defaultProps = {
  ...defaultProps,
};

export default Button;
