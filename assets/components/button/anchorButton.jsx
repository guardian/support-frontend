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

const AnchorButton = (props: PropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="a"
    {...props}
  />
);

AnchorButton.defaultProps = {
  ...defaultProps,
};

export default AnchorButton;
